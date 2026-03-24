<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
