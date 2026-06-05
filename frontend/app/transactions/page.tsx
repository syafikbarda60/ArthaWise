"use client";

import React, { useEffect, useState, useMemo } from "react";
import { transactionApi } from "@/lib/api";
import { Transaction } from "@/lib/types";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import AnimatedBackground from "@/components/AnimatedBackground";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, FileUpload, Add, FilterList, FileDownload } from "@mui/icons-material";
import { cn } from "@/lib/utils";

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
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const router = useRouter();

  const fetchTransactions = async () => {
    try {
      const txData = await transactionApi.getAll();
      setTransactions(txData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }
    }
    fetchTransactions();
  }, [router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim() !== '');
        
        // Skip header line if present (e.g., if first line contains 'title' or 'amount')
        const startIndex = lines[0].toLowerCase().includes('amount') ? 1 : 0;
        
        let successCount = 0;
        for (let i = startIndex; i < lines.length; i++) {
          // Expected format: title, amount, type, category, date
          // e.g., "Gaji dari Client", 5000000, income, Freelance, 2026-05-10
          const parts = lines[i].split(',').map(p => p.trim());
          if (parts.length >= 4) {
            const tx = {
              title: parts[0],
              amount: Number(parts[1]),
              type: parts[2].toLowerCase() === 'income' ? 'income' : 'expense',
              category: parts[3] || 'Other',
              date: parts[4] ? new Date(parts[4]).toISOString() : new Date().toISOString()
            };
            await transactionApi.create(tx);
            successCount++;
          }
        }
        
        alert(`Berhasil mengimpor ${successCount} transaksi dari CSV!`);
        fetchTransactions();
      } catch (err) {
        alert("Gagal mengimpor CSV. Pastikan formatnya benar: title,amount,type,category,date");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadCSV = () => {
    fileInputRef.current?.click();
  };

  const toggleFilter = () => {
    setFilterType(prev => prev === "all" ? "income" : prev === "income" ? "expense" : "all");
  };

  const handleDownloadDocx = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } = await import("docx");
      const { saveAs } = await import("file-saver");
      
      const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

      const tableRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tanggal", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Deskripsi", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Kategori", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tipe", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Jumlah", bold: true })] })] }),
          ],
        }),
        ...filteredTransactions.map(t => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(new Date(t.date).toLocaleDateString('id-ID'))] }),
            new TableCell({ children: [new Paragraph(t.title)] }),
            new TableCell({ children: [new Paragraph(t.category)] }),
            new TableCell({ children: [new Paragraph(t.type === 'income' ? 'Pemasukan' : 'Pengeluaran')] }),
            new TableCell({ children: [new Paragraph(formatRupiah(t.amount))] }),
          ],
        }))
      ];

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Laporan Keuangan ArthaWise", bold: true, size: 32 }),
                ],
                spacing: { after: 200 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: tableRows,
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "Laporan_Keuangan_ArthaWise.docx");
    } catch (e) {
      console.error(e);
      alert("Gagal mengunduh laporan DOCX");
    }
  };

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    if (filterType !== "all") {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    
    if (filterMonth) {
      filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        const yyyy_mm = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
        return yyyy_mm === filterMonth;
      });
    }

    if (filterDate) {
      filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        const yyyy_mm_dd = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}-${String(tDate.getDate()).padStart(2, '0')}`;
        return yyyy_mm_dd === filterDate;
      });
    }

    if (!searchQuery.trim()) return filtered;
    
    const lowerQuery = searchQuery.toLowerCase();
    return filtered.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      t.category.toLowerCase().includes(lowerQuery) ||
      t.type.toLowerCase().includes(lowerQuery)
    );
  }, [transactions, searchQuery, filterType, filterCategory, filterMonth, filterDate]);

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-gray-200">
      <AnimatedBackground />
      <Sidebar activeHref="/transactions" />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-4 pt-20 pb-20 lg:p-10 lg:pt-10 lg:pb-10 ml-0 md:ml-64 transition-all duration-300">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 lg:mb-10">
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
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
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
        
        <div className="flex-1 overflow-y-auto pr-2 pb-6 md:pb-10 customized-scrollbar">
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
                      className="vui-input py-2.5 text-sm w-full bg-zinc-900/30 border-white/5 focus:border-brand-blue/50"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      title="Filter Transaksi"
                      className={cn(
                        "p-2.5 rounded-xl border transition-colors flex items-center gap-2",
                        (filterType !== "all" || filterCategory !== "all") ? "bg-brand-blue/10 border-brand-blue/30 text-brand-blue" : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-white"
                      )}
                    >
                      <FilterList style={{ fontSize: 18 }} />
                      <span className="text-xs font-bold hidden sm:inline-block">Filter</span>
                    </button>
                    <AnimatePresence>
                      {showFilterMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-64 p-4 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 flex flex-col gap-4"
                        >
                          <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Tipe</label>
                            <div className="flex bg-zinc-950 rounded-lg p-1 gap-1">
                              {["all", "income", "expense"].map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setFilterType(t as any)}
                                  className={cn(
                                    "flex-1 text-xs font-bold py-1.5 rounded-md transition-colors",
                                    filterType === t ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"
                                  )}
                                >
                                  {t === "all" ? "Semua" : t === "income" ? "Masuk" : "Keluar"}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Kategori</label>
                            <select 
                              value={filterCategory} 
                              onChange={e => setFilterCategory(e.target.value)}
                              className="w-full bg-zinc-950 border border-white/10 rounded-lg p-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-brand-blue/50"
                            >
                              <option value="all">Semua Kategori</option>
                              <option value="Food & Drink">Makanan & Minuman</option>
                              <option value="Transport">Transportasi</option>
                              <option value="Shopping">Belanja</option>
                              <option value="Entertainment">Hiburan</option>
                              <option value="Health">Kesehatan</option>
                              <option value="Utilities">Utilitas</option>
                              <option value="Salary">Gaji</option>
                              <option value="Freelance">Freelance</option>
                              <option value="Investment">Investasi</option>
                              <option value="Other">Lainnya</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Bulan</label>
                            <div className="flex gap-2">
                              <input 
                                type="month" 
                                value={filterMonth} 
                                onChange={e => { setFilterMonth(e.target.value); setFilterDate(""); }}
                                className="w-full bg-zinc-950 border border-white/10 rounded-lg p-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-brand-blue/50 [color-scheme:dark]"
                              />
                              {filterMonth && (
                                <button onClick={() => setFilterMonth("")} className="text-xs text-brand-red px-2">X</button>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Tanggal Spesifik</label>
                            <div className="flex gap-2">
                              <input 
                                type="date" 
                                value={filterDate} 
                                onChange={e => { setFilterDate(e.target.value); setFilterMonth(""); }}
                                className="w-full bg-zinc-950 border border-white/10 rounded-lg p-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-brand-blue/50 [color-scheme:dark]"
                              />
                              {filterDate && (
                                <button onClick={() => setFilterDate("")} className="text-xs text-brand-red px-2">X</button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button 
                    onClick={handleDownloadDocx} 
                    title="Download DOCX"
                    className="p-2.5 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-colors"
                  >
                    <FileDownload style={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>
              
              <div className="p-2">
                <TransactionList 
                  transactions={filteredTransactions} 
                  onTransactionDeleted={fetchTransactions}
                  enablePagination={true}
                  limit={10}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
