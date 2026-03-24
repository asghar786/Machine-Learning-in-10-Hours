<?php
namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $totalEnrollments = Enrollment::count();
        $completedEnrollments = Enrollment::whereNotNull('completed_at')->count();
        $completionRate = $totalEnrollments > 0
            ? round(($completedEnrollments / $totalEnrollments) * 100, 1)
            : 0;

        $avgScore = Submission::where('status', 'graded')->avg('score');

        $totalCertificates = Certificate::where('is_revoked', false)->count();
        $totalStudents = User::where('role', 'student')->count();
        $pendingSubmissions = Submission::where('status', 'pending')->count();

        // Enrollments per day for last 30 days
        $enrollmentTrend = Enrollment::select(
                DB::raw('DATE(enrolled_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('enrolled_at', '>=', now()->subDays(29))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($r) => ['date' => $r->date, 'count' => $r->count]);

        // Submissions by status
        $submissionsByStatus = Submission::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn($r) => ['status' => $r->status, 'count' => $r->count]);

        // Group A vs B student distribution
        $groupDistribution = User::where('role', 'student')
            ->select('group', DB::raw('COUNT(*) as count'))
            ->whereNotNull('group')
            ->groupBy('group')
            ->get()
            ->map(fn($r) => ['group' => $r->group == 0 ? 'A' : 'B', 'count' => $r->count]);

        return response()->json([
            'success' => true,
            'data' => [
                'total_enrollments'    => $totalEnrollments,
                'completion_rate'      => $completionRate,
                'avg_score'            => $avgScore ? round($avgScore, 1) : null,
                'total_certificates'   => $totalCertificates,
                'total_students'       => $totalStudents,
                'pending_submissions'  => $pendingSubmissions,
                'enrollment_trend'     => $enrollmentTrend,
                'submissions_by_status'=> $submissionsByStatus,
                'group_distribution'   => $groupDistribution,
            ]
        ]);
    }
}
