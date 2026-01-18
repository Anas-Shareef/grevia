<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected static function booted()
    {
        static::creating(function ($order) {
            // 1. GLOBAL ORDER NUMBER (Admin)
            // Format: ORD-00001
            if (empty($order->order_number)) {
                // Count all orders (including soft deleted) to ensure unique sequence
                // For high concurrency, consideration for locking (e.g. atomic lock) might be needed,
                // but for this scale, count() is acceptable.
                $globalCount = static::withTrashed()->count() + 1; 
                $order->order_number = 'ORD-' . str_pad($globalCount, 5, '0', STR_PAD_LEFT);
            }

            // 2. CUSTOMER ORDER NUMBER (Frontend)
            // Format: ORD-01
            if (empty($order->customer_order_number) && $order->user_id) {
                // Count orders for this specific customer
                $customerCount = static::where('user_id', $order->user_id)->withTrashed()->count() + 1;
                $order->customer_order_number = 'ORD-' . str_pad($customerCount, 2, '0', STR_PAD_LEFT);
            }
        });
    }

    public static function generateUniqueOrderNumber()
    {
        // Deprecated/Legacy support if called explicitly, but booted() handles creation now.
        $nextId = static::withTrashed()->count() + 1;
        return 'ORD-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
    }


    protected $fillable = [
        'order_number',
        'customer_order_number',
        'transaction_id',
        'user_id',
        'status',
        'subtotal',
        'shipping',
        'discount',
        'total',
        'payment_method',
        'payment_status',
        'name',
        'email',
        'phone',
        'shipping_address',
        'billing_address',
        'notes',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'billing_address' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }

    public function statusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function activities()
    {
        return $this->hasMany(OrderActivity::class)->orderBy('created_at', 'desc');
    }

    public function notes()
    {
        return $this->hasMany(OrderNote::class)->orderBy('created_at', 'desc');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
