"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, TransactionSummary } from "@/lib/types";
import ExpensePieChart from "./ExpensePieChart";
import { BarChart, PieChart, CalendarToday, ChevronRight } from "@mui/icons-material";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DashboardChartsProps {
  transactions: Transaction[];
  summary: TransactionSummary;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const TABS = [
  { key: "Bulanan", label: "Bulanan", days: 30 },
  { key: "Mingguan", label: "Mingguan", days: 7 },
  { key: "Hari Ini", label: "Hari Ini", days: 1 },
];

const CATEGORY_COLORS = [
  "from-brand-blue to-brand-cyan",
  "from-brand-purple to-brand-blue",
  "from-brand-cyan to-brand-green",
  "from-brand-green to-brand-cyan",
  "from-brand-red to-brand-purple",
];

export default function DashboardCharts({ transactions, summary }: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState("Bulanan");

  const activeDays = TABS.find((t) => t.key === activeTab)?.days ?? 30;

  const filtered = transactions.filter((t) => {
    const diff = Date.now() - new Date(t.date).getTime();
    return diff <= activeDays * 86400000;
  });

  const expensesByCategory = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxExpense = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;
  const totalExpenseFiltered = sortedCategories.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Category Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="lg:col-span-8 vui-card p-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              <BarChart style={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Distribusi Pengeluaran</h3>
              <p className="text-xs text-zinc-500 font-medium">Dikategorikan otomatis oleh Model AI</p>
            </div>
          </div>

          <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-white/5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 relative",
                  activeTab === tab.key ? "text-white" : "text-zinc-500 hover:text-white"
                )}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="chartTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 bg-zinc-800 rounded-lg shadow-lg"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {sortedCategories.length > 0 ? (
              sortedCategories.map(([category, amount], idx) => (
                <motion.div
                  key={`${activeTab}-${category}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24, delay: idx * 0.06 }}
                  className="group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r", CATEGORY_COLORS[idx % CATEGORY_COLORS.length])} />
                      <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{category}</span>
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">
                        {totalExpenseFiltered > 0 ? ((amount / totalExpenseFiltered) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <span className="text-sm font-black text-white">{formatRupiah(amount)}</span>
                  </div>
                  <div className="relative h-2.5 w-full bg-zinc-900/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(amount / maxExpense) * 100}%` }}
                      transition={{ duration: 0.9, delay: 0.1 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className={cn("h-full bg-gradient-to-r rounded-full shadow-sm", CATEGORY_COLORS[idx % CATEGORY_COLORS.length])}
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-zinc-600 bg-zinc-900/20 rounded-2xl border border-dashed border-white/5"
              >
                <CalendarToday style={{ fontSize: 32 }} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">Tidak ada aktivitas pada periode ini</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Total pengeluaran <span className="text-zinc-300 font-bold">{activeTab}</span>
          </div>
          <Link href="/report" className="flex items-center gap-1.5 text-brand-blue font-bold text-sm cursor-pointer hover:underline group">
            Analisis Detail <ChevronRight style={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
        className="lg:col-span-4 vui-card p-8 flex flex-col items-center justify-center"
      >
        <div className="w-full flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
            <PieChart style={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Porsi Dompet</h3>
            <p className="text-xs text-zinc-500 font-medium">Alokasi Modal</p>
          </div>
        </div>
        <ExpensePieChart summary={summary} />
      </motion.div>
    </div>
  );
}
