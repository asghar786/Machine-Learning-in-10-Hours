<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SubmissionController extends Controller
{
    /**
     * POST /api/v1/submissions
     * Create a new submission with status=pending.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'exercise_id'  => ['required', 'integer', 'exists:exercises,id'],
                'notebook_url' => ['nullable', 'string', 'url', 'max:2048'],
                'code_content' => ['nullable', 'string'],
            ]);

            if (empty($validated['notebook_url']) && empty($validated['code_content'])) {
                return response()->json([
                    'success' => false,
                    'data'    => null,
                    'message' => 'Either notebook_url or code_content is required.',
                ], 422);
            }

            $submission = Submission::create([
                'user_id'      => $request->user()->id,
                'exercise_id'  => $validated['exercise_id'],
                'notebook_url' => $validated['notebook_url'] ?? null,
                'code_content' => $validated['code_content'] ?? null,
                'status'       => 'pending',
                'submitted_at' => now(),
            ]);

            $submission->load('exercise');

            return response()->json([
                'success' => true,
                'data'    => $submission,
                'message' => 'Submission created successfully.',
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
                'message' => 'Submission failed. Please try again.',
            ], 500);
        }
    }

    /**
     * GET /api/v1/submissions/me
     * List the authenticated user's submissions with exercise details.
     */
    public function mySubmissions(Request $request): JsonResponse
    {
        $submissions = Submission::where('user_id', $request->user()->id)
            ->with('exercise')
            ->orderBy('submitted_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $submissions,
            'message' => 'Submissions retrieved successfully.',
        ], 200);
    }
}
