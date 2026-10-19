<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\SlotController;
use App\Http\Controllers\BookingController;

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/slots', [SlotController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);