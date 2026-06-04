# Product Requirements Document (PRD)
## ArthaWise: Smart Personal Finance Assistant
**Version:** 1.0  
**Project ID:** CC26-PSU332  
**Program:** Coding Camp 2026 powered by DBS Foundation  
**Theme:** Revolusi Teknologi Keuangan (Fintech) untuk Generasi Muda  
**Timeline:** 14 April – 7 June 2025  

---

## 1. Product Overview

### 1.1 Problem Statement

Generasi muda Indonesia menghadapi tantangan signifikan dalam mengelola keuangan pribadi secara efektif. Tiga masalah utama yang diidentifikasi:

1. **Ketidakmampuan memahami pola pengeluaran** — pengguna tidak tahu ke mana uang mereka pergi.
2. **Kurangnya kontrol atas kebiasaan konsumtif** — tidak ada sinyal/peringatan berbasis data.
3. **Ketidakmampuan merencanakan keuangan masa depan** — absennya alat prediksi yang personal dan berbasis data historis.

Akar masalah: rendahnya literasi finansial dan tidak adanya alat yang memberikan analisis serta rekomendasi berbasis data secara personal.

### 1.2 Solution

ArthaWise adalah aplikasi web berbasis AI yang membantu pengguna memahami kondisi keuangan mereka melalui:
- Analisis data transaksi otomatis
- Pengelompokan pola keuangan (clustering)
- Prediksi pengeluaran masa depan (forecasting)
- Dashboard visual interaktif
- Input manual catatan keuangan dengan dukungan klasifikasi otomatis berbasis AI

### 1.3 Target Users

**Primary:** Generasi muda (18–30 tahun), mahasiswa, fresh graduate, young professional Indonesia yang ingin memahami dan mengelola keuangan pribadi secara mandiri.

**Secondary:** Siapa saja yang ingin memiliki visibilitas terhadap pola keuangan pribadi tanpa perlu keahlian finansial khusus.

### 1.4 Value Proposition

ArthaWise bukan sekadar pencatat keuangan. Aplikasi ini menganalisis data transaksi, mengelompokkan perilaku finansial, dan memprediksi pengeluaran masa depan — sehingga pengguna dapat membuat keputusan finansial yang lebih bijak berdasarkan data nyata, bukan intuisi.

---

## 2. Technical Architecture

### 2.1 Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React.js / Next.js |
| Backend | Node.js (Express.js) |
| AI Inference Service | Python + FastAPI (microservice terpisah) |
| Database | MongoDB |
| Data Science Dashboard | Streamlit |
| ML/DL Framework | TensorFlow (Functional API & LSTM) |
| Data Processing | Python, NumPy, Pandas |
| Visualization (DS) | Matplotlib, Seaborn |
| Deployment (Web) | Vercel / Netlify |
| Deployment (DS Dashboard) | Streamlit Cloud |
| Development Environment | Google Colab |

### 2.2 System Architecture Overview

```
User (Browser)
    │
    ▼
[React/Next.js Frontend]
    │  (Axios HTTP calls)
    ▼
[Express.js Backend — Node.js]
    │                   │
    ▼                   ▼
[MongoDB]       [FastAPI Microservice — Python]
                        │
                        ▼
               [TensorFlow Models]
               - Model 1: Classification (Multi-Input)
               - Model 2: Forecasting (LSTM)
```

**Data Flow:**
- User input transaksi → Express.js → MongoDB (simpan) + FastAPI (klasifikasi otomatis)
- User request analisis → Express.js → FastAPI → TF Model inference → response ke frontend
- Dashboard DS → Streamlit (standalone, akses langsung ke dataset)

### 2.3 Dataset

**Sumber:** Kaggle — *Personal Finance Dataset* (`personal_transactions.csv`)  
**Sifat:** Dataset publik, bukan data perbankan live.  
**Penggunaan:** Training model ML/DL, analisis EDA, demonstrasi fitur dashboard.

---

## 3. AI/ML Models

ArthaWise menggunakan **dual-model architecture**:

### 3.1 Model 1 — Transaction Classifier (Multi-Input Architecture)

**Tujuan:** Mengklasifikasikan transaksi keuangan ke dalam kategori pengeluaran secara otomatis, sehingga pengguna tidak perlu memilih kategori manual.

