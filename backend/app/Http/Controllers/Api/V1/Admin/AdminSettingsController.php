<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
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
     * GET /api/v1/admin/settings/site
     * Return all site_settings as a key/value object.
     */
    public function getSiteSettings(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $settings = SiteSetting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data'    => $settings,
            'message' => 'Site settings retrieved.',
        ], 200);
    }

    /**
     * POST /api/v1/admin/settings/site
     * Accept key/value pairs and upsert each one.
     */
    public function updateSiteSettings(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $data = $request->all();

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        $settings = SiteSetting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data'    => $settings,
            'message' => 'Site settings updated.',
        ], 200);
    }

    /**
     * GET /api/v1/admin/settings/seo
     * Return all seo_settings as a key/value object.
     */
    public function getSeoSettings(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $settings = SeoSetting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data'    => $settings,
            'message' => 'SEO settings retrieved.',
        ], 200);
    }

    /**
     * POST /api/v1/admin/settings/seo
     * Accept key/value pairs and upsert each one.
     */
    public function updateSeoSettings(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $data = $request->all();

        foreach ($data as $key => $value) {
            SeoSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        $settings = SeoSetting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data'    => $settings,
            'message' => 'SEO settings updated.',
        ], 200);
    }
}
