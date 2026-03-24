<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CertificateController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\EnrollmentController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\SessionController;
use App\Http\Controllers\Api\V1\SubmissionController;
use App\Http\Controllers\Api\V1\Admin\AdminCourseController;
use App\Http\Controllers\Api\V1\Admin\AdminPostController;
use App\Http\Controllers\Api\V1\Admin\AdminSettingsController;
use App\Http\Controllers\Api\V1\Admin\AdminSubmissionController;
use App\Http\Controllers\Api\V1\Admin\AdminAnalyticsController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // -----------------------------------------------------------------------
    // Auth — public
    // -----------------------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::post('/register',        [AuthController::class, 'register']);
        Route::post('/login',           [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password',  [AuthController::class, 'resetPassword']);
    });

    // Auth — protected
    Route::prefix('auth')->middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });

    // -----------------------------------------------------------------------
    // Public endpoints
    // -----------------------------------------------------------------------
    Route::get('/courses',             [CourseController::class, 'index']);
    Route::get('/courses/{slug}',      [CourseController::class, 'show']);
    Route::get('/certificates/{uuid}', [CertificateController::class, 'verify']);
    Route::get('/certificates/{uuid}/download', [CertificateController::class, 'download']);
    Route::get('/posts',               [PostController::class, 'index']);
    Route::get('/posts/{slug}',        [PostController::class, 'show']);
    Route::get('/settings/site',       [AdminSettingsController::class, 'getSiteSettings']);
    Route::get('/settings/seo',        [AdminSettingsController::class, 'getSeoSettings']);

    // -----------------------------------------------------------------------
    // Auth-required endpoints
    // -----------------------------------------------------------------------
    Route::middleware('auth:sanctum')->group(function () {

        // Student profile
        Route::get('/profile',          [ProfileController::class, 'show']);
        Route::put('/profile',          [ProfileController::class, 'update']);
        Route::put('/profile/password', [ProfileController::class, 'changePassword']);

        // Payments / Invoices
        Route::get('/payments',      [PaymentController::class, 'index']);
        Route::get('/payments/{id}', [PaymentController::class, 'show']);

        // Enrollments
        Route::get('/enrollments/me', [EnrollmentController::class, 'myEnrollments']);
        Route::post('/enrollments',   [EnrollmentController::class, 'enroll']);

        // Sessions (course content)
        Route::get('/courses/{slug}/sessions/{number}', [SessionController::class, 'show']);

        // Submissions
        Route::post('/submissions',    [SubmissionController::class, 'store']);
        Route::get('/submissions/me',  [SubmissionController::class, 'mySubmissions']);

        // Certificates
        Route::get('/certificates/me', [CertificateController::class, 'myCertificates']);

        // -------------------------------------------------------------------
        // Admin endpoints
        // -------------------------------------------------------------------
        Route::prefix('admin')->group(function () {

            // Courses
            Route::get('/courses',     [AdminCourseController::class, 'index']);
            Route::post('/courses',    [AdminCourseController::class, 'store']);
            Route::put('/courses/{id}',    [AdminCourseController::class, 'update']);
            Route::delete('/courses/{id}', [AdminCourseController::class, 'destroy']);

            // Users
            Route::get('/users',       [AdminUserController::class, 'index']);
            Route::get('/users/{id}',  [AdminUserController::class, 'show']);
            Route::put('/users/{id}',  [AdminUserController::class, 'update']);

            // Submissions
            Route::get('/submissions',             [AdminSubmissionController::class, 'index']);
            Route::post('/submissions/{id}/grade', [AdminSubmissionController::class, 'grade']);

            // Settings
            Route::get('/settings/site',  [AdminSettingsController::class, 'getSiteSettings']);
            Route::post('/settings/site', [AdminSettingsController::class, 'updateSiteSettings']);
            Route::get('/settings/seo',   [AdminSettingsController::class, 'getSeoSettings']);
            Route::post('/settings/seo',  [AdminSettingsController::class, 'updateSeoSettings']);

            // Posts
            Route::get('/posts',      [AdminPostController::class, 'index']);
            Route::post('/posts',     [AdminPostController::class, 'store']);
            Route::put('/posts/{id}',    [AdminPostController::class, 'update']);
            Route::delete('/posts/{id}', [AdminPostController::class, 'destroy']);
        });
    });
});