**Arsitektur:**
- TensorFlow Functional API
- Multi-Input: menggabungkan input teks (deskripsi transaksi) + data numerik (nominal, tanggal, dll.)
- Text processing: `GlobalAveragePooling1D` (efisien, ringan untuk deployment)
- Numeric processing: Dense layers
- Output: kategori transaksi (label klasifikasi)

**Custom Components:**
- Custom Loss Function
- Custom Callback (auto-stop training saat target performa tercapai)

**Target Performa:**
- Minimum accuracy: **85%**
- MAE maksimal: **0.02**

**Monitoring:** TensorBoard logging selama training & evaluasi.

---

### 3.2 Model 2 — Expenditure Forecaster (LSTM Time Series)

**Tujuan:** Memprediksi jumlah pengeluaran di masa depan berdasarkan pola historis transaksi pengguna.

**Arsitektur:**
- LSTM (Long Short-Term Memory)
- Input: urutan waktu pengeluaran historis pengguna
- Output: estimasi pengeluaran periode berikutnya

**Custom Components:**
- Custom Loss Function (sama seperti Model 1)
- Custom Callback (auto-stop training)

**Target Performa:** Sama — minimum accuracy 85%, MAE ≤ 0.02

**Monitoring:** TensorBoard

---

### 3.3 Model Deployment

Kedua model di-serve melalui **FastAPI microservice** yang berjalan terpisah dari backend Express.js. Express.js memanggil FastAPI via HTTP ketika membutuhkan inference.

- Endpoint klasifikasi: menerima data transaksi → return kategori
- Endpoint forecasting: menerima data historis → return prediksi pengeluaran

---

## 4. Features

### 4.1 Feature List

| ID | Fitur | Deskripsi | PIC |
|---|---|---|---|
| F-01 | Upload Data Transaksi | User dapat mengunggah file CSV transaksi keuangan | Full-Stack |
| F-02 | Input Catatan Keuangan Manual | Form untuk mencatat pemasukan/pengeluaran secara manual | Full-Stack |
| F-03 | Klasifikasi Transaksi Otomatis | Sistem otomatis mengklasifikasikan transaksi ke kategori menggunakan AI | AI Engineer |
| F-04 | Ringkasan Pengeluaran | Agregasi & tampilan pengeluaran per kategori | DS + Full-Stack |
| F-05 | Analisis Perilaku Finansial | Clustering kebiasaan keuangan (hemat vs konsumtif) | Data Scientist |
| F-06 | Estimasi Pengeluaran Mendatang | Prediksi pengeluaran masa depan berbasis LSTM | AI Engineer |
| F-07 | Dashboard Visual Interaktif | Visualisasi data keuangan (chart, grafik) | DS + Full-Stack |
| F-08 | Pie Chart Sisa Saldo | Visualisasi komposisi saldo vs pengeluaran | Full-Stack |
| F-09 | RESTful API CRUD Catatan Keuangan | API endpoint untuk create/read/update/delete catatan | Full-Stack |
| F-10 | Integrasi FE ↔ BE ↔ AI Service | Networking call dari React → Express → FastAPI | Full-Stack |
| F-11 | Streamlit Dashboard (DS) | Dashboard analitik terpisah untuk eksplorasi data ilmiah | Data Scientist |
| F-12 | Responsive UI | Tampilan yang berfungsi di desktop dan mobile browser | Full-Stack |

---

### 4.2 Feature Detail

#### F-01 — Upload Data Transaksi

- User dapat mengupload file CSV yang berisi riwayat transaksi keuangan.
- Sistem mem-parsing CSV, memvalidasi format kolom, dan menyimpan ke MongoDB.
- Setelah upload, sistem secara otomatis menjalankan proses klasifikasi (F-03) terhadap data yang diunggah.
- **Input:** File CSV (`personal_transactions.csv` format compatible)
- **Output:** Data tersimpan di database, ditampilkan di dashboard (F-07)

---

#### F-02 — Input Catatan Keuangan Manual

- Form input dengan field: tanggal, nominal, deskripsi/keterangan, tipe (pemasukan/pengeluaran).
- Setelah submit, sistem otomatis memanggil Model 1 (F-03) untuk mengklasifikasikan kategori.
- Data tersimpan ke MongoDB via Express.js API.
- **UI:** Form responsif, validasi client-side (nominal harus angka, tanggal valid, deskripsi tidak boleh kosong).

