<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'session_number',
        'title',
        'description',
        'video_url',
        'duration_minutes',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'session_number'   => 'integer',
        'duration_minutes' => 'integer',
        'sort_order'       => 'integer',
        'is_published'     => 'boolean',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(Exercise::class, 'session_id');
    }
}
