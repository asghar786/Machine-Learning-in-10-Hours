<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Exercise;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $course = Course::where('slug', 'machine-learning-in-10-hours')->first();
        if (!$course) return;

        $exercises = Exercise::with('session')
            ->whereHas('session', fn($q) => $q->where('course_id', $course->id))
            ->get();

        // ── 15 demo students ──────────────────────────────────────────────────
        $students = [
            ['name' => 'Aisha Rahman',     'email' => 'aisha@demo.local',   'group' => 0, 'days_ago' => 20],
            ['name' => 'Bilal Khan',        'email' => 'bilal@demo.local',   'group' => 1, 'days_ago' => 18],
            ['name' => 'Carlos Mendez',     'email' => 'carlos@demo.local',  'group' => 0, 'days_ago' => 17],
            ['name' => 'Diana Okonkwo',     'email' => 'diana@demo.local',   'group' => 1, 'days_ago' => 16],
            ['name' => 'Ethan Brooks',      'email' => 'ethan@demo.local',   'group' => 0, 'days_ago' => 15],
            ['name' => 'Fatima Al-Zahra',   'email' => 'fatima@demo.local',  'group' => 1, 'days_ago' => 14],
            ['name' => 'George Tanaka',     'email' => 'george@demo.local',  'group' => 0, 'days_ago' => 13],
            ['name' => 'Hannah Smith',      'email' => 'hannah@demo.local',  'group' => 1, 'days_ago' => 12],
            ['name' => 'Ibrahim Yusuf',     'email' => 'ibrahim@demo.local', 'group' => 0, 'days_ago' => 10],
            ['name' => 'Julia Chen',        'email' => 'julia@demo.local',   'group' => 1, 'days_ago' =>  9],
            ['name' => 'Kevin Osei',        'email' => 'kevin@demo.local',   'group' => 0, 'days_ago' =>  8],
            ['name' => 'Layla Hassan',      'email' => 'layla@demo.local',   'group' => 1, 'days_ago' =>  6],
            ['name' => 'Marcus Lee',        'email' => 'marcus@demo.local',  'group' => 0, 'days_ago' =>  4],
            ['name' => 'Nadia Patel',       'email' => 'nadia@demo.local',   'group' => 1, 'days_ago' =>  2],
            ['name' => 'Omar Farouq',       'email' => 'omar@demo.local',    'group' => 0, 'days_ago' =>  1],
        ];

        $createdUsers = [];
        foreach ($students as $s) {
            $user = User::updateOrCreate(
                ['email' => $s['email']],
                [
                    'name'       => $s['name'],
                    'password'   => Hash::make('Demo@2026!'),
                    'role'       => 'student',
                    'group'      => $s['group'],
                    'created_at' => now()->subDays($s['days_ago']),
                    'updated_at' => now()->subDays($s['days_ago']),
                ]
            );
            $createdUsers[] = ['user' => $user, 'meta' => $s];
        }

        // ── Enrollments ───────────────────────────────────────────────────────
        foreach ($createdUsers as $item) {
            $user    = $item['user'];
            $daysAgo = $item['meta']['days_ago'];
            DB::table('enrollments')->updateOrInsert(
                ['user_id' => $user->id, 'course_id' => $course->id],
                [
                    'enrolled_at' => now()->subDays($daysAgo),
                    'created_at'  => now()->subDays($daysAgo),
                    'updated_at'  => now()->subDays($daysAgo),
                ]
            );
        }

        // ── Submissions ───────────────────────────────────────────────────────
        // [student_index, sessions_done, status_of_last, score_of_last]
        $plans = [
            [0,  5, 'graded',  92],
            [1,  5, 'graded',  88],
            [2,  4, 'graded',  76],
            [3,  4, 'graded',  81],
            [4,  3, 'graded',  95],
            [5,  3, 'graded',  67],
            [6,  2, 'graded',  73],
            [7,  2, 'graded',  85],
            [8,  1, 'pending', null],
            [9,  1, 'pending', null],
            [10, 1, 'graded',  90],
            [11, 1, 'pending', null],
            [12, 0, null,      null],
            [13, 0, null,      null],
            [14, 0, null,      null],
        ];

        foreach ($plans as [$idx, $sessionsCompleted, $lastStatus, $lastScore]) {
            if ($sessionsCompleted === 0) continue;

            $user    = $createdUsers[$idx]['user'];
            $daysAgo = $createdUsers[$idx]['meta']['days_ago'];
            $group   = $createdUsers[$idx]['meta']['group'] === 0 ? 'A' : 'B';

            for ($s = 1; $s <= $sessionsCompleted; $s++) {
                $exercise = $exercises->first(
                    fn($e) => $e->session->session_number === $s && $e->group === $group
                );
                if (!$exercise) continue;

                $isLast  = ($s === $sessionsCompleted);
                $status  = $isLast ? $lastStatus : 'graded';
                $score   = $isLast ? $lastScore  : rand(70, 98);
                $subDays = max(0, $daysAgo - ($s * 2));

                Submission::updateOrCreate(
                    ['user_id' => $user->id, 'exercise_id' => $exercise->id],
                    [
                        'notebook_url' => 'https://colab.research.google.com/demo/session-' . $s,
                        'code_content' => '# Demo submission for session ' . $s,
                        'status'       => $status,
                        'score'        => $score,
                        'feedback'     => $status === 'graded' ? 'Good work! Keep it up.' : null,
                        'submitted_at' => now()->subDays($subDays)->subHours(rand(1, 8)),
                        'graded_at'    => $status === 'graded' ? now()->subDays(max(0, $subDays - 1)) : null,
                        'created_at'   => now()->subDays($subDays),
                        'updated_at'   => now()->subDays($subDays),
                    ]
                );
            }
        }
    }
}