<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * GET /api/v1/posts
     * List all published posts. Supports ?type=blog|case-study|news filter.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Post::where('is_published', true)
            ->with('author:id,name');

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        $posts = $query->orderBy('published_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $posts,
            'message' => 'Posts retrieved successfully.',
        ], 200);
    }

    /**
     * GET /api/v1/posts/{slug}
     * Return a single published post.
     */
    public function show(string $slug): JsonResponse
    {
        $post = Post::where('slug', $slug)
            ->where('is_published', true)
            ->with('author:id,name')
            ->first();

        if (! $post) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Post not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $post,
            'message' => 'Post retrieved successfully.',
        ], 200);
    }
}
