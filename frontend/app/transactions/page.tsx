"use client";

import React, { useEffect, useState, useMemo } from "react";
import { transactionApi } from "@/lib/api";
import { Transaction } from "@/lib/types";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import AnimatedBackground from "@/components/AnimatedBackground";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileUpload, Add, FilterList, FileDownload } from "@mui/icons-material";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchTransactions = async () => {
    try {
      const txData = await transactionApi.getAll();
      setTransactions(txData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUploadCSV = () => {
    alert("Simulation: CSV file uploaded successfully! AI is now classifying your 50+ transactions...");
  };

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const lowerQuery = searchQuery.toLowerCase();
    return transactions.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      t.category.toLowerCase().includes(lowerQuery) ||
      t.type.toLowerCase().includes(lowerQuery)
    );
  }, [transactions, searchQuery]);

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-gray-200">
      <AnimatedBackground />
      <Sidebar activeHref="/transactions" />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-6 lg:p-10 ml-0 md:ml-64 transition-all duration-300">
        <header className="flex justify-between items-center mb-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-2xl font-bold text-white tracking-tight">Buku Kas & Catatan</h1>
            <p className="text-sm text-zinc-500 mt-1">Manajemen data keuangan Anda dengan presisi</p>
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <button 
              onClick={handleUploadCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/50 text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-800 hover:text-white transition-all border border-white/5 shadow-sm group"
            >
              <FileUpload style={{ fontSize: 16 }} className="group-hover:-translate-y-0.5 transition-transform" />
              Import CSV
            </button>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 group"
            >
              <Add style={{ fontSize: 18 }} className={showForm ? "rotate-45 transition-transform" : "transition-transform"} />
              {showForm ? "Tutup Form" : "Tambah Baru"}
            </button>
          </motion.div>
        </header>
        
        <div className="flex-1 overflow-y-auto pr-2 pb-10 customized-scrollbar">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <AnimatePresence>
              {showForm && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:col-span-12 overflow-hidden"
                >
                  <div className="vui-card p-6 mb-8 border-brand-blue/20">
                    <TransactionForm onSuccess={() => {
                      fetchTransactions();
                      setShowForm(false);
                    }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-12 vui-card overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold text-white">Riwayat Transaksi</h3>
                  <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-black rounded uppercase tracking-widest border border-white/5">
                    {filteredTransactions.length} item
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search style={{ fontSize: 16 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Cari transaksi..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="vui-input py-2.5 pl-10 text-sm w-full bg-zinc-900/30 border-white/5 focus:border-brand-blue/50"
                    />
                  </div>
                  <button className="p-2.5 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-colors">
                    <FilterList style={{ fontSize: 18 }} />
                  </button>
                  <button className="p-2.5 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-colors">
                    <FileDownload style={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>
              
              <div className="p-2">
                <TransactionList transactions={filteredTransactions} onTransactionDeleted={fetchTransactions} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
