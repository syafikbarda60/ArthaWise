# ArthaWise 🚀

> A modern, AI-powered personal finance management platform built with Next.js, Express, FastAPI, and MongoDB.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)

## Features

### For Personal Finance Management

- **Transaction Tracking**: Log your daily income and expenses easily.
- **Interactive Dashboard**: Visualize your financial data with animated Pie Charts and Bar Charts.
- **Detailed Reports**: View deep insights and actionable steps for your financial health.
- **Offline Support**: Local storage caching ensures your dashboard is always accessible even without internet or database access.

### AI-Powered Intelligence

- **Smart Categorization**: Automatically classify transactions into categories using our Machine Learning model.
- **1-Day Forecasting**: Predict your upcoming expense for tomorrow utilizing Long Short-Term Memory (LSTM) neural networks.
- **Financial Profiling**: Automatically determine your financial persona (e.g., "Penabung Seimbang") based on your spending habits.
- **Smart Fallback**: Rule-based fallback systems ensure continuous operation even if the AI service goes down.

### Technical Highlights

- **Microservices Architecture**: Clean separation between Frontend (Next.js), Backend API (Express), and AI Service (FastAPI).
- **Responsive Design**: Mobile-first, premium dynamic UI with smooth Framer Motion animations.
- **Type-Safe API**: TypeScript interfaces ensuring robust communication across the stack.

## Dokumentasi Visual (Screenshots)

*Tangkapan layar hasil pengembangan produk ArthaWise.*

| Halaman Landing | Dashboard |
|---|---|
| ![Landing Page](https://placehold.co/600x400/1e293b/06b6d4?text=Upload+Screenshot+Landing) | ![Dashboard](https://placehold.co/600x400/1e293b/06b6d4?text=Upload+Screenshot+Dashboard) |

| Transaksi | AI Insights |
|---|---|
| ![Transaksi](https://placehold.co/600x400/1e293b/06b6d4?text=Upload+Screenshot+Transaksi) | ![AI Insights](https://placehold.co/600x400/1e293b/06b6d4?text=Upload+Screenshot+Analytics) |

> **Catatan Implementasi UI/UX**: Desain di atas menggunakan pendekatan *Dark Mode* modern dengan *Glassmorphism* dan aksen *brand-cyan* untuk memberikan nuansa premium dan futuristik (Sesuai dengan target audiens generasi muda).

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + Vanilla CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend (Main API)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Role**: Handles transaction CRUD, summary logic, and acts as an API Gateway to the AI Service.

### AI Service (Machine Learning)

- **Framework**: FastAPI (Python)
- **Deep Learning**: TensorFlow / Keras (LSTM & Neural Networks)
- **Data Processing**: Scikit-Learn, NumPy, Pandas
- **Role**: Hosts pre-trained `.keras` and `.pkl` models for real-time inference.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017)

## Tautan Model ML (Machine Learning Models)

To run the AI features locally, you must download the pre-trained models from the Google Drive link below and place them in the `saved_models/` directory at the root of the project.

- **Google Drive Link**: [Download ML Models Here](https://drive.google.com/drive/folders/1srmlzFGPbiXzEXEdMWUkrM72_FmX0qsL?usp=sharing)

Ensure that the project team (`capstone@student.devacademy.id`) has access to this folder.

## Setup Environment & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/arthawise.git
cd arthawise
```

### 2. Run MongoDB

Ensure your local MongoDB instance is running on port `27017`.

### 3. Setup AI Service (Python)

```bash
cd ai_service
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000
```
*Wait for the "All models loaded successfully!" message.*

### 4. Setup Backend (Node.js)

Open a new terminal window:

```bash
cd backend
npm install
npm run dev:watch
```
*The backend will run on port 5001.*

### 5. Setup Frontend (Next.js)

Open another terminal window:

```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on port 3000.*

## Cara Menjalankan Aplikasi (Running the Application)

Once all three services (MongoDB, FastAPI, Express) are running and the ML models are placed in the `saved_models/` directory, open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
arthawise/
├── ai_service/         # Python Microservice for AI Inference
│   ├── main.py         # FastAPI Entrypoint
│   └── requirements.txt
├── backend/            # Node.js Backend (Express & MongoDB)
│   ├── src/
│   │   ├── controllers/# Business logic
│   │   ├── models/     # Mongoose schemas
│   │   └── routes/     # Express routes
│   └── server.js
├── frontend/           # Next.js Application
│   ├── app/            # Next.js App Router (pages)
│   ├── components/     # Reusable React components (UI, Charts)
│   └── lib/            # Utilities & Axios API Client
└── saved_models/       # Pre-trained ML Models
    ├── classifier_model.keras
    ├── forecasting_model.keras
    ├── label_encoder.pkl
    ├── scaler_classifier.pkl
    └── scaler_forecast.pkl
```

## API Endpoints

### Transactions (Node.js Backend)

- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create a new transaction (auto-categorized)
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/summary` - Get total income, expenses, and balance

### AI Insights (FastAPI via Node.js Proxy)

- `GET /api/ai/forecast` - Get 1-day expense predictions
- `GET /api/ai/profile` - Get dynamic financial personality profiling

## Contributing

1. Clone the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---
*Built for the DBS Foundation Capstone Project.*
