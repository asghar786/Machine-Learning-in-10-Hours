<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageVisit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminVisitController extends Controller
{
    private function adminGuard(Request $request): ?JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        return null;
    }

    /**
     * GET /api/v1/admin/visits
     * Visit analytics: KPIs, trend chart, top pages, device breakdown,
     * top referrers, top browsers, top OS, recent visits list.
     */
    public function index(Request $request): JsonResponse
    {
        if ($guard = $this->adminGuard($request)) {
            return $guard;
        }

        $days = (int) $request->input('days', 30);
        $since = now()->subDays($days - 1)->startOfDay();

        // ── KPIs ────────────────────────────────────────────────────────
        $totalVisits    = PageVisit::count();
        $visitsToday    = PageVisit::whereDate('created_at', today())->count();
        $visitsThisWeek = PageVisit::where('created_at', '>=', now()->startOfWeek())->count();
        $visitsPeriod   = PageVisit::where('created_at', '>=', $since)->count();

        $uniqueIpsTotal  = PageVisit::distinct('ip_address')->count('ip_address');
        $uniqueIpsPeriod = PageVisit::where('created_at', '>=', $since)
            ->distinct('ip_address')->count('ip_address');

        $loggedInVisits = PageVisit::where('created_at', '>=', $since)
            ->whereNotNull('user_id')->count();

        // ── Visits trend (per day) ───────────────────────────────────────
        $trend = PageVisit::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as visits'),
                DB::raw('COUNT(DISTINCT ip_address) as unique_visitors')
            )
            ->where('created_at', '>=', $since)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // ── Top pages ────────────────────────────────────────────────────
        $topPages = PageVisit::select('url', 'title', DB::raw('COUNT(*) as visits'))
            ->where('created_at', '>=', $since)
            ->groupBy('url', 'title')
            ->orderByDesc('visits')
            ->limit(10)
            ->get();

        // ── Device breakdown ─────────────────────────────────────────────
        $devices = PageVisit::select('device_type', DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $since)
            ->groupBy('device_type')
            ->get();

        // ── Browser breakdown ────────────────────────────────────────────
        $browsers = PageVisit::select('browser', DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $since)
            ->whereNotNull('browser')
            ->groupBy('browser')
            ->orderByDesc('count')
            ->limit(6)
            ->get();

        // ── OS breakdown ────────────────────────────────────────────────
        $operatingSystems = PageVisit::select('os', DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $since)
            ->whereNotNull('os')
            ->groupBy('os')
            ->orderByDesc('count')
            ->limit(6)
            ->get();

        // ── Top referrers ────────────────────────────────────────────────
        $referrers = PageVisit::select('referer', DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $since)
            ->whereNotNull('referer')
            ->where('referer', '!=', '')
            ->groupBy('referer')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->map(function ($r) {
                // Extract just the domain from the referer URL
                $domain = parse_url($r->referer, PHP_URL_HOST) ?? $r->referer;
                return ['referer' => $domain, 'full_url' => $r->referer, 'count' => $r->count];
            });

        // ── Recent visits ────────────────────────────────────────────────
        $recent = PageVisit::with('user:id,name,email')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get(['id', 'url', 'title', 'ip_address', 'referer',
                   'device_type', 'browser', 'os', 'user_id', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => [
                'kpis' => [
                    'total_visits'        => $totalVisits,
                    'visits_today'        => $visitsToday,
                    'visits_this_week'    => $visitsThisWeek,
                    'visits_period'       => $visitsPeriod,
                    'unique_visitors'     => $uniqueIpsTotal,
                    'unique_period'       => $uniqueIpsPeriod,
                    'logged_in_visits'    => $loggedInVisits,
                    'days'                => $days,
                ],
                'trend'             => $trend,
                'top_pages'         => $topPages,
                'devices'           => $devices,
                'browsers'          => $browsers,
                'operating_systems' => $operatingSystems,
                'referrers'         => $referrers,
                'recent'            => $recent,
            ],
        ], 200);
    }
}
