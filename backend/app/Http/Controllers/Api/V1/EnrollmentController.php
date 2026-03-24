<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EnrollmentController extends Controller
{
    /**
     * POST /api/v1/enrollments
     * Enroll the authenticated user in a course.
     */
    public function enroll(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'course_id' => ['required', 'integer', 'exists:courses,id'],
            ]);

            $userId = $request->user()->id;

            $exists = Enrollment::where('user_id', $userId)
                ->where('course_id', $validated['course_id'])
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'data'    => null,
                    'message' => 'You are already enrolled in this course.',
                ], 409);
            }

            $enrollment = Enrollment::create([
                'user_id'     => $userId,
                'course_id'   => $validated['course_id'],
                'enrolled_at' => now(),
            ]);

            $enrollment->load('course');

            // Auto-create payment record for this enrollment
            $course = $enrollment->course;
            $amount = $course->price ?? 0;
            Payment::create([
                'user_id'        => $userId,
                'enrollment_id'  => $enrollment->id,
                'invoice_number' => Payment::generateInvoiceNumber(),
                'course_title'   => $course->title ?? 'Course Enrollment',
                'amount'         => $amount,
                'currency'       => 'USD',
                'status'         => $amount > 0 ? 'paid' : 'paid',
                'payment_method' => 'card',
                'transaction_id' => 'TXN-' . strtoupper(substr(md5(uniqid()), 0, 12)),
                'paid_at'        => now(),
            ]);

            return response()->json([
                'success' => true,
                'data'    => $enrollment,
                'message' => 'Enrolled successfully.',
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $e->getMessage(),
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Enrollment failed. Please try again.',
            ], 500);
        }
    }

    /**
     * GET /api/v1/enrollments/me
     * List the authenticated user's enrollments with course details.
     */
    public function myEnrollments(Request $request): JsonResponse
    {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->with('course')
            ->orderBy('enrolled_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $enrollments,
            'message' => 'Enrollments retrieved successfully.',
        ], 200);
    }
}
