<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'user_id', 'enrollment_id', 'invoice_number', 'course_title',
        'amount', 'currency', 'status', 'payment_method',
        'transaction_id', 'notes', 'paid_at',
    ];

    protected $casts = [
        'amount'  => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public static function generateInvoiceNumber(): string
    {
        $year  = now()->year;
        $month = now()->format('m');
        $count = static::whereYear('created_at', $year)->count() + 1;
        return sprintf('INV-%d%s-%04d', $year, $month, $count);
    }
}
