<?php

namespace App\Http\Controllers\Api\V1\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    /**
     * Dashboard stats for the authenticated instructor.
     */
    public function dashboard(Request $request)
    {
        $instructor = $request->user();

        $courses = Course::where('instructor_id', $instructor->id)
            ->withCount('enrollments')
            ->get();

        $courseIds = $courses->pluck('id');

        $totalStudents = Enrollment::whereIn('course_id', $courseIds)
            ->distinct('user_id')
            ->count('user_id');

        $recentEnrollments = Enrollment::with(['user:id,name,email,avatar_url', 'course:id,title,thumbnail'])
            ->whereIn('course_id', $courseIds)
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_courses'     => $courses->count(),
                    'published_courses' => $courses->where('is_published', true)->count(),
                    'total_students'    => $totalStudents,
                    'total_enrollments' => $courses->sum('enrollments_count'),
                ],
                'courses'              => $courses,
                'recent_enrollments'   => $recentEnrollments,
            ],
        ]);
    }

    /**
     * List all courses belonging to this instructor.
     */
    public function courses(Request $request)
    {
        $courses = Course::where('instructor_id', $request->user()->id)
            ->withCount('enrollments')
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $courses]);
    }

    /**
     * List all students enrolled in any of this instructor's courses.
     */
    public function students(Request $request)
    {
        $courseIds = Course::where('instructor_id', $request->user()->id)->pluck('id');

        $enrollments = Enrollment::with(['user:id,name,email,avatar_url,created_at', 'course:id,title,thumbnail'])
            ->whereIn('course_id', $courseIds)
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $enrollments]);
    }
}
