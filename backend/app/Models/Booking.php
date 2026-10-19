<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    // Membuka gembok agar data pemesanan dari form bebas masuk
    protected $guarded = [];
}
