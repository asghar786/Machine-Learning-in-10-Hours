<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
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
     * GET /api/v1/admin/users
     * Paginate users (20 per page) with enrollment count.
     */
    public function index(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $users = User::withCount('enrollments')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $users,
            'message' => 'Users retrieved successfully.',
        ], 200);
    }

    /**
     * GET /api/v1/admin/users/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $user = User::withCount('enrollments')->find($id);

        if (! $user) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'User retrieved successfully.',
        ], 200);
    }

    /**
     * PUT /api/v1/admin/users/{id}
     * Can update role and other fields.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'User not found.',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'name'  => ['sometimes', 'string', 'max:255'],
                'email' => ['sometimes', 'string', 'email', 'max:255', "unique:users,email,{$id}"],
                'role'  => ['sometimes', 'string', 'in:student,admin,instructor'],
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'data'    => $user->fresh(),
                'message' => 'User updated successfully.',
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
                'message' => 'Failed to update user.',
            ], 500);
        }
    }
}
