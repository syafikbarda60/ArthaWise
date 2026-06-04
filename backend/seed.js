require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Transaction = require("./src/models/Transaction");

const seedDatabase = async () => {
  await connectDB();
  console.log("Database connected. Clearing old transactions...");
  await Transaction.deleteMany({});

  const now = new Date();
  const transactions = [];

  // Generate smaller income 14 days ago (Gaji)
  const incomeDate = new Date(now);
  incomeDate.setDate(now.getDate() - 14);
  transactions.push({
    title: "Gaji Bulanan",
    amount: 5000000,
    type: "income",
    category: "Salary",
    date: incomeDate,
  });

  // Generate HIGH and unstable daily expenses
  // Pattern: Huge random spikes to trigger LSTM anomaly and negative cash flow
  for (let i = 14; i >= 0; i--) {
    const txDate = new Date(now);
    txDate.setDate(now.getDate() - i);

    // Daily food - expensive
    transactions.push({
      title: "Makan di Luar",
      amount: Math.floor(100000 + Math.random() * 50000), // 100k-150k
      type: "expense",
      category: "Food & Drink",
      date: txDate,
    });

    // Random massive anomaly spikes every few days
    if (Math.random() > 0.7) {
      transactions.push({
        title: "Belanja Impulsif",
        amount: Math.floor(800000 + Math.random() * 700000), // 800k - 1.5M
        type: "expense",
        category: "Shopping",
        date: txDate,
      });
    }
    
    if (Math.random() > 0.8) {
        transactions.push({
          title: "Party / Clubbing",
          amount: Math.floor(500000 + Math.random() * 500000), // 500k - 1M
          type: "expense",
          category: "Entertainment",
          date: txDate,
        });
      }

    // Bills
    if (i === 10) {
      transactions.push({
        title: "Listrik & Air",
        amount: 800000,
        type: "expense",
        category: "Utilities",
        date: txDate,
      });
      transactions.push({
        title: "Cicilan Pinjol",
        amount: 1500000,
        type: "expense",
        category: "Utilities",
        date: txDate,
      });
    }
  }

  console.log(`Inserting ${transactions.length} mock transactions for unstable finances...`);
  await Transaction.insertMany(transactions);
  console.log("Database seeded successfully!");
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
