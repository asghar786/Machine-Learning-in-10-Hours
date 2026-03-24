<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageVisit extends Model
{
    protected $fillable = [
        'url', 'title', 'ip_address', 'user_agent',
        'referer', 'user_id', 'device_type', 'browser', 'os',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Parse device type, browser, and OS from a user-agent string.
     */
    public static function parseUserAgent(?string $ua): array
    {
        if (!$ua) {
            return ['device_type' => 'desktop', 'browser' => 'Unknown', 'os' => 'Unknown'];
        }

        // Device type
        $deviceType = 'desktop';
        if (preg_match('/tablet|ipad|playbook|silk/i', $ua)) {
            $deviceType = 'tablet';
        } elseif (preg_match('/mobile|android|iphone|ipod|windows phone|blackberry|opera mini/i', $ua)) {
            $deviceType = 'mobile';
        }

        // Browser
        $browser = 'Other';
        if (str_contains($ua, 'Edg/') || str_contains($ua, 'Edge/'))    { $browser = 'Edge'; }
        elseif (str_contains($ua, 'OPR/') || str_contains($ua, 'Opera')) { $browser = 'Opera'; }
        elseif (str_contains($ua, 'Chrome/') && !str_contains($ua, 'Chromium')) { $browser = 'Chrome'; }
        elseif (str_contains($ua, 'Firefox/'))                            { $browser = 'Firefox'; }
        elseif (str_contains($ua, 'Safari/') && !str_contains($ua, 'Chrome')) { $browser = 'Safari'; }
        elseif (str_contains($ua, 'MSIE') || str_contains($ua, 'Trident/')) { $browser = 'IE'; }

        // OS
        $os = 'Other';
        if (preg_match('/Windows NT/i', $ua))      { $os = 'Windows'; }
        elseif (preg_match('/Mac OS X/i', $ua))    { $os = 'macOS'; }
        elseif (preg_match('/Android/i', $ua))     { $os = 'Android'; }
        elseif (preg_match('/iPhone|iPad|iPod/i', $ua)) { $os = 'iOS'; }
        elseif (preg_match('/Linux/i', $ua))       { $os = 'Linux'; }

        return compact('deviceType', 'browser', 'os');
    }
}
