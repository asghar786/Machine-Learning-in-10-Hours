<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    /**
     * GET /api/v1/courses/{slug}/sessions/{number}
     * Return a session with exercises filtered to the authenticated user's A/B group.
     */
    public function show(Request $request, string $courseSlug, int $sessionNumber): JsonResponse
    {
        $course = Course::where('slug', $courseSlug)
            ->where('is_published', true)
            ->first();

        if (! $course) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Course not found.',
            ], 404);
        }

        $session = CourseSession::where('course_id', $course->id)
            ->where('session_number', $sessionNumber)
            ->where('is_published', true)
            ->first();

        if (! $session) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Session not found.',
            ], 404);
        }

        $userGroup = $request->user()->group ?? 0;

        $exercises = $session->exercises()
            ->where('is_published', true)
            ->where('group', $userGroup)
            ->orderBy('sort_order')
            ->get();

        $session->setRelation('exercises', $exercises);

        return response()->json([
            'success' => true,
            'data'    => $session,
            'message' => 'Session retrieved successfully.',
        ], 200);
    }
}
