<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminPostController extends Controller
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
     * GET /api/v1/admin/posts
     * List all posts including unpublished.
     */
    public function index(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $posts = Post::with('author:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $posts,
            'message' => 'All posts retrieved.',
        ], 200);
    }

    /**
     * POST /api/v1/admin/posts
     */
    public function store(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        try {
            $validated = $request->validate([
                'title'            => ['required', 'string', 'max:255'],
                'slug'             => ['required', 'string', 'max:255', 'unique:posts,slug'],
                'excerpt'          => ['nullable', 'string'],
                'content'          => ['required', 'string'],
                'type'             => ['required', 'string', 'in:blog,case-study,news'],
                'author_id'        => ['nullable', 'integer', 'exists:users,id'],
                'thumbnail'        => ['nullable', 'string', 'max:2048'],
                'is_published'     => ['boolean'],
                'published_at'     => ['nullable', 'date'],
                'meta_title'       => ['nullable', 'string', 'max:255'],
                'meta_description' => ['nullable', 'string'],
            ]);

            // Default author to the authenticated admin if not provided
            $validated['author_id'] = $validated['author_id'] ?? $request->user()->id;

            $post = Post::create($validated);
            $post->load('author:id,name');

            return response()->json([
                'success' => true,
                'data'    => $post,
                'message' => 'Post created successfully.',
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
                'message' => 'Failed to create post.',
            ], 500);
        }
    }

    /**
     * PUT /api/v1/admin/posts/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $post = Post::find($id);
        if (! $post) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Post not found.',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'title'            => ['sometimes', 'string', 'max:255'],
                'slug'             => ['sometimes', 'string', 'max:255', "unique:posts,slug,{$id}"],
                'excerpt'          => ['nullable', 'string'],
                'content'          => ['sometimes', 'string'],
                'type'             => ['sometimes', 'string', 'in:blog,case-study,news'],
                'author_id'        => ['nullable', 'integer', 'exists:users,id'],
                'thumbnail'        => ['nullable', 'string', 'max:2048'],
                'is_published'     => ['boolean'],
                'published_at'     => ['nullable', 'date'],
                'meta_title'       => ['nullable', 'string', 'max:255'],
                'meta_description' => ['nullable', 'string'],
            ]);

            $post->update($validated);

            return response()->json([
                'success' => true,
                'data'    => $post->fresh(['author']),
                'message' => 'Post updated successfully.',
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
                'message' => 'Failed to update post.',
            ], 500);
        }
    }

    /**
     * DELETE /api/v1/admin/posts/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $post = Post::find($id);
        if (! $post) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Post not found.',
            ], 404);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Post deleted successfully.',
        ], 200);
    }
}
