<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * GET /api/v1/courses
     * List all published courses with session count.
     * Supports ?category= and ?search= filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::where('is_published', true)
            ->withCount(['sessions' => function ($q) {
                $q->where('is_published', true);
            }]);

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('search')) {
            $term = $request->input('search');
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                  ->orWhere('short_description', 'like', "%{$term}%");
            });
        }

        $courses = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $courses,
            'message' => 'Courses retrieved successfully.',
        ], 200);
    }

    /**
     * GET /api/v1/courses/{slug}
     * Single published course with published sessions and exercises count per session.
     */
    public function show(string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)
            ->where('is_published', true)
            ->with(['sessions' => function ($q) {
                $q->where('is_published', true)
                  ->withCount('exercises')
                  ->orderBy('sort_order');
            }])
            ->first();

        if (! $course) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Course not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $course,
            'message' => 'Course retrieved successfully.',
        ], 200);
    }
}
