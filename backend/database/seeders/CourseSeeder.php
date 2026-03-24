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

        // --- Additional courses ---
        $extraCourses = [
            [
                'title'             => 'Microsoft Office Mastery',
                'slug'              => 'microsoft-office-mastery',
                'short_description' => 'Master Word, Excel, PowerPoint and Outlook in 10 hours.',
                'description'       => 'A comprehensive course covering the full Microsoft Office suite. Learn to create professional documents in Word, build powerful spreadsheets in Excel, deliver impactful presentations in PowerPoint, and manage communications in Outlook.',
                'category'          => 'ms-office',
                'level'             => 'beginner',
                'price'             => 49.00,
                'original_price'    => 79.00,
                'duration_hours'    => 10,
                'is_published'      => true,
            ],
            [
                'title'             => 'Database Management with SQL',
                'slug'              => 'database-management-with-sql',
                'short_description' => 'Learn relational databases and SQL from scratch in 10 hours.',
                'description'       => 'This course covers the fundamentals of relational database design, SQL querying, joins, indexing, and database administration. Ideal for beginners who want to work with data professionally.',
                'category'          => 'dbms',
                'level'             => 'beginner',
                'price'             => 69.00,
                'original_price'    => 99.00,
                'duration_hours'    => 10,
                'is_published'      => true,
            ],
            [
                'title'             => 'Python Programming for Beginners',
                'slug'              => 'python-programming-for-beginners',
                'short_description' => 'Go from zero to writing real Python programs in 10 hours.',
                'description'       => 'Start your programming journey with Python — one of the most in-demand languages in the world. This course covers variables, control flow, functions, file handling, and an introduction to libraries like NumPy and Pandas.',
                'category'          => 'programming',
                'level'             => 'beginner',
                'price'             => 59.00,
                'original_price'    => 89.00,
                'duration_hours'    => 10,
                'is_published'      => true,
            ],
        ];

        foreach ($extraCourses as $courseData) {
            Course::firstOrCreate(
                ['slug' => $courseData['slug']],
                $courseData
            );
        }

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