---

#### F-03 — Klasifikasi Transaksi Otomatis

- Setiap transaksi yang masuk (manual maupun upload) dikirim ke FastAPI microservice.
- FastAPI menjalankan Model 1 (Multi-Input TF) dan mengembalikan prediksi kategori.
- Kategori hasil prediksi tersimpan bersama data transaksi.
- **Contoh kategori:** Makanan & Minuman, Transportasi, Hiburan, Kesehatan, Belanja, Tagihan, Tabungan, dll.
- User dapat melihat kategori yang diprediksi (dan ke depannya bisa dikoreksi manual).

---

#### F-04 — Ringkasan Pengeluaran

- Tampilan agregasi total pengeluaran yang dikelompokkan per kategori (hasil F-03).
- Filter berdasarkan periode: mingguan, bulanan, rentang tanggal custom.
- Statistik utama yang ditampilkan:
  - Total pengeluaran periode ini
  - Pengeluaran terbesar per kategori
  - Perbandingan dengan periode sebelumnya (delta persentase)

---

#### F-05 — Analisis Perilaku Finansial

- Sistem mengelompokkan pola keuangan pengguna ke dalam profil finansial berdasarkan data historis.
- Profil contoh: "Konsumtif tinggi di kategori Hiburan", "Cenderung hemat, saving rate tinggi", dll.
- Hasil clustering dari Data Scientist disajikan secara visual dan deskriptif.
- **Algoritma:** Clustering (k-means atau sejenis) di sisi Data Science pipeline.

---

#### F-06 — Estimasi Pengeluaran Mendatang

- User dapat melihat prediksi pengeluaran untuk periode berikutnya (minggu/bulan depan).
- Prediksi dihasilkan oleh Model 2 (LSTM) berdasarkan pola historis transaksi pengguna.
- Ditampilkan sebagai:
  - Angka estimasi total pengeluaran
  - Grafik tren prediksi vs aktual (time series chart)
- Catatan untuk user: ini adalah estimasi berbasis data, bukan jaminan.

---

#### F-07 — Dashboard Visual Interaktif

- Halaman utama aplikasi web yang menampilkan semua insight dalam satu tampilan.
- Komponen dashboard:
  - Summary card (total pemasukan, total pengeluaran, saldo bersih)
  - Bar chart pengeluaran per kategori
  - Line chart tren pengeluaran harian/mingguan
  - Pie chart komposisi pengeluaran (F-08)
  - Prediksi pengeluaran ke depan (F-06)
  - Profil perilaku finansial (F-05)
- Semua chart interaktif (hover untuk detail, filter by periode).

---

#### F-08 — Pie Chart Sisa Saldo

- Visualisasi perbandingan: total pemasukan vs total pengeluaran vs sisa saldo.
- Ditampilkan dalam format donut/pie chart yang jelas dan mudah dibaca.
- Warna-warna yang kontras dan legend yang informatif.

---

#### F-09 — RESTful API CRUD Catatan Keuangan

Backend Express.js menyediakan API endpoint:

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/transactions` | Ambil semua transaksi user |
| GET | `/api/transactions/:id` | Ambil satu transaksi |
| POST | `/api/transactions` | Tambah transaksi baru |
| PUT | `/api/transactions/:id` | Edit transaksi |
| DELETE | `/api/transactions/:id` | Hapus transaksi |
| GET | `/api/transactions/summary` | Ringkasan pengeluaran |
| POST | `/api/transactions/upload` | Upload CSV transaksi |

---

#### F-10 — Integrasi FE ↔ BE ↔ AI Service

- Frontend (React) berkomunikasi dengan Backend (Express.js) via Axios HTTP.
- Backend (Express.js) berkomunikasi dengan AI Microservice (FastAPI) via HTTP internal.
- **Flow klasifikasi:** React → POST `/api/transactions` → Express menyimpan ke MongoDB → Express memanggil FastAPI `/classify` → FastAPI return kategori → Express update record → response ke React.
- **Flow forecasting:** React → GET `/api/forecast` → Express memanggil FastAPI `/forecast` → return prediksi → Express format response → React tampilkan di dashboard.

---

#### F-11 — Streamlit Dashboard (Data Science)

- Dashboard terpisah yang di-deploy ke Streamlit Cloud.
- Ditujukan untuk eksplorasi data ilmiah dan showcase hasil analisis.
- Konten:
  - EDA visualizations (distribusi, korelasi, outlier)
  - Hasil clustering/segmentasi pengguna
  - Model evaluation metrics & TensorBoard exports
  - Data dictionary
- **Akses:** URL terpisah dari aplikasi web utama.

---

#### F-12 — Responsive UI

- Semua halaman berfungsi baik di desktop (≥1024px) dan mobile (≥375px).
- Layout menggunakan responsive grid/flexbox.
- Navigation accessible di mobile (hamburger menu atau bottom navigation).

---

## 5. User Flows

### 5.1 New User — Onboarding & First Analysis

```
1. User membuka aplikasi web
2. User mengupload file CSV transaksi (F-01)
   ATAU
   User mengisi form input manual beberapa transaksi (F-02)
