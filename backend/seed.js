require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Transaction = require("./src/models/Transaction");
const User = require("./src/models/User");

const seedDatabase = async () => {
  await connectDB();
  
  const users = await User.find();
  if (users.length === 0) {
    console.error("Tidak ada user ditemukan. Silakan register akun terlebih dahulu di frontend.");
    process.exit(1);
  }

  for (const user of users) {
    console.log(`Clearing old transactions for user: ${user.name} (${user.email})...`);
    await Transaction.deleteMany({ userId: user._id });
    
    const transactions = [];

    // Gaji Awal Bulan (1 Mei 2026)
    transactions.push({
      userId: user._id,
      title: "Gaji Bulanan",
      amount: 8000000 + Math.floor(Math.random() * 2000000), // 8 - 10 juta
      type: "income",
      category: "Salary",
      date: new Date('2026-05-01T08:00:00Z'),
    });

    // Generate transaksi acak untuk 1 Mei - 31 Mei 2026 (31 Hari)
    // Minimal 150 data -> ~5 transaksi per hari
    for (let day = 1; day <= 31; day++) {
      const dailyTransactions = Math.floor(Math.random() * 3) + 4; // 4 to 6 trx per day
      
      for (let j = 0; j < dailyTransactions; j++) {
        const txDate = new Date(`2026-05-${day.toString().padStart(2, '0')}T${(10 + j).toString().padStart(2, '0')}:30:00Z`);

        // Makan Pagi/Siang/Malam
        if (j < 3) {
          transactions.push({
            userId: user._id,
            title: ["Makan Siang", "Kopi Pagi", "Makan Malam", "Cemilan", "GoFood"][Math.floor(Math.random() * 5)],
            amount: Math.floor(20000 + Math.random() * 80000), 
            type: "expense",
            category: "Food & Drink",
            date: txDate,
          });
        }
        // Transport
        else if (j === 3) {
          transactions.push({
            userId: user._id,
            title: ["Bensin", "Gojek", "Grab", "Tol", "Parkir"][Math.floor(Math.random() * 5)],
            amount: Math.floor(10000 + Math.random() * 50000),
            type: "expense",
            category: "Transport",
            date: txDate,
          });
        }
        // Belanja atau Hiburan
        else {
          const isShopping = Math.random() > 0.5;
          transactions.push({
            userId: user._id,
            title: isShopping ? "Belanja Online / Minimarket" : "Hiburan / Langganan",
            amount: Math.floor(50000 + Math.random() * 300000),
            type: "expense",
            category: isShopping ? "Shopping" : "Entertainment",
            date: txDate,
          });
        }
      }

      // Tagihan (hanya di tanggal tertentu)
      if (day === 5) {
        transactions.push({
          userId: user._id,
          title: "Listrik & Air",
          amount: 600000,
          type: "expense",
          category: "Utilities",
          date: new Date('2026-05-05T09:00:00Z'),
        });
      }
      if (day === 15) {
        transactions.push({
          userId: user._id,
          title: "Cicilan",
          amount: 1500000,
          type: "expense",
          category: "Utilities",
          date: new Date('2026-05-15T09:00:00Z'),
        });
      }
    }

    console.log(`Inserting ${transactions.length} mock transactions for May 2026 for ${user.name}...`);
    await Transaction.insertMany(transactions);
  }

  console.log("Database seeded successfully!");
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
