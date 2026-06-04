const Transaction = require("../models/Transaction");
const { mockClassifyTransaction } = require("./aiController");

// GET /api/transactions
const getAllTransactions = async (req, res) => {
  try {
    const { type, category, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/transactions/summary
const getSummary = async (req, res) => {
  try {
    const allTx = await Transaction.find({});
    const totalIncome = allTx
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = allTx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, date } = req.body;
    let { category } = req.body;

    // Simulate AI categorization if category is not provided
    if (!category) {
      const aiResult = await mockClassifyTransaction(title, type, amount);
      const rawCategory = aiResult.category;

      // Map AI Indonesian labels → frontend category keys
      const categoryMap = {
        "Gaji":        "Salary",
        "Makan & Minum": "Food & Drink",
        "Belanja":     "Shopping",
        "Hiburan":     "Entertainment",
        "Tagihan":     "Utilities",
        "Goals":       "Investment",
      };
      category = categoryMap[rawCategory] || rawCategory;
    }

    const transaction = await Transaction.create({
      title,
      amount,
      category,
      type,
      date: date || new Date(),
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/transactions/upload
const uploadTransactions = async (req, res) => {
  try {
    // This is a mock endpoint for CSV upload (F-01). 
    // In a real app, we'd use multer to parse the CSV and insertMany.
    // For now, we'll just return a success message.
    res.status(200).json({ 
      success: true, 
      message: "CSV Uploaded successfully (Mocked)",
      data: { inserted: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getAllTransactions, 
  getSummary,
  getTransactionById,
  createTransaction, 
  updateTransaction,
  deleteTransaction,
  uploadTransactions
};
