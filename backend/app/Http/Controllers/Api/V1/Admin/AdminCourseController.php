<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminCourseController extends Controller
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
     * GET /api/v1/admin/courses
     * List all courses including unpublished.
     */
    public function index(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $courses = Course::with('instructor:id,name,email')
            ->withCount('sessions', 'enrollments')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $courses,
            'message' => 'All courses retrieved.',
        ], 200);
    }

    /**
     * POST /api/v1/admin/courses
     */
    public function store(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        try {
            $validated = $request->validate([
                'instructor_id'     => ['nullable', 'exists:users,id'],
                'title'             => ['required', 'string', 'max:255'],
                'slug'              => ['required', 'string', 'max:255', 'unique:courses,slug'],
                'description'       => ['nullable', 'string'],
                'short_description' => ['nullable', 'string', 'max:500'],
                'thumbnail'         => ['nullable', 'string', 'max:2048'],
                'price'             => ['nullable', 'numeric', 'min:0'],
                'original_price'    => ['nullable', 'numeric', 'min:0'],
                'category'          => ['nullable', 'string', 'max:100'],
                'level'             => ['nullable', 'string', 'max:50'],
                'duration_hours'    => ['nullable', 'integer', 'min:0'],
                'is_published'      => ['boolean'],
                'meta_title'        => ['nullable', 'string', 'max:255'],
                'meta_description'  => ['nullable', 'string'],
            ]);

            $course = Course::create($validated);

            return response()->json([
                'success' => true,
                'data'    => $course,
                'message' => 'Course created successfully.',
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
                'message' => 'Failed to create course.',
            ], 500);
        }
    }

    /**
     * PUT /api/v1/admin/courses/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $course = Course::find($id);
        if (! $course) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Course not found.',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'instructor_id'     => ['nullable', 'exists:users,id'],
                'title'             => ['sometimes', 'string', 'max:255'],
                'slug'              => ['sometimes', 'string', 'max:255', "unique:courses,slug,{$id}"],
                'description'       => ['nullable', 'string'],
                'short_description' => ['nullable', 'string', 'max:500'],
                'thumbnail'         => ['nullable', 'string', 'max:2048'],
                'price'             => ['nullable', 'numeric', 'min:0'],
                'original_price'    => ['nullable', 'numeric', 'min:0'],
                'category'          => ['nullable', 'string', 'max:100'],
                'level'             => ['nullable', 'string', 'max:50'],
                'duration_hours'    => ['nullable', 'integer', 'min:0'],
                'is_published'      => ['boolean'],
                'meta_title'        => ['nullable', 'string', 'max:255'],
                'meta_description'  => ['nullable', 'string'],
            ]);

            $course->update($validated);

            return response()->json([
                'success' => true,
                'data'    => $course->fresh(),
                'message' => 'Course updated successfully.',
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
                'message' => 'Failed to update course.',
            ], 500);
        }
    }

    /**
     * DELETE /api/v1/admin/courses/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $course = Course::find($id);
        if (! $course) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Course not found.',
            ], 404);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Course deleted successfully.',
        ], 200);
    }
}
