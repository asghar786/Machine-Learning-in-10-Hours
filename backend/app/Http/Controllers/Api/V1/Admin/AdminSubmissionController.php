<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminSubmissionController extends Controller
{
    private function adminGuard(Request $request): ?JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Forbidden. Admin access required.',
            ], 403);
        }
        return null;
    }

    /**
     * GET /api/v1/admin/submissions
     * Paginate submissions (20 per page) with user and exercise. Supports ?status= filter.
     */
    public function index(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $query = Submission::with(['user:id,name,email', 'exercise:id,title,session_id'])
            ->orderBy('submitted_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $submissions = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $submissions,
            'message' => 'Submissions retrieved successfully.',
        ], 200);
    }

    /**
     * POST /api/v1/admin/submissions/{id}/grade
     * Grade a submission: set score, feedback, status=graded, graded_by, graded_at.
     */
    public function grade(Request $request, int $id): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $submission = Submission::find($id);
        if (! $submission) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Submission not found.',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'score'    => ['required', 'integer', 'min:0'],
                'feedback' => ['nullable', 'string'],
            ]);

            $submission->update([
                'score'     => $validated['score'],
                'feedback'  => $validated['feedback'] ?? null,
                'status'    => 'graded',
                'graded_by' => $request->user()->id,
                'graded_at' => now(),
            ]);

            // Check course completion
            $exercise = $submission->exercise()->with('session')->first();
            if ($exercise && $exercise->session) {
                $service = new \App\Services\CourseCompletionService();
                $service->checkAndCertify($submission->user_id, $exercise->session->course_id);
            }

            return response()->json([
                'success' => true,
                'data'    => $submission->fresh(['user', 'exercise', 'grader']),
                'message' => 'Submission graded successfully.',
            ], 200);
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
                'message' => 'Failed to grade submission.',
            ], 500);
        }
    }
}
