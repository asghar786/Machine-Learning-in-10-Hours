<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Extend role enum to include 'instructor'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('student','admin','instructor') NOT NULL DEFAULT 'student'");

        // Add instructor_id FK to courses
        Schema::table('courses', function (Blueprint $table) {
            $table->foreignId('instructor_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['instructor_id']);
            $table->dropColumn('instructor_id');
        });

        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('student','admin') NOT NULL DEFAULT 'student'");
    }
};