3. Sistem otomatis mengklasifikasikan transaksi (F-03)
4. Dashboard (F-07) langsung menampilkan:
   - Ringkasan pengeluaran per kategori (F-04)
   - Pie chart saldo (F-08)
   - Profil perilaku finansial awal (F-05)
5. User melihat prediksi pengeluaran bulan depan (F-06)
```

### 5.2 Returning User — Daily Log

```
1. User buka aplikasi
2. User tambah transaksi harian via form (F-02)
3. Kategori otomatis terisi (F-03)
4. Dashboard terupdate real-time
5. User cek perubahan tren dan prediksi
```

---

## 6. Data Model

### 6.1 Transaction Document (MongoDB)

```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "date": "ISODate",
  "amount": "number (negatif = pengeluaran, positif = pemasukan)",
  "type": "enum: ['income', 'expense']",
  "description": "string",
  "category": "string (hasil prediksi Model 1)",
  "category_confidence": "number (0–1, confidence score dari model)",
  "source": "enum: ['manual', 'csv_upload']",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### 6.2 Kategori Transaksi (Output Model 1)

Kategori yang dikenali sistem (dapat berkembang):
- `food_drink` — Makanan & Minuman
- `transportation` — Transportasi
- `entertainment` — Hiburan
- `health` — Kesehatan
- `shopping` — Belanja
- `bills` — Tagihan & Utilitas
- `savings` — Tabungan
- `education` — Pendidikan
- `other` — Lain-lain

---

## 7. Non-Functional Requirements

| Aspek | Requirement |
|---|---|
| Performance | Halaman utama load < 3 detik. Inference AI response < 2 detik per transaksi. |
| Availability | Web app deployed di Vercel/Netlify (uptime ≥ 99%). FastAPI microservice tersedia selama demo dan evaluasi. |
| Scalability | MVP tidak wajib horizontal scaling, tapi arsitektur microservice memungkinkan scale-out FastAPI secara independen. |
| Security | Data keuangan tidak dibagikan ke pihak ketiga. Tidak ada integrasi API perbankan nyata. Data bersifat lokal per session/user. |
| Usability | UI intuitif, pengguna tanpa latar belakang finansial profesional dapat memahami semua insight. |
| Compatibility | Berfungsi di browser modern: Chrome, Firefox, Safari, Edge. Responsive di desktop dan mobile. |
| Model Performance | Accuracy ≥ 85%, MAE ≤ 0.02 untuk kedua model TF. |

---

## 8. Out of Scope (Explicit Exclusions)

Item berikut **tidak** masuk dalam MVP proyek ini:

- Integrasi langsung dengan API perbankan atau e-wallet (BCA, Mandiri, GoPay, OVO, dll.)
- Autentikasi pengguna (login/register) — MVP menggunakan data per session
- Notifikasi real-time (push notification, email alert)
- Fitur multi-currency
- Rekomendasi investasi atau produk keuangan
- Sinkronisasi data real-time antar device
- Aplikasi mobile native (iOS/Android)

---

## 9. Team & Responsibilities

