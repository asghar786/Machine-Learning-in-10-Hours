<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PageVisit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    /**
     * POST /api/v1/track
     * Record a page view. Public endpoint — no auth required.
     * Ignores admin users and bot-like user agents.
     */
    public function store(Request $request): JsonResponse
    {
        $ua = $request->userAgent() ?? '';

        // Skip bots / crawlers
        if (preg_match('/bot|crawl|spider|slurp|bingpreview|facebookexternalhit/i', $ua)) {
            return response()->json(['success' => true], 200);
        }

        // Skip admin users
        $user = $request->user();
        if ($user && $user->role === 'admin') {
            return response()->json(['success' => true], 200);
        }

        $url     = $request->input('url', '/');
        $title   = $request->input('title');
        $referer = $request->input('referer') ?: $request->header('Referer');

        $parsed = PageVisit::parseUserAgent($ua);

        PageVisit::create([
            'url'         => substr($url, 0, 500),
            'title'       => $title ? substr($title, 0, 255) : null,
            'ip_address'  => $request->ip(),
            'user_agent'  => substr($ua, 0, 1000),
            'referer'     => $referer ? substr($referer, 0, 500) : null,
            'user_id'     => $user?->id,
            'device_type' => $parsed['deviceType'],
            'browser'     => $parsed['browser'],
            'os'          => $parsed['os'],
        ]);

        return response()->json(['success' => true], 201);
    }
}
