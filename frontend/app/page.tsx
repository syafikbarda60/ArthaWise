"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { transactionApi } from "@/lib/api";
import { Transaction, TransactionSummary } from "@/lib/types";

const DEFAULT_SUMMARY: TransactionSummary = { totalIncome: 0, totalExpense: 0, balance: 0 };

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await transactionApi.getAll({ limit: 10 });
      setTransactions(res.data);
      if (res.summary) setSummary(res.summary);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="relative min-h-screen">
      <Sidebar activeHref="/" />

      {/* Main canvas */}
      <main className="md:ml-64 min-h-screen flex flex-col p-4 md:p-8 pt-8">
        
        {/* ── Top Bar ── */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center text-[#A0AEC0] text-xs gap-1 mb-1 font-medium">
               <span className="material-symbols-outlined text-[14px]">home</span>
               <span>/ Dashboard</span>
            </div>
            <h2 className="font-bold text-white text-lg tracking-tight">Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">search</span>
                <input type="text" placeholder="Type here..." className="bg-[#0F1535] border border-[rgba(255,255,255,0.1)] rounded-[15px] py-2 pl-9 pr-4 text-xs text-white placeholder-white/50 w-48 focus:outline-none focus:border-[#0075FF]" />
             </div>
             <div className="flex items-center gap-2 text-white font-bold text-xs cursor-pointer">
                <span className="material-symbols-outlined">account_circle</span>
                <span className="hidden sm:inline">Sign In</span>
             </div>
             <span className="material-symbols-outlined text-[#A0AEC0] cursor-pointer">settings</span>
             <span className="material-symbols-outlined text-[#A0AEC0] cursor-pointer">notifications</span>
          </div>
        </header>

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(227,26,26,0.3)] bg-[rgba(227,26,26,0.1)] text-[#E31A1A] text-sm mb-8">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span>{error}</span>
            <button onClick={fetchData} className="ml-auto underline opacity-80 hover:opacity-100 text-xs font-bold">
              Retry Connection
            </button>
          </div>
        )}

        <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto">
           {/* ── Top Stats Row ── */}
           <SummaryCards summary={summary} loading={loading} />

           {/* ── Welcome & Form Row ── */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Welcome Banner */}
              <div className="lg:col-span-8 vui-card p-8 flex flex-col justify-between relative overflow-hidden min-h-[250px]">
                 <div className="z-10 flex flex-col h-full">
                    <p className="text-[#A0AEC0] text-sm font-bold mb-1">Welcome back,</p>
                    <h2 className="text-white text-3xl font-bold mb-4">Mark Johnson</h2>
                    <p className="text-[#A0AEC0] text-sm max-w-xs mb-8">
                       Glad to see you again!<br/>
                       Ask me anything.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-white text-sm font-bold cursor-pointer group w-fit">
                       Tap to record
                       <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                 </div>
                 {/* Decorative background element simulating the jellyfish graphic */}
                 <div className="absolute right-[-10%] top-[-10%] w-2/3 h-full opacity-60 pointer-events-none rounded-full blur-[60px]" style={{ background: "radial-gradient(circle, #0075FF 0%, transparent 70%)" }}></div>
              </div>

              {/* Form */}
              <div className="lg:col-span-4">
                 <TransactionForm onSuccess={fetchData} />
              </div>
           </div>

           {/* ── Bottom Row ── */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
              <div className="lg:col-span-8">
                 {/* Placeholder for Projects table - using a simple card for now to match layout */}
                 <div className="vui-card p-6 h-full min-h-[300px]">
                    <div className="flex flex-col mb-6">
                       <h3 className="text-lg font-bold text-white mb-1">Projects</h3>
                       <p className="text-sm font-bold text-[#01B574]">
                          <span className="material-symbols-outlined text-sm align-middle mr-1">check_circle</span>
                          30 done <span className="text-[#A0AEC0] font-normal">this month</span>
                       </p>
                    </div>
                    
                    <div className="w-full overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr>
                                <th className="pb-3 text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider border-b border-[rgba(255,255,255,0.1)]">Companies</th>
                                <th className="pb-3 text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider border-b border-[rgba(255,255,255,0.1)]">Members</th>
                                <th className="pb-3 text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider border-b border-[rgba(255,255,255,0.1)]">Budget</th>
                                <th className="pb-3 text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider border-b border-[rgba(255,255,255,0.1)]">Completion</th>
                             </tr>
                          </thead>
                          <tbody>
                             <tr>
                                <td className="py-4 border-b border-[rgba(255,255,255,0.05)] text-sm font-bold text-white">Chakra Vision UI Version</td>
                                <td className="py-4 border-b border-[rgba(255,255,255,0.05)]">...</td>
                                <td className="py-4 border-b border-[rgba(255,255,255,0.05)] text-sm font-bold text-white">$14,000</td>
                                <td className="py-4 border-b border-[rgba(255,255,255,0.05)]">
                                   <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-white">60%</span>
                                      <div className="progress-bar w-24"><div className="progress-bar-fill bg-[#0075FF] w-[60%]"></div></div>
                                   </div>
                                </td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-4">
                 <TransactionList transactions={transactions} onDelete={fetchData} loading={loading} />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