| Role | Nama | Tanggung Jawab Utama |
|---|---|---|
| Data Scientist | Muhammad Rafi Reshad F (DS-1) | EDA, Streamlit Dashboard, Explanatory Analysis |
| Data Scientist | Erna Listi Anggraeni (DS-2) | Data Quality, Wrangling, Feature Engineering, DS Deploy |
| AI Engineer | Darren Nathanael Melakha | Dual-model TF development, FastAPI microservice, A/B testing |
| Full-Stack Dev | Najla Khairunnisa (FS-1) | UI/UX Figma, React Frontend, Visualisasi, QA |
| Full-Stack Dev | Syafik Barda (FS-2) | Express.js Backend, MongoDB, API integration, Deploy |

---

## 10. Development Milestones

| Milestone | Tanggal |
|---|---|
| Project Plan selesai + Checkpoint 1 | 17 April 2025 |
| Wireframe & UI Mockup Figma selesai | 20 April 2025 |
| Dataset gathering & quality assessment | 24 April 2025 |
| React + Express.js boilerplate ready | 24 April 2025 |
| Data wrangling & cleaning selesai | 30 April 2025 |
| TF Multi-Input Model architecture ready | 5 Mei 2025 |
| EDA selesai | 9 Mei 2025 |
| Responsive UI (Dashboard + Form) selesai | 3 Mei 2025 |
| Custom Loss & Callback implemented | 11 Mei 2025 |
| FE ↔ BE Axios integration selesai | 11 Mei 2025 |
| Model training, eval, TensorBoard | 18 Mei 2025 |
| Laporan Kemajuan + Checkpoint 2 | 17 Mei 2025 |
| Streamlit Dashboard interaktif selesai | 22 Mei 2025 |
| FastAPI microservice ready | 27 Mei 2025 |
| BE → FastAPI networking call selesai | 30 Mei 2025 |
| Streamlit Cloud deploy | 30 Mei 2025 |
| A/B testing & model comparison | 23 Mei 2025 |
| End-to-end integration & QA | 2 Juni 2025 |
| Web deploy (Vercel/Netlify) | 4 Juni 2025 |
| Video presentasi + tutorial | 2 Juni 2025 |
| Final Project Brief deadline | 5 Juni 2025 |

---

## 11. Risk Analysis

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Ketergantungan input manual pengguna | Kualitas analisis rendah jika data sedikit | Sediakan opsi upload CSV + gunakan dataset Kaggle sebagai demo data |
| Latensi sinkronisasi real-time FE ↔ Express ↔ FastAPI | UX buruk jika inference lambat | Batasi scope inference ke on-submit (bukan real-time streaming), tambahkan loading state di UI |
| Ketergantungan API pihak ketiga | Downtime atau biaya tak terduga | Semua inference dilakukan on-premise via FastAPI, tidak bergantung pada API eksternal berbayar |
| Performa model di bawah target (< 85%) | Klasifikasi & prediksi tidak akurat | A/B testing 2 model (AI6), tuning hyperparameter, dan Custom Callback untuk early stopping otomatis |
| Konflik integrasi teknis antar stack | Delay timeline | Axios integration dilakukan di minggu ke-3 setelah BE dan FE masing-masing stabil, version control ketat di Git |
| Keamanan data finansial pengguna | Breach of trust | Tidak ada data perbankan nyata yang diproses; semua data adalah input manual/CSV lokal |

---

## 12. Success Metrics (MVP)

Aplikasi dianggap berhasil mencapai MVP jika:

1. ✅ User dapat mengupload CSV atau input transaksi manual dan data tersimpan di database.
2. ✅ Transaksi otomatis ter-klasifikasi ke kategori oleh AI Model 1 dengan accuracy ≥ 85%.
3. ✅ Dashboard menampilkan ringkasan pengeluaran per kategori dengan visualisasi chart.
4. ✅ Prediksi pengeluaran masa depan dari Model 2 (LSTM) tersedia dan ditampilkan.
5. ✅ Streamlit Dashboard ter-deploy dan dapat diakses secara publik.
6. ✅ Aplikasi web ter-deploy di Vercel/Netlify dan dapat diakses dari browser desktop & mobile.
7. ✅ FastAPI microservice berjalan dan terintegrasi end-to-end dengan frontend.

---

*Dokumen ini dibuat berdasarkan Project Plan CC26-PSU332 dan ditujukan sebagai konteks teknis untuk pengembangan sistem ArthaWise.*
