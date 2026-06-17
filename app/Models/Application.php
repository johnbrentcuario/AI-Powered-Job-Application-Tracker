<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    // These are the columns that are allowed to be saved
    protected $fillable = [
        'user_id',
        'company',
        'position',
        'status',
        'job_description',
        'notes',
        'applied_at',
        'follow_up_date',
    ];

    // This tells Laravel what data types each column is
    protected $casts = [
        'applied_at' => 'date',
        'follow_up_date' => 'date',
    ];

    // This defines the relationship - an application belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}