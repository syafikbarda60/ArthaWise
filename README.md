# ArthaWise 🚀

> Platform manajemen keuangan pribadi modern berbasis AI yang dibangun dengan Next.js, Express, FastAPI, dan MongoDB.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)

## Deskripsi Singkat Proyek & Fitur Utama

### Manajemen Keuangan Pribadi
- **Pencatatan Transaksi**: Mencatat pemasukan dan pengeluaran harian dengan mudah.
- **Dashboard Interaktif**: Visualisasi data keuangan Anda menggunakan diagram lingkaran (Pie Chart) dan diagram batang (Bar Chart) yang animatif.
- **Laporan Detail**: Melihat wawasan mendalam dan langkah-langkah yang dapat ditindaklanjuti untuk kesehatan keuangan Anda.
- **Dukungan Offline**: Penyimpanan lokal sementara memastikan dashboard tetap dapat diakses meskipun tanpa koneksi internet atau database.

### Kecerdasan Buatan (AI)
- **Klasifikasi Pintar**: Mengklasifikasikan transaksi ke dalam kategori pengeluaran secara otomatis menggunakan model Machine Learning (Tanpa perlu input manual).
- **1-Day Forecasting (Prediksi)**: Memprediksi pengeluaran Anda untuk hari esok menggunakan jaringan saraf tiruan Long Short-Term Memory (LSTM).
- **Profil Finansial (Clustering)**: Menentukan persona finansial Anda secara otomatis (misalnya "Penabung Seimbang" atau "Konsumtif") berdasarkan kebiasaan pengeluaran Anda.
- **Sistem Fallback**: Sistem cadangan darurat (rule-based) untuk memastikan aplikasi tetap berjalan dan memberikan analisis estimasi meskipun service AI (FastAPI) sedang terputus.

### Keunggulan Teknis
- **Arsitektur Microservices**: Pemisahan yang rapi antara Frontend (Next.js), Backend API Utama (Express), dan Service AI (FastAPI).
- **Desain Responsif**: Desain UI premium bergaya modern-glassmorphism yang dioptimalkan untuk perangkat seluler dan desktop dengan animasi Framer Motion.
- **Type-Safe API**: Menggunakan interface TypeScript untuk memastikan komunikasi data yang kuat di seluruh stack.

## Dokumentasi Visual (Screenshots)

*Tangkapan layar hasil pengembangan produk ArthaWise.*

