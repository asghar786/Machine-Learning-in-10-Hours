<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\EnrollmentConfirmedEmail;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Webhook;

class PaymentController extends Controller
{
    /**
     * GET /api/v1/payments
     * Return the authenticated student's payment history.
     */
    public function index(Request $request): JsonResponse
    {
        $payments = Payment::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $summary = [
            'total_paid'    => $payments->where('status', 'paid')->sum('amount'),
            'total_count'   => $payments->count(),
            'paid_count'    => $payments->where('status', 'paid')->count(),
            'pending_count' => $payments->where('status', 'pending')->count(),
        ];

        return response()->json([
            'success' => true,
            'data'    => [
                'payments' => $payments,
                'summary'  => $summary,
            ],
            'message' => 'Payment history retrieved.',
        ]);
    }

    /**
     * GET /api/v1/payments/{id}
     * Return a single payment/invoice detail.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $payment = Payment::where('user_id', $request->user()->id)
            ->with('enrollment.course')
            ->find($id);

        if (! $payment) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Invoice not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $payment,
            'message' => 'Invoice retrieved.',
        ]);
    }

    /**
     * POST /api/v1/payments/checkout
     * Create a Stripe Checkout Session for a course.
     * Returns { checkout_url } for frontend redirect.
     */
    public function createCheckout(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);

        $user   = $request->user();
        $course = Course::findOrFail($request->course_id);

        // Already enrolled?
        if (Enrollment::where('user_id', $user->id)->where('course_id', $course->id)->exists()) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'You are already enrolled in this course.',
            ], 409);
        }

        // Free course — enroll directly without Stripe
        if ((float) $course->price <= 0) {
            $enrollment = Enrollment::create([
                'user_id'     => $user->id,
                'course_id'   => $course->id,
                'enrolled_at' => now(),
            ]);
            $enrollment->load('course');
            Payment::create([
                'user_id'        => $user->id,
                'enrollment_id'  => $enrollment->id,
                'invoice_number' => Payment::generateInvoiceNumber(),
                'course_title'   => $course->title,
                'amount'         => 0,
                'currency'       => 'USD',
                'status'         => 'paid',
                'payment_method' => 'free',
                'transaction_id' => 'FREE-' . strtoupper(substr(md5(uniqid()), 0, 10)),
                'paid_at'        => now(),
            ]);
            try { Mail::to($user->email)->send(new EnrollmentConfirmedEmail($enrollment)); } catch (\Throwable) {}
            return response()->json([
                'success'  => true,
                'data'     => ['enrolled' => true],
                'message'  => 'Enrolled successfully (free course).',
            ], 201);
        }

        // Paid course — create Stripe Checkout Session
        Stripe::setApiKey(config('stripe.secret'));

        $appUrl = config('app.url');

        $session = \Stripe\Checkout\Session::create([
            'mode'         => 'payment',
            'customer_email' => $user->email,
            'line_items'   => [[
                'price_data' => [
                    'currency'     => 'usd',
                    'unit_amount'  => (int) round($course->price * 100), // cents
                    'product_data' => [
                        'name'        => $course->title,
                        'description' => $course->short_description ?? $course->title,
                    ],
                ],
                'quantity' => 1,
            ]],
            'metadata' => [
                'user_id'   => $user->id,
                'course_id' => $course->id,
            ],
            'success_url' => $appUrl . '/dashboard?enrolled=1&course=' . $course->slug,
            'cancel_url'  => $appUrl . '/courses/' . $course->slug . '?payment=cancelled',
        ]);

        return response()->json([
            'success' => true,
            'data'    => ['checkout_url' => $session->url],
            'message' => 'Checkout session created.',
        ]);
    }

    /**
     * POST /api/v1/payments/webhook
     * Handle Stripe webhook events (no auth required — verified via signature).
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig     = $request->header('Stripe-Signature');
        $secret  = config('stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sig, $secret);
        } catch (SignatureVerificationException $e) {
            Log::warning('Stripe webhook signature failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session  = $event->data->object;
            $meta     = $session->metadata;
            $userId   = (int) $meta->user_id;
            $courseId = (int) $meta->course_id;

            // Idempotent — don't double-enroll
            if (Enrollment::where('user_id', $userId)->where('course_id', $courseId)->exists()) {
                return response()->json(['status' => 'already enrolled']);
            }

            $course     = Course::find($courseId);
            $enrollment = Enrollment::create([
                'user_id'     => $userId,
                'course_id'   => $courseId,
                'enrolled_at' => now(),
            ]);
            $enrollment->load('course');

            Payment::create([
                'user_id'        => $userId,
                'enrollment_id'  => $enrollment->id,
                'invoice_number' => Payment::generateInvoiceNumber(),
                'course_title'   => $course->title ?? 'Course',
                'amount'         => ($session->amount_total ?? 0) / 100,
                'currency'       => strtoupper($session->currency ?? 'USD'),
                'status'         => 'paid',
                'payment_method' => 'card',
                'transaction_id' => $session->payment_intent ?? $session->id,
                'paid_at'        => now(),
            ]);

            // Send enrollment confirmation email
            try {
                $user = \App\Models\User::find($userId);
                if ($user) Mail::to($user->email)->send(new EnrollmentConfirmedEmail($enrollment));
            } catch (\Throwable) {}
        }

        return response()->json(['status' => 'ok']);
    }
}
