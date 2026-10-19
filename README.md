# Room Spaces — Sistem Booking Ruang Meeting

Aplikasi pemesanan ruang meeting dengan frontend web dan REST API berbasis Laravel. Pengguna dapat melihat ruangan, memilih tanggal dan slot waktu, mengisi data pemesan, lalu menerima konfirmasi booking.

## Fitur

- Menampilkan daftar ruang, kapasitas, fasilitas, harga per jam, dan foto.
- Memilih tanggal dan slot waktu booking.
- Menandai slot yang sudah dipesan atau sudah lewat untuk booking pada hari ini.
- Memvalidasi data pemesan dan jumlah peserta.
- Menyimpan booking melalui API dan menampilkan ringkasan konfirmasi.
- Menyediakan data awal tiga ruangan beserta slot waktu pukul 09.00–17.00.

## Teknologi

- **Frontend:** HTML, CSS, dan JavaScript tanpa framework; Tailwind CSS, Lucide Icons, dan Google Fonts dimuat melalui CDN.
- **Backend:** PHP 8.2+, Laravel 12, dan REST API.
- **Database:** MySQL.

## Struktur Proyek

```text
.
├── backend/
│   ├── app/                 # Model dan controller Laravel
│   ├── database/
│   │   ├── migrations/      # Skema tabel
│   │   └── seeders/         # Data awal ruangan dan slot
│   └── routes/api.php       # Endpoint REST API
└── frontend/
    ├── assets/              # Gambar dan logo
    ├── app.js               # Interaksi booking dan pemanggilan API
    ├── index.html           # Halaman aplikasi
    └── style.css            # Styling tambahan
```

## Persyaratan

- PHP 8.2 atau lebih baru dan ekstensi yang dibutuhkan Laravel.
- Composer.
- MySQL Server.
- Browser modern.
- Koneksi internet untuk memuat Tailwind CSS, Lucide Icons, dan Google Fonts dari CDN.

## Menjalankan Secara Lokal

### 1. Siapkan backend

Buka terminal di root repository, lalu jalankan:

```powershell
Set-Location backend
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Template `backend/.env.example` sudah menggunakan MySQL. Sesuaikan `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` di `backend/.env` dengan konfigurasi lokal Anda jika diperlukan:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistem_booking_ruangan
DB_USERNAME=root
DB_PASSWORD=
```

Buat database `sistem_booking_ruangan` di MySQL terlebih dahulu, lalu jalankan migrasi dan data awal:

```powershell
php artisan migrate --seed
```

Nyalakan API Laravel:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

### 2. Jalankan frontend

Buka terminal kedua dari root repository:

```powershell
Set-Location frontend
php -S 127.0.0.1:5500
```

Buka **http://127.0.0.1:5500** di browser. Frontend mengirim permintaan ke API di **http://127.0.0.1:8000/api**, jadi jalankan kedua server selama menggunakan aplikasi.

## REST API

Semua endpoint berada di bawah prefix `/api`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/api/rooms` | Mengambil daftar ruangan. |
| `GET` | `/api/slots?roomId=1&date=2026-10-20` | Mengambil slot milik ruangan. Parameter `date` opsional; jika disertakan, respons menunjukkan apakah slot sudah dipesan pada tanggal tersebut. |
| `POST` | `/api/bookings` | Membuat booking baru. |

Contoh body untuk membuat booking:

```json
{
  "roomId": 1,
  "slotId": 1,
  "date": "2026-10-20",
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890",
  "participants": 3
}
```

Booking yang berhasil menghasilkan status `201 Created`. Data yang tidak valid menghasilkan `422 Unprocessable Entity`, sedangkan slot yang sudah dipesan pada tanggal yang sama menghasilkan `409 Conflict`.

## Pengujian

Dari root repository, jalankan:

```powershell
Set-Location backend
php artisan test
```

## Catatan Konfigurasi

- Alamat API frontend ditetapkan di `frontend/app.js` sebagai `http://127.0.0.1:8000/api`. Jika alamat atau port backend diubah, sesuaikan nilai tersebut.
- Jangan commit file `.env` atau kredensial database ke repository.
