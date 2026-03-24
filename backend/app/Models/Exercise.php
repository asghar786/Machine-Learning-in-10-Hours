<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'title',
        'instructions',
        'group',
        'type',
        'max_score',
        'pass_threshold',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'max_score'      => 'integer',
        'pass_threshold' => 'integer',
        'sort_order'     => 'integer',
        'is_published'   => 'boolean',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(CourseSession::class, 'session_id');
    }
}
