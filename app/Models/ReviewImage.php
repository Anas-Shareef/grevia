<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReviewImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'review_id',
        'image_path',
    ];

    public function review()
    {
        return $this->belongsTo(ProductReview::class, 'review_id');
    }
}
