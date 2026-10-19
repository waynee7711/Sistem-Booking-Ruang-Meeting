<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Input Dasar (Status 422)
        $validator = Validator::make($request->all(), [
            'roomId' => 'required|exists:rooms,id',
            'slotId' => 'required|exists:slots,id',
            'date' => 'required|date|after_or_equal:today',
            'name' => 'required|string|min:3|regex:/^[a-zA-Z\s\'-]+$/',
            'email' => 'required|email',
            'phone' => 'required|numeric|digits_between:10,13',
            'participants' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data tidak valid',
                'errors' => $validator->errors()
            ], 422);
        }

        $roomId = $request->input('roomId');
        $slotId = $request->input('slotId');
        $date = $request->input('date');
        $participants = $request->input('participants');

        // 2. Cek Kapasitas Ruangan (Status 422 / 400)
        $room = Room::find($roomId);
        if ($participants > $room->capacity) {
            return response()->json([
                'message' => 'Jumlah peserta (' . $participants . ' org) melebihi batas kapasitas maksimal ruangan ini (' . $room->capacity . ' org).'
            ], 422);
        }

        // 3. Cek Ketersediaan Jadwal / Conflict (Status 409)
        $isBooked = Booking::where('slot_id', $slotId)
                           ->where('date', $date)
                           ->exists();

        if ($isBooked) {
            return response()->json([
                'message' => 'Mohon maaf, slot jam ini sudah dipesan oleh orang lain pada tanggal tersebut.'
            ], 409);
        }

        // 4. Simpan Data ke Database (Status 201 Created)
        $booking = Booking::create([
            'room_id' => $roomId,
            'slot_id' => $slotId,
            'date' => $date,
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'participants' => $participants
        ]);

        return response()->json($booking, 201);
    }
}