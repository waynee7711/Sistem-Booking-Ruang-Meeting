<?php

namespace App\Http\Controllers;

use App\Models\Slot;
use App\Models\Booking;
use Illuminate\Http\Request;

class SlotController extends Controller
{
    public function index(Request $request)
    {
        $roomId = $request->query('roomId');
        $date = $request->query('date');

        $slots = Slot::where('room_id', $roomId)->get()->map(function ($slot) use ($date) {
            $isBooked = false;
            if ($date) {
                $isBooked = Booking::where('slot_id', $slot->id)
                                   ->where('date', $date)
                                   ->exists();
            }

            // Memotong detik dari format MySQL (09:00:00 -> 09:00)
            $startTime = substr($slot->start_time, 0, 5);
            $endTime = substr($slot->end_time, 0, 5);

            return [
                'id' => $slot->id,
                'roomId' => $slot->room_id,
                'time' => $startTime . '-' . $endTime,
                'isAvailable' => !$isBooked
            ];
        });

        return response()->json($slots, 200);
    }
}