"use client";

import React, { useEffect, useState, useMemo } from "react";
import { transactionApi, aiApi } from "@/lib/api";
import { Transaction, TransactionSummary, ForecastDataPoint, FinancialProfile } from "@/lib/types";
import DashboardCharts from "@/components/DashboardCharts";
import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import AnimatedBackground from "@/components/AnimatedBackground";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Psychology, Notifications, Settings, ChevronRight } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 140, damping: 20 },
  },
};

export default function Home() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [globalSummary, setGlobalSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [forecast, setForecast] = useState<ForecastDataPoint[]>([]);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [timeFilter, setTimeFilter] = useState<'Hari Ini' | 'Minggu' | 'Bulan' | 'Tahun'>('Bulan');
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("Pengguna Artha");
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [txData, summaryData, fRes, pData] = await Promise.all([
        transactionApi.getAll(),
        transactionApi.getSummary(),
        aiApi.getForecast(),
        aiApi.getFinancialProfile()
      ]);
      
      setAllTransactions(txData);
      setGlobalSummary(summaryData);
      setForecast(fRes.data);
      setProfile(pData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }
      const user = localStorage.getItem("auth_user");
      if (user) {
        setUserName(JSON.parse(user).name);
      }
    };

    if (typeof window !== "undefined") {
      checkUser();
      window.addEventListener("storage", checkUser);
    }
    fetchData();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", checkUser);
      }
    };
  }, [router]);

  // FilterList logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return allTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      const diffTime = Math.abs(now.getTime() - txDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeFilter === 'Hari Ini') return diffDays <= 1;
      if (timeFilter === 'Minggu') return diffDays <= 7;
      if (timeFilter === 'Bulan') return diffDays <= 30;
      if (timeFilter === 'Tahun') return diffDays <= 365;
      return true;
    });
  }, [allTransactions, timeFilter]);

  const filteredSummary = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [filteredTransactions]);

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-gray-200">
      <AnimatedBackground />
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-4 pt-20 pb-20 lg:p-10 lg:pt-10 lg:pb-10 ml-0 md:ml-64 transition-all duration-300">
        {/* Top Header Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 lg:mb-10">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-8 w-full lg:w-auto"
          >
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight shrink-0">Ringkasan Keuangan</h1>
            <div className="w-full overflow-x-auto no-scrollbar pb-1">
              <nav className="flex p-1 bg-zinc-900/50 rounded-xl border border-white/5 relative w-max">
                {(['Hari Ini', 'Minggu', 'Bulan', 'Tahun'] as const).map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setTimeFilter(tab)}
                  className={`relative px-3 lg:px-5 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors duration-200 ${
                    timeFilter === tab 
                      ? 'text-white' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {timeFilter === tab && (
                    <motion.div
                      layoutId="dashTab"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="absolute inset-0 bg-brand-blue rounded-lg shadow-lg shadow-blue-500/20"
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
              </nav>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:flex items-center space-x-4 shrink-0"
          >
            <div className="flex space-x-2">
              {/* Notifications and Settings removed */}
            </div>
            <div className="h-10 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center space-x-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">{userName}</p>
                {/* <p className="text-[10px] text-brand-cyan uppercase tracking-widest font-bold mt-1">Premium</p> */}
              </div>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`} alt="Avatar" className="w-10 h-10 rounded-xl ring-2 ring-brand-blue/20" />
            </div>
          </motion.div>
        </header>
        
        <div className="flex-1 overflow-y-auto pr-2 md:pb-10 customized-scrollbar">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* KPI Cards */}
            <motion.div variants={itemVariants}>
              <SummaryCards summary={filteredSummary} transactions={filteredTransactions} />
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Charts */}
              <motion.div variants={itemVariants} className="xl:col-span-2 space-y-8">
                <DashboardCharts transactions={filteredTransactions} summary={filteredSummary} />
                <TransactionList transactions={filteredTransactions} onTransactionDeleted={fetchData} enablePagination={true} limit={5} />
              </motion.div>

              {/* Sidebar AI Insights */}
              <motion.div variants={itemVariants} className="space-y-8">
                {/* AI Profile Card */}
                <div className="vui-card p-6 border-l-4 border-l-brand-purple">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                      <Psychology style={{ fontSize: 24 }} />
                    </div>
                    <span className="text-[10px] font-bold text-brand-purple uppercase tracking-tighter px-2 py-1 bg-brand-purple/5 rounded-md">AI Profile</span>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">Karakter Finansial</h3>
                  <div className="text-xl font-bold text-white mb-4">{profile?.cluster || "Menganalisis..."}</div>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    {profile?.description || "AI kami sedang menganalisis pola pengeluaran Anda untuk mengkategorikan perilaku finansial Anda."}
                  </p>
                  <Link href="/analytics" className="w-full py-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl border border-white/5 text-sm font-medium transition-all flex items-center justify-center gap-2 group">
                    Lihat Detail
                    <ChevronRight style={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Forecast Sparkline Card Pro Max */}
                <div className="vui-card relative overflow-hidden group p-1">
                  {/* Animated border gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 via-transparent to-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative bg-[#09090b]/80 backdrop-blur-xl rounded-[22px] p-6 h-full border border-white/5">
                    <div className="absolute top-0 right-0 p-8 text-brand-cyan/5 group-hover:text-brand-cyan/10 transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                      <TrendingUp style={{ fontSize: 100 }} />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-shadow">
                          <TrendingUp style={{ fontSize: 24 }} />
                        </div>
                        <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest px-3 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.1)]">LSTM AI Forecast</span>
                      </div>
                      
                      <h3 className="text-sm font-medium text-zinc-400 mb-1">Estimasi Pengeluaran 7 Hari</h3>
                      <div className="text-3xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-blue drop-shadow-sm">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(forecast.reduce((acc, f) => acc + f.predicted_expense, 0))}
                      </div>
                      
                      {/* Premium Sparkline */}
                      {(() => {
                        const maxVal = forecast.length > 0 ? Math.max(...forecast.map(f => f.predicted_expense)) : 1;
                        return (
                          <div className="mt-4">
                            <div className="flex items-end justify-between gap-2 h-24 relative">
                              {/* Grid lines */}
                              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                <div className="w-full h-px border-t border-dashed border-zinc-600" />
                                <div className="w-full h-px border-t border-dashed border-zinc-600" />
                                <div className="w-full h-px border-t border-dashed border-zinc-600" />
                              </div>

                              {forecast.length > 0 ? forecast.map((f, i) => {
                                const heightPct = maxVal > 0 ? (f.predicted_expense / maxVal) * 100 : 10;
                                const dayName = new Date(f.date).toLocaleDateString('id-ID', { weekday: 'short' });
                                return (
                                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar cursor-pointer z-10 relative">
                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded transition-opacity shadow-xl whitespace-nowrap pointer-events-none border border-white/10 z-20">
                                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(f.predicted_expense)}
                                    </div>
                                    {/* Bar */}
                                    <div className="w-full h-full flex items-end justify-center">
                                      <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(heightPct, 10)}%` }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.1 + i * 0.05 }}
                                        className="w-full max-w-[24px] bg-gradient-to-t from-brand-cyan/20 to-brand-cyan/60 rounded-t-lg relative overflow-hidden group-hover/bar:from-brand-cyan/40 group-hover/bar:to-brand-cyan border-t border-brand-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0)] group-hover/bar:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                      </motion.div>
                                    </div>
                                    {/* Day label */}
                                    <span className="text-[9px] font-black uppercase text-zinc-500 group-hover/bar:text-brand-cyan transition-colors">{dayName}</span>
                                  </div>
                                );
                              }) : (
                                // Placeholder skeleton
                                [25, 45, 30, 65, 40, 75, 50].map((h, i) => (
                                  <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10">
                                    <div className="w-full h-full flex items-end justify-center">
                                      <div className="w-full max-w-[24px] bg-zinc-800/50 rounded-t-lg animate-pulse" style={{ height: `${h}%` }} />
                                    </div>
                                    <div className="w-6 h-2 bg-zinc-800/50 rounded animate-pulse" />
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
