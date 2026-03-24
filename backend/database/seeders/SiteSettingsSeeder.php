<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name',            'value' => 'Machine Learning in 10 Hours'],
            ['key' => 'site_tagline',          'value' => 'Master ML fundamentals with hands-on certification'],
            ['key' => 'site_email',            'value' => 'hello@mlcourse.local'],
            ['key' => 'site_phone',            'value' => '+60 12-345 6789'],
            ['key' => 'site_address',          'value' => 'Kuala Lumpur, Malaysia'],
            ['key' => 'logo_path',             'value' => null],
            ['key' => 'favicon_path',          'value' => null],
            ['key' => 'primary_color',         'value' => '#0d6efd'],
            ['key' => 'facebook_url',          'value' => null],
            ['key' => 'twitter_url',           'value' => null],
            ['key' => 'linkedin_url',          'value' => null],
            ['key' => 'youtube_url',           'value' => null],
            ['key' => 'google_analytics_id',   'value' => null],
            ['key' => 'meta_title',            'value' => 'Machine Learning in 10 Hours — Online Certification'],
            ['key' => 'meta_description',      'value' => 'Learn machine learning from scratch in 10 structured hours. Get certified and launch your ML career.'],
        ];

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                ['key' => $setting['key'], 'value' => $setting['value']]
            );
        }
    }
}
