<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new student account.
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'     => ['required', 'string', 'max:255'],
                'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role'     => 'student',
            ]);

            // A/B exercise group split: deterministic per user ID
            $user->group = abs(crc32((string) $user->id)) % 2;
            $user->save();

            $token = $user->createToken('api-token')->plainTextToken;

            // Send welcome email (best-effort — don't fail registration if mail errors)
            try { Mail::to($user->email)->send(new WelcomeEmail($user)); } catch (\Throwable) {}

            return response()->json([
                'success' => true,
                'data'    => [
                    'token' => $token,
                    'user'  => $user,
                ],
                'message' => 'Registration successful.',
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
                'message' => 'Registration failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Authenticate an existing user and issue a token.
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email'    => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ]);

            if (! Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
                return response()->json([
                    'success' => false,
                    'data'    => null,
                    'message' => 'Invalid credentials.',
                ], 401);
            }

            /** @var User $user */
            $user  = Auth::user();
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'data'    => [
                    'token' => $token,
                    'user'  => $user,
                ],
                'message' => 'Login successful.',
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
                'message' => 'Login failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Revoke the current access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Logged out successfully.',
        ], 200);
    }

    /**
     * Return the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => ['user' => $request->user()],
            'message' => 'Authenticated user retrieved.',
        ], 200);
    }

    /**
     * Send a password reset link to the given email.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => ['required', 'string', 'email'],
            ]);

            $status = Password::sendResetLink($request->only('email'));

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'success' => true,
                    'data'    => null,
                    'message' => __($status),
                ], 200);
            }

            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => __($status),
            ], 422);
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
                'message' => 'Could not send reset link. Please try again.',
            ], 500);
        }
    }

    /**
     * Reset the user's password using the provided token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'token'    => ['required', 'string'],
                'email'    => ['required', 'string', 'email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->forceFill(['password' => Hash::make($password)])->save();
                    $user->tokens()->delete();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'success' => true,
                    'data'    => null,
                    'message' => __($status),
                ], 200);
            }

            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => __($status),
            ], 422);
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
                'message' => 'Password reset failed. Please try again.',
            ], 500);
        }
    }
}
