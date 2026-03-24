<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseSession;
use App\Models\Exercise;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- Course ---
        $course = Course::firstOrCreate(
            ['slug' => 'machine-learning-in-10-hours'],
            [
                'title'             => 'Machine Learning in 10 Hours',
                'slug'              => 'machine-learning-in-10-hours',
                'description'       => 'This course introduces the core concepts of machine learning, from data preprocessing to model evaluation, in a structured and accessible format. You will explore supervised learning algorithms, understand how to tune models for real-world performance, and apply your knowledge through hands-on exercises. By the end of the course you will have the practical skills and certification to start your ML career.',
                'short_description' => 'Master ML fundamentals in 10 structured hours with hands-on exercises.',
                'category'          => 'machine-learning',
                'level'             => 'beginner',
                'price'             => 99.00,
                'original_price'    => 149.00,
                'duration_hours'    => 10,
                'is_published'      => true,
            ]
        );

        // --- Sessions ---
        $sessionsData = [
            [
                'session_number'   => 1,
                'title'            => 'Introduction to Machine Learning',
                'duration_minutes' => 90,
                'sort_order'       => 1,
            ],
            [
                'session_number'   => 2,
                'title'            => 'Data Preprocessing & Exploration',
                'duration_minutes' => 120,
                'sort_order'       => 2,
            ],
            [
                'session_number'   => 3,
                'title'            => 'Supervised Learning Algorithms',
                'duration_minutes' => 120,
                'sort_order'       => 3,
            ],
            [
                'session_number'   => 4,
                'title'            => 'Model Evaluation & Tuning',
                'duration_minutes' => 90,
                'sort_order'       => 4,
            ],
            [
                'session_number'   => 5,
                'title'            => 'Final Project & Certification',
                'duration_minutes' => 120,
                'sort_order'       => 5,
            ],
        ];

        foreach ($sessionsData as $sessionData) {
            $session = CourseSession::firstOrCreate(
                [
                    'course_id'      => $course->id,
                    'session_number' => $sessionData['session_number'],
                ],
                [
                    'course_id'        => $course->id,
                    'session_number'   => $sessionData['session_number'],
                    'title'            => $sessionData['title'],
                    'duration_minutes' => $sessionData['duration_minutes'],
                    'sort_order'       => $sessionData['sort_order'],
                    'is_published'     => true,
                ]
            );

            // Group A exercise
            Exercise::firstOrCreate(
                [
                    'session_id' => $session->id,
                    'group'      => 'A',
                    'sort_order' => 1,
                ],
                [
                    'session_id'     => $session->id,
                    'title'          => $sessionData['title'] . ' — Group A Exercise',
                    'instructions'   => 'Complete the notebook exercises for Group A.',
                    'group'          => 'A',
                    'type'           => 'notebook',
                    'max_score'      => 100,
                    'pass_threshold' => 70,
                    'sort_order'     => 1,
                    'is_published'   => true,
                ]
            );

            // Group B exercise
            Exercise::firstOrCreate(
                [
                    'session_id' => $session->id,
                    'group'      => 'B',
                    'sort_order' => 2,
                ],
                [
                    'session_id'     => $session->id,
                    'title'          => $sessionData['title'] . ' — Group B Exercise',
                    'instructions'   => 'Complete the notebook exercises for Group B.',
                    'group'          => 'B',
                    'type'           => 'notebook',
                    'max_score'      => 100,
                    'pass_threshold' => 70,
                    'sort_order'     => 2,
                    'is_published'   => true,
                ]
            );
        }
    }
}
