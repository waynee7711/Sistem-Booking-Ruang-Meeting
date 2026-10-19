<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        Room::create([
            'name' => 'Ruang Alpha',
            'capacity' => 4,
            'pricePerHour' => 50000,
            'facilities' => 'Whiteboard, Wifi',
            'image' => 'room1_alpha.jpeg'
        ]);

        Room::create([
            'name' => 'Ruang Beta',
            'capacity' => 10,
            'pricePerHour' => 100000,
            'facilities' => 'TV, Projector',
            'image' => 'room2_beta.jpg'
        ]);

        Room::create([
            'name' => 'Ruang Charlie',
            'capacity' => 20,
            'pricePerHour' => 250000,
            'facilities' => 'Sound System, Mic',
            'image' => 'room3_charlie.jpeg'
        ]);
    }
}
