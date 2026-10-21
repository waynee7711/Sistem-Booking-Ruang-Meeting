# Room Spaces — Sistem Booking Ruang Meeting

Aplikasi pemesanan ruang meeting dengan frontend web berbasis HTML CSS JS, dan REST API berbasis Laravel serta database menggunakan MySQL. Pengguna dapat melihat ruangan, memilih tanggal dan slot waktu, mengisi data pemesan, lalu menerima konfirmasi booking.

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

## Asumsi Sistem

Dalam pengembangan dan perancangan aplikasi ini, beberapa asumsi dasar yang digunakan meliputi:

1. **Jam operasional:** Slot waktu pemesanan ruangan diasumsikan tersedia secara standar pada pukul 09.00 hingga 17.00 setiap harinya.
2. **Ketersediaan slot harian:** Setiap ruangan memiliki slot per jam yang dapat dipesan. Slot yang sudah terlewat waktunya pada hari yang sama akan otomatis ditandai tidak tersedia untuk mencegah booking di masa lalu (*past time*).
3. **Sistem reservasi tunggal (tanpa autentikasi ketat):** Aplikasi ini berasumsi bahwa sistem pemesanan ditujukan untuk penggunaan cepat (publik/internal instansi) di mana pengguna cukup mengisi data pemesan valid tanpa perlu registrasi atau login akun terlebih dahulu.
4. **Lingkungan deployment:** Aplikasi mendukung penyimpanan data terpusat menggunakan MySQL secara lokal menggunakan XAMPP

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
- MySQL Server, melalui XAMPP.
- Browser modern.
- Koneksi internet untuk memuat Tailwind CSS, Lucide Icons, dan Google Fonts dari CDN.

## Menjalankan Secara Lokal

### 1. Nyalakan database lokal

Buka **XAMPP Control Panel** lalu klik **Start** pada baris **MySQL**. Apache tidak diperlukan untuk menjalankan aplikasi dengan langkah di bawah ini. Nyalakan **Apache** juga hanya jika Anda ingin membuka phpMyAdmin melalui `http://localhost/phpmyadmin` untuk membuat database.

Di phpMyAdmin, buat database baru contohnya bernama `sistem_booking_ruangan`. Jika menggunakan MySQL Server secara langsung, pastikan layanan MySQL sudah berjalan dan buat database dengan nama yang sama.

### 2. Siapkan backend

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

Setelah database dibuat dan MySQL berjalan, jalankan migrasi dan data awal:

```powershell
php artisan migrate --seed
```

Nyalakan API Laravel:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

### 3. Jalankan frontend

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
