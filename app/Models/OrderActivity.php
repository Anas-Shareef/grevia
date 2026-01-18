<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderActivity extends Model
{
    protected $fillable = [
        'order_id',
        'activity_type',
        'description',
        'old_value',
        'new_value',
        'user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Log an order activity
     */
    public static function log(
        int $orderId,
        string $activityType,
        string $description,
        ?string $oldValue = null,
        ?string $newValue = null,
        ?int $userId = null
    ): self {
        return self::create([
            'order_id' => $orderId,
            'activity_type' => $activityType,
            'description' => $description,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'user_id' => $userId ?? auth()->id(),
        ]);
    }
}
