<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Slot;
use App\Models\Room;

class SlotSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = Room::all();

        foreach ($rooms as $room) {
            // Membuat jadwal otomatis dari jam 09:00 sampai 16:00
            for ($i = 9; $i <= 16; $i++) {
                $startTime = sprintf('%02d:00:00', $i);
                $endTime = sprintf('%02d:00:00', $i + 1);

                Slot::create([
                    'room_id' => $room->id,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'status' => 'available' // Status default tersedia
                ]);
            }
        }
    }
}
