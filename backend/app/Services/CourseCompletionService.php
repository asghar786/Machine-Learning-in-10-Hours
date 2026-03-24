<?php
namespace App\Services;

use App\Jobs\GenerateCertificateJob;
use App\Models\Enrollment;
use App\Models\Exercise;
use App\Models\Submission;

class CourseCompletionService
{
    public function checkAndCertify(int $userId, int $courseId): bool
    {
        // Get all published exercises for this course (filtered by user's group)
        $user = \App\Models\User::findOrFail($userId);
        $group = $user->group !== null ? ($user->group == 0 ? 'A' : 'B') : null;

        $exercisesQuery = Exercise::whereHas('session', function ($q) use ($courseId) {
            $q->where('course_id', $courseId)->where('is_published', true);
        })->where('is_published', true);

        if ($group !== null) {
            $exercisesQuery->where('group', $group);
        }

        $exercises = $exercisesQuery->get();

        if ($exercises->isEmpty()) return false;

        // Check all exercises have a passing graded submission
        foreach ($exercises as $exercise) {
            $submission = Submission::where('user_id', $userId)
                ->where('exercise_id', $exercise->id)
                ->where('status', 'graded')
                ->where('score', '>=', $exercise->pass_threshold)
                ->first();

            if (!$submission) return false;
        }

        // Mark enrollment as completed
        Enrollment::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->update(['completed_at' => now()]);

        // Dispatch certificate generation job
        GenerateCertificateJob::dispatch($userId, $courseId);

        return true;
    }
}
