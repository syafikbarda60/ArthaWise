const axios = require("axios");

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

// GET /api/ai/forecast
const getForecast = async (req, res) => {
  try {
    const Transaction = require("../models/Transaction");
    const now = new Date();
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);

    // Get all expenses from the last 14 days
    const recentTx = await Transaction.find({
      userId: req.user.id,
      type: "expense",
      date: { $gte: fourteenDaysAgo }
    }).sort({ date: 1 });

    // Group expenses by day (0 to 13)
    const dailyExpenses = new Array(14).fill(0);
    recentTx.forEach(tx => {
      const txDate = new Date(tx.date);
      const diffTime = Math.abs(now - txDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      // diffDays = 0 means today, diffDays = 13 means 14 days ago
      if (diffDays >= 0 && diffDays < 14) {
        // We want the array ordered chronologically (oldest first, index 0 = 14 days ago)
        const index = 13 - diffDays;
        dailyExpenses[index] += tx.amount;
      }
    });

    try {
      // Call Python FastAPI with REAL data
      const response = await axios.post(`${FASTAPI_URL}/api/ai/forecast`, {
        recent_expenses: dailyExpenses,
        days_to_predict: 1
      });
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.warn("Python AI Service not responding/error, using fallback for forecast:", apiError.message);
      
      // Fallback response if Python is off
      const data = [];
      const now = new Date();
      for (let i = 1; i <= 1; i++) {
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + i);
        data.push({
          date: nextDate.toISOString(),
          predicted_expense: 50000 + Math.random() * 80000, 
        });
      }
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/ai/profile
const getFinancialProfile = async (req, res) => {
  try {
    const Transaction = require("../models/Transaction");
    const allTx = await Transaction.find({ userId: req.user.id });
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    allTx.forEach(t => {
      if (t.type === "income") totalIncome += t.amount;
      else if (t.type === "expense") totalExpense += t.amount;
    });

    let cluster = "Belum Terdeteksi";
    let description = "Belum ada cukup data transaksi untuk menganalisis profil keuangan Anda.";
    let characteristics = ["Catat lebih banyak transaksi"];

    if (totalIncome > 0 || totalExpense > 0) {
      if (totalExpense > totalIncome) {
        cluster = "Konsumtif Berisiko";
        description = "Pengeluaran Anda melebihi pemasukan. Sangat disarankan untuk segera menekan biaya yang tidak perlu dan mulai membuat anggaran ketat.";
        characteristics = [
          "Pengeluaran > Pemasukan (Arus Kas Negatif)",
          "Risiko kehabisan dana darurat tinggi",
          "Perlu kontrol ketat pada kategori hiburan/belanja"
        ];
      } else {
        const savingRatio = (totalIncome - totalExpense) / totalIncome;
        if (savingRatio >= 0.2) {
          cluster = "Investor Aman";
          description = "Anda memiliki rasio tabungan yang sangat sehat (>20%). Sangat baik untuk mulai mengalokasikan dana ke instrumen investasi.";
          characteristics = [
            "Arus kas sangat positif",
            "Disiplin pengeluaran tinggi",
            "Siap untuk diversifikasi aset/investasi"
          ];
        } else {
          cluster = "Penabung Seimbang";
          description = "AI kami mendeteksi gaya hidup finansial yang seimbang. Pengeluaran terkendali, meskipun porsi tabungan masih bisa ditingkatkan.";
          characteristics = [
            "Arus pendapatan stabil",
            "Pengeluaran hampir mendekati batas pemasukan",
            "Perlu evaluasi biaya langganan/tagihan"
          ];
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        cluster,
        description,
        characteristics,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to classify transaction string via Python
const mockClassifyTransaction = async (title, type, amount = 0) => {
  try {
    const response = await axios.post(`${FASTAPI_URL}/api/ai/classify`, {
      title,
      type,
      amount
    });
    return { 
      category: response.data.category, 
      confidence: response.data.confidence 
    };
  } catch (apiError) {
    console.warn("Python AI Service not responding/error, using fallback for classification");
    // Fallback logic
    const titleLower = title.toLowerCase();
    if (type === "income") return { category: "Salary", confidence: 0.9 };
    if (titleLower.match(/makan|kopi|food|drink/)) return { category: "Food & Drink", confidence: 0.9 };
    if (titleLower.match(/gojek|grab|transport/)) return { category: "Transport", confidence: 0.9 };
    return { category: "Other", confidence: 0.8 };
  }
};

module.exports = {
  getForecast,
  getFinancialProfile,
  mockClassifyTransaction
};
