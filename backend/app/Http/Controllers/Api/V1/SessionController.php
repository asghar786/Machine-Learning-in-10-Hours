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

        // Attach user's latest submission to each exercise
        $exerciseIds = $exercises->pluck('id');
        $submissions = \App\Models\Submission::where('user_id', $request->user()->id)
            ->whereIn('exercise_id', $exerciseIds)
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->keyBy('exercise_id');

        $exercises->each(function ($ex) use ($submissions) {
            $ex->my_submission = $submissions->get($ex->id);
        });

        $session->setRelation('exercises', $exercises);

        // Load course with all sessions + user's submitted session numbers for progress
        $allSessions = $course->sessions()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get(['id', 'session_number', 'title', 'duration_minutes']);

        // Which sessions has the user submitted at least one exercise for?
        $submittedSessionIds = \App\Models\Submission::where('user_id', $request->user()->id)
            ->whereHas('exercise', fn($q) => $q->whereIn(
                'session_id',
                $allSessions->pluck('id')
            ))
            ->with('exercise:id,session_id')
            ->get()
            ->pluck('exercise.session_id')
            ->unique()
            ->values();

        $session->setRelation('course', (object)[
            'id'             => $course->id,
            'title'          => $course->title,
            'slug'           => $course->slug,
            'total_sessions' => $allSessions->count(),
            'sessions'       => $allSessions->map(fn($s) => [
                'id'             => $s->id,
                'session_number' => $s->session_number,
                'title'          => $s->title,
                'submitted'      => $submittedSessionIds->contains($s->id),
            ]),
        ]);

        return response()->json([
            'success' => true,
            'data'    => $session,
            'message' => 'Session retrieved successfully.',
        ], 200);
    }
}
