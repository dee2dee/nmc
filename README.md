# NMC — Internal Office Information Management System

**NMC** adalah aplikasi web internal berbasis **Golang (Gin Framework)** yang dirancang untuk membantu pengelolaan informasi dan komunikasi di lingkungan kantor.  
Aplikasi ini digunakan secara **lokal (intranet)** dan dikembangkan sebagai proyek internal/internship untuk mendukung kebutuhan divisi dalam mengelola data kontak, ekstensi telepon, prosedur eskalasi, dan data pengguna.

---

## Struktur Folder

nmc/
├── assets/      # File statis (CSS, JS, gambar, icon)
├── controllers/ # Logika utama aplikasi & handler untuk setiap endpoint
├── middlewares/ # Middleware (AuthRequired, NoCache, Session)
├── models/      # Model data & koneksi ke database
├── routers/     # Definisi semua route dan endpoint aplikasi
├── views/       # Template HTML dan layout tampilan
├── .env         # Konfigurasi environment (upload path, DB, dsb)
├── go.mod       # Module dependencies
├── go.sum       # Dependency checksum
└── main.go      # Entry point aplikasi


---

## Fitur Utama

### Autentikasi & Session
- Login dan logout menggunakan **cookie-based session**
- Middleware `AuthRequired` untuk melindungi halaman privat
- Session otomatis berakhir setelah periode tertentu

### Address Book
- CRUD data kontak internal & eksternal
- Fungsi pencarian cepat
- Tampilan daftar kontak terintegrasi dengan dashboard

### Extention Phone Management
- Manajemen nomor ekstensi per divisi
- Pencarian & update data ekstensi
- Halaman ringkas untuk akses cepat

### Escalation Procedure
- Menyimpan & menampilkan prosedur eskalasi per divisi
- CRUD penuh untuk admin/operator

### Bank Data
- Manajemen informasi rekening internal perusahaan
- CRUD & pencarian data berdasarkan nama bank / divisi

### User Management
- Tambah, ubah, hapus user
- Reset password oleh admin
- Pengelolaan hak akses dasar

---

## Teknologi yang Digunakan

| Komponen               | Teknologi                   |
|------------------------|-----------------------------|
| **Bahasa Pemrograman** | Go (Golang)                 |
| **Framework Web**      | Gin Gonic                   |
| **Frontend UI**        | HTML5 + Bootstrap           |
| **Template Engine**    | Go `html/template`          |
| **Session Management** | gin-contrib/sessions        |
| **Database**           | MySQL                       |
| **Autentikasi**        | Session Cookie              |
| **Konfigurasi**        | `.env` Environment Variable |

---

## Cara Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone https://github.com/username/nmc.git
cd nmc

2. Install Dependencies
go mod tidy

3. Konfigurasi Environment
FILE_UPLOAD_PATH=./files/uploads
SESSION_SECRET=yourSecretKey
DB_USER=root
DB_PASS=password
DB_NAME=nmcdb
DB_HOST=localhost
DB_PORT=3306

4. Jalankan Server
go run main.go

5. Akses di Browser
http://localhost:8080

Arsitektur Aplikasi
Aplikasi ini menggunakan arsitektur MVC (Model–View–Controller):
-Models: Menangani koneksi database & struktur data.
-Controllers: Berisi logic utama dan handler untuk setiap request.
-Views: Menyediakan tampilan HTML berbasis template Go.
-Routers: Mengatur endpoint API & halaman web.
-Middlewares: Menyediakan fungsi keamanan seperti autentikasi & cache control.

Modul Utama & Endpoint

| Modul           | Endpoint        | Method              | Deskripsi                |
| --------------- | --------------- | ------------------- | ------------------------ |
| Login           | `/login`        | POST                | Login ke sistem          |
| Logout          | `/logout`       | POST                | Logout dan hapus session |
| Address Book    | `/address-book` | GET/POST            | Lihat atau cari kontak   |
| Extention Phone | `/extention`    | GET/POST/PUT/DELETE | CRUD ekstensi telepon    |
| Escalation      | `/escalation`   | GET/POST/PUT/DELETE | CRUD prosedur eskalasi   |
| Bank Data       | `/bankdata`     | GET/POST/PUT/DELETE | CRUD data bank           |
| User            | `/user`         | GET/POST/PUT/DELETE | Manajemen user           |


Tentang Developer
Proyek ini dikembangkan sebagai bagian dari pengembangan sistem internal kantor (internship project).
Tujuannya untuk mempelajari dan mengimplementasikan:
-Struktur aplikasi web dengan Gin
-Middleware & session management
-Autentikasi berbasis session
-Penerapan MVC dalam project Go
Status: Aktif (development & internal testing)
Kontak: dedeeapr17@gmail.com
GitHub: https://github.com/dee2dee/nmc

Lisensi
Proyek ini bersifat **internal dan untuk keperluan pembelajaran**.
Tidak untuk distribusi publik tanpa izin dari pemilik repository atau pihak kantor terkait.

