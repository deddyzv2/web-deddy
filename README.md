# Illustration Tone Slider

Web app React + Vite + Tailwind CSS untuk membuat Template Tone dan Brainstorming Ide ilustrasi. Aplikasi memakai Supabase Auth dan menyimpan data per user di Supabase, sehingga data bisa tersinkron antar perangkat.

## Menjalankan Project Lokal

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka URL yang muncul di terminal, biasanya:

```text
http://localhost:5173
```

Di Windows, bisa juga menjalankan:

```bat
run-dev.bat
```

## File .env

Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=https://jbmgjlzguchhalsandyt.supabase.co
VITE_SUPABASE_ANON_KEY=isi_publishable_key_anda
```

Untuk project ini file `.env` sudah dibuat. Jika deploy ke hosting, masukkan dua variable yang sama di pengaturan environment hosting.

## Menjalankan SQL di Supabase

1. Buka dashboard Supabase.
2. Pilih project yang digunakan.
3. Masuk ke menu `SQL Editor`.
4. Buka file [supabase-schema.sql](./supabase-schema.sql).
5. Salin seluruh isi SQL.
6. Jalankan SQL di Supabase.

SQL tersebut membuat tabel:

- `tone_templates`
- `brainstorming_ideas`

Kedua tabel memakai Row Level Security. Policy membatasi user agar hanya bisa melihat, membuat, mengubah, dan menghapus data miliknya sendiri.

## Fitur

- Daftar akun, login, dan logout dengan Supabase Auth.
- Tampilkan email user yang sedang login.
- Jika belum login, aplikasi menampilkan halaman login/daftar.
- Template Tone:
  - Simpan template
  - Muat template milik user
  - Perbarui template
  - Hapus template
- Brainstorming Ide:
  - Simpan ide
  - Muat ide milik user
  - Perbarui ide
  - Hapus ide
  - Kirim ide ke Template Tone
- Status:
  - Memuat data...
  - Menyimpan...
  - Tersimpan
  - Gagal menyimpan
  - Silakan login terlebih dahulu

## Deploy ke Vercel

1. Push project ke GitHub.
2. Buat project baru di Vercel.
3. Pilih repository project ini.
4. Tambahkan environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Build command:

```bash
npm run build
```

6. Output directory:

```text
dist
```

7. Deploy.

Pastikan URL domain Vercel sudah ditambahkan di Supabase Auth settings jika memakai email confirmation atau redirect.

## Struktur Penting

```text
.
├── src
│   ├── lib
│   │   └── supabaseClient.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── supabase-schema.sql
├── package.json
└── README.md
```
