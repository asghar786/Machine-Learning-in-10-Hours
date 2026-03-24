<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /**
     * GET /api/v1/profile
     * Return the authenticated user's full profile.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user(),
            'message' => 'Profile retrieved.',
        ]);
    }

    /**
     * PUT /api/v1/profile
     * Update profile fields.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            $validated = $request->validate([
                'name'         => ['sometimes', 'string', 'max:255'],
                'email'        => ['sometimes', 'email', 'max:255', "unique:users,email,{$user->id}"],
                'phone'        => ['nullable', 'string', 'max:30'],
                'bio'          => ['nullable', 'string', 'max:1000'],
                'avatar_url'   => ['nullable', 'string', 'max:2048'],
                'location'     => ['nullable', 'string', 'max:100'],
                'linkedin_url' => ['nullable', 'string', 'max:2048'],
                'website_url'  => ['nullable', 'string', 'max:2048'],
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'data'    => $user->fresh(),
                'message' => 'Profile updated successfully.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $e->getMessage(),
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * POST /api/v1/profile/avatar
     * Upload a profile picture.
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
        ]);

        $user = $request->user();
        $file = $request->file('avatar');
        $filename = 'avatar_' . $user->id . '_' . time() . '.' . $file->extension();

        // Store in public/avatars — directly web-accessible
        $file->move(public_path('avatars'), $filename);

        // Delete old avatar file if it was a local upload
        if ($user->avatar_url && str_starts_with($user->avatar_url, '/avatars/')) {
            $oldPath = public_path(ltrim($user->avatar_url, '/'));
            if (file_exists($oldPath)) @unlink($oldPath);
        }

        $url = '/avatars/' . $filename;
        $user->update(['avatar_url' => $url]);

        return response()->json([
            'success' => true,
            'data'    => ['avatar_url' => $url],
            'message' => 'Avatar uploaded successfully.',
        ]);
    }

    /**
     * PUT /api/v1/profile/password
     * Change password.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            $request->validate([
                'current_password' => ['required', 'string'],
                'password'         => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            if (! Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'data'    => null,
                    'message' => 'Current password is incorrect.',
                    'errors'  => ['current_password' => ['Current password is incorrect.']],
                ], 422);
            }

            $user->update(['password' => Hash::make($request->password)]);

            return response()->json([
                'success' => true,
                'data'    => null,
                'message' => 'Password changed successfully.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $e->getMessage(),
                'errors'  => $e->errors(),
            ], 422);
        }
    }
}