| Halaman Landing | Dashboard |
|---|---|
| ![Landing Page](https://github.com/user-attachments/assets/a218d6c2-5599-4b4a-a71d-4eaf8140553b) | ![Dashboard](https://github.com/user-attachments/assets/25ee1be3-bb50-4a78-bc61-f94807b6c3de) |

| Transaksi | AI Insights |
|---|---|
| ![Transaksi](https://github.com/user-attachments/assets/5dc97995-e5f7-49be-bf60-f79004cf8e1a) | ![AI Insights](https://github.com/user-attachments/assets/2715c202-86a4-416c-a129-1d8731f517f6) |

> **Catatan Implementasi UI/UX**: Desain di atas menggunakan pendekatan *Dark Mode* modern dengan *Glassmorphism* dan aksen *brand-cyan* untuk memberikan nuansa premium dan futuristik (Sesuai dengan target audiens generasi muda).

## Tech Stack (Teknologi yang Digunakan)

### Frontend
- **Framework**: Next.js 16 (App Router) dengan React 19
- **Bahasa**: TypeScript 5
- **Styling**: Tailwind CSS 4 + Vanilla CSS
- **Animasi**: Framer Motion
- **HTTP Client**: Axios

### Backend (Main API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Peran**: Menangani operasi CRUD transaksi, logika perhitungan total saldo, dan bertindak sebagai API Gateway yang menjembatani Frontend ke Service AI.

### AI Service (Machine Learning)
- **Framework**: FastAPI (Python)
- **Deep Learning**: TensorFlow / Keras (LSTM & Neural Networks)
- **Pemrosesan Data**: Scikit-Learn, NumPy, Pandas
- **Peran**: Meng-host model `.keras` dan `.pkl` yang sudah dilatih (pre-trained) untuk melakukan inferensi prediksi secara real-time.

## Tautan Model ML (Machine Learning Models)

Untuk menjalankan fitur AI secara lokal, Anda wajib mengunduh model pra-latih (pre-trained models) dari tautan Google Drive di bawah ini dan menempatkannya di dalam folder `saved_models/` yang terletak di root (dasar) proyek ini.

- **Tautan Google Drive**: [Download ML Models Di Sini](https://drive.google.com/drive/folders/1srmlzFGPbiXzEXEdMWUkrM72_FmX0qsL?usp=sharing)

Pastikan tim penilai (`capstone@student.devacademy.id`) memiliki akses untuk melihat folder tersebut.

## Petunjuk Setup Environment

### Persyaratan Sistem (Prerequisites)
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
- [Python](https://www.python.org/) (Versi 3.9 atau lebih baru)
- [MongoDB](https://www.mongodb.com/) (Berjalan secara lokal di port 27017)

### 1. Kloning Repositori
```bash
git clone https://github.com/syafikbarda60/ArthaWise.git
cd ArthaWise
```

### 2. Jalankan MongoDB
Pastikan instans MongoDB lokal Anda sedang berjalan pada port `27017`.

### 3. Konfigurasi AI Service (Python)
Buka terminal baru:
```bash
cd ai_service
python -m venv venv

# Aktifkan virtual environment (Windows)
.\venv\Scripts\activate

# Instal dependensi
pip install -r requirements.txt

# Jalankan server FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000
```
*Tunggu hingga muncul pesan "All models loaded successfully!".*

### 4. Konfigurasi Backend (Node.js)
Buka terminal baru lagi:
```bash
cd backend
npm install
npm run dev:watch
```
*Backend Express akan berjalan di port 5001.*

### 5. Konfigurasi Frontend (Next.js)
Buka terminal baru yang terakhir:
```bash
cd frontend
npm install
npm run dev
```
*Frontend Next.js akan berjalan di port 3000.*

## Cara Menjalankan Aplikasi

Setelah ketiga service utama (MongoDB, FastAPI, dan Express) berjalan dengan baik, serta model ML sudah diletakkan di dalam folder `saved_models/`, buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Alur Penggunaan Aplikasi (User Flow)

Berikut adalah langkah-langkah singkat untuk menggunakan aplikasi ArthaWise:

1. **Akses Halaman Landing & Login:** Buka aplikasi di localhost:3000, baca informasi fitur di halaman utama, lalu lakukan Login untuk masuk ke akun Anda.
2. **Tambahkan Transaksi Harian:** Buka halaman Transaksi atau Dashboard, klik tombol "Tambah Transaksi" dan masukkan nominal serta deskripsi (contoh: "Beli Nasi Goreng"). **AI akan otomatis mengklasifikasikan** kategori pengeluaran Anda (misal: "Food & Beverage") tanpa perlu Anda pilih secara manual!
3. **Pantau Dashboard:** Lihat ringkasan keuangan (Saldo, Pemasukan, Pengeluaran), grafik tren mingguan, dan komposisi kategori pengeluaran Anda dalam bentuk visual interaktif.
4. **Cek Prediksi & Profil di AI Insights:** Kunjungi halaman AI Insights untuk melihat prediksi pengeluaran Anda untuk **besok** (berdasarkan AI LSTM) dan mengetahui **Profil Finansial** Anda (misal: apakah Anda termasuk "Konsumtif" atau "Penabung").

## Struktur Proyek

```text
arthawise/
├── ai_service/         # Microservice Python untuk Inferensi AI
│   ├── main.py         # Entrypoint FastAPI
│   └── requirements.txt
├── backend/            # Backend Node.js (Express & MongoDB)
│   ├── src/
│   │   ├── controllers/# Logika bisnis dan integrasi
│   │   ├── models/     # Skema Mongoose
│   │   └── routes/     # Routing Express
│   └── server.js
├── frontend/           # Aplikasi Utama Next.js
│   ├── app/            # Next.js App Router (Halaman Web)
│   ├── components/     # Komponen React (UI, Charts) yang dapat digunakan ulang
│   └── lib/            # Fungsi utilitas & Klien API Axios
└── saved_models/       # Folder untuk Model ML Pre-trained
    ├── classifier_model.keras
    ├── forecasting_model.keras
    ├── label_encoder.pkl
    ├── scaler_classifier.pkl
    └── scaler_forecast.pkl
```

## Daftar API Endpoint

### Transaksi (Node.js Backend)
- `GET /api/transactions` - Mendapatkan daftar semua transaksi
- `POST /api/transactions` - Membuat transaksi baru (Dikategorikan otomatis oleh AI)
- `DELETE /api/transactions/:id` - Menghapus transaksi
- `GET /api/transactions/summary` - Mendapatkan ringkasan total pemasukan, pengeluaran, dan saldo

### Wawasan AI / Insights (FastAPI via Node.js Proxy)
- `GET /api/ai/forecast` - Mendapatkan prediksi pengeluaran 1 hari ke depan
- `GET /api/ai/profile` - Mendapatkan pemrofilan kepribadian finansial pengguna secara dinamis

---
*Dibangun untuk DBS Foundation Capstone Project.*
