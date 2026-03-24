<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@ml.local'],
            [
                'name'     => 'Admin User',
                'email'    => 'admin@ml.local',
                'password' => Hash::make('Admin@2026!'),
                'role'     => 'admin',
                'group'    => null,
            ]
        );

        // Demo student
        // crc32("2") = -272516266, abs = 272516266, % 2 = 0
        User::updateOrCreate(
            ['email' => 'student@ml.local'],
            [
                'name'     => 'Demo Student',
                'email'    => 'student@ml.local',
                'password' => Hash::make('Student@2026!'),
                'role'     => 'student',
                'group'    => 0,
            ]
        );

        // Demo instructor
        User::updateOrCreate(
            ['email' => 'instructor@ml.local'],
            [
                'name'     => 'Dr. Sarah Ahmed',
                'email'    => 'instructor@ml.local',
                'password' => Hash::make('Demo@2026!'),
                'role'     => 'instructor',
                'bio'      => 'Machine Learning researcher with 8+ years of industry and academic experience.',
                'location' => 'Karachi, Pakistan',
                'group'    => null,
            ]
        );
    }
}
