"use client";

import React, { useEffect, useState, useMemo } from "react";
import { transactionApi, aiApi } from "@/lib/api";
import { Transaction, FinancialProfile } from "@/lib/types";
import AnimatedBackground from "@/components/AnimatedBackground";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Warning,
  Lightbulb,
  ArrowForward,
  TrendingDown,
  ShowChart
} from "@mui/icons-material";
import { cn } from "@/lib/utils";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function ReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, pData] = await Promise.all([
          transactionApi.getAll(),
          aiApi.getFinancialProfile()
        ]);
        setTransactions(txData);
        setProfile(pData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const totalExpense = useMemo(() => expensesByCategory.reduce((acc, [, val]) => acc + val, 0), [expensesByCategory]);
  
  const generateActionPlan = () => {
    if (!profile) return [];
    
    if (profile.cluster === "Konsumtif Berisiko") {
      const topCategory = expensesByCategory.length > 0 ? expensesByCategory[0][0] : "";
      return [
        {
          title: "Hentikan Pengeluaran Impulsif",
          desc: `Kami mendeteksi pengeluaran terbesar Anda ada di kategori ${topCategory}. Kurangi pengeluaran ini minimal 50% di minggu depan.`,
          icon: <Warning style={{ fontSize: 18 }} className="text-brand-red" />,
          color: "red"
        },
        {
          title: "Tinjau Ulang Langganan / Cicilan",
          desc: "Beban tetap Anda saat ini terlalu tinggi dibandingkan pemasukan. Buat daftar tagihan wajib dan hapus yang tidak mendesak.",
          icon: <TrendingDown style={{ fontSize: 18 }} className="text-brand-red" />,
          color: "red"
        },
        {
          title: "Gunakan Aturan 50/30/20",
          desc: "Mulai besok, batasi kebutuhan pokok 50%, keinginan 30%, dan tabung 20% sejak awal gajian.",
          icon: <Lightbulb style={{ fontSize: 18 }} className="text-brand-cyan" />,
          color: "cyan"
        }
      ];
    } else if (profile.cluster === "Investor Aman") {
      return [
        {
          title: "Mulai Diversifikasi Aset",
          desc: "Karena rasio tabungan Anda sangat sehat, pertimbangkan untuk memindahkan dana ke instrumen reksadana atau saham untuk melawan inflasi.",
          icon: <ShowChart style={{ fontSize: 18 }} className="text-brand-green" />,
          color: "green"
        },
        {
          title: "Pertahankan Gaya Hidup",
          desc: "Anda sudah melakukan manajemen arus kas yang sangat baik. Hindari inflasi gaya hidup meskipun pemasukan bertambah.",
          icon: <Lightbulb style={{ fontSize: 18 }} className="text-brand-cyan" />,
          color: "cyan"
        }
      ];
    } else {
      return [
        {
          title: "Tingkatkan Porsi Tabungan",
          desc: "Keuangan Anda stabil, namun masih bisa dioptimalkan. Coba sisihkan ekstra 5-10% dari gaji bulan depan ke rekening terpisah.",
          icon: <TrendingDown style={{ fontSize: 18 }} className="text-brand-blue" />,
          color: "blue"
        },
        {
          title: "Pantau Biaya Hiburan",
          desc: "Tetap pastikan pengeluaran akhir pekan tidak merusak batas anggaran mingguan yang sudah ditetapkan AI.",
          icon: <Warning style={{ fontSize: 18 }} className="text-brand-cyan" />,
          color: "cyan"
        }
      ];
    }
  };

  const actionPlan = generateActionPlan();

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-gray-200">
      <AnimatedBackground />
      <Sidebar activeHref="/report" />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-6 lg:p-10 ml-0 md:ml-64 transition-all duration-300">
        <header className="flex justify-between items-center mb-10">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Laporan & Tindakan <span className="text-[10px] bg-brand-purple/20 text-brand-purple px-2 py-1 rounded-md uppercase tracking-widest font-black">Report</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Evaluasi mendalam dan langkah perbaikan finansial</p>
          </motion.div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 pb-24 md:pb-10 customized-scrollbar">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-8 h-8 border-2 border-t-brand-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                <p className="text-sm text-zinc-500">Menganalisis laporan...</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Spending Breakdown */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-5 space-y-6"
                >
                  <div className="vui-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 text-brand-blue">
                        <PieChart style={{ fontSize: 24 }} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Detail Distribusi</h3>
                        <div className="text-2xl font-bold text-white tracking-tight">{formatRupiah(totalExpense)}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {expensesByCategory.map(([category, amount], idx) => {
                        const pct = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                        return (
                          <div key={category} className="group">
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{category}</span>
                              <div className="flex gap-3 text-zinc-500">
                                <span>{formatRupiah(amount)}</span>
                                <span className="font-black text-white w-10 text-right">{pct.toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand-blue rounded-full transition-all duration-1000"
                                style={{ width: `${pct}%`, transitionDelay: `${idx * 100}ms` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      {expensesByCategory.length === 0 && (
                        <p className="text-sm text-zinc-500 text-center py-4">Belum ada data pengeluaran.</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Right Column: AI Action Plan */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-7 space-y-6"
                >
                  <div className="vui-card p-8 border-t-4 border-brand-purple">
                    <div className="mb-8">
                      <h3 className="text-xs font-bold text-brand-purple uppercase tracking-widest mb-2">Rekomendasi AI</h3>
                      <h2 className="text-2xl font-bold text-white">Langkah Tindakan (Action Plan)</h2>
                      <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                        Berdasarkan profil <strong>{profile?.cluster}</strong>, AI kami menyarankan langkah-langkah prioritas berikut untuk menyehatkan keuangan Anda.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {actionPlan.map((action, i) => (
                        <div key={i} className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5 hover:bg-zinc-800/80 transition-all flex gap-4 items-start group">
                          <div className={cn(
                            "p-3 rounded-xl shrink-0 mt-1",
                            action.color === "red" && "bg-brand-red/10 border border-brand-red/20",
                            action.color === "green" && "bg-brand-green/10 border border-brand-green/20",
                            action.color === "cyan" && "bg-brand-cyan/10 border border-brand-cyan/20",
                            action.color === "blue" && "bg-brand-blue/10 border border-brand-blue/20"
                          )}>
                            {action.icon}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">{action.title}</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                              {action.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                       <button className="flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-white transition-colors">
                         Simpan sebagai PDF <ArrowForward style={{ fontSize: 16 }} />
                       </button>
                    </div>
                  </div>
                </motion.div>

              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
