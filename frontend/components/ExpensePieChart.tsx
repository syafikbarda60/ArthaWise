"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TransactionSummary } from "@/lib/types";

interface ExpensePieChartProps {
  summary: TransactionSummary;
}

export default function ExpensePieChart({ summary }: ExpensePieChartProps) {
  const { totalIncome, totalExpense } = summary;
  
  // Use mock values if zero to showcase the UI
  const income = totalIncome > 0 ? totalIncome : 5000;
  const expense = totalExpense > 0 ? totalExpense : 1800;
  
  const balance = Math.max(0, income - expense);
  const total = income; // total pie is income

  const expensePercent = Math.min(100, Math.round((expense / total) * 100)) || 36;
  const balancePercent = Math.min(100, Math.round((balance / total) * 100)) || 64;

  // SVG parameters
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  // Dash array = circumference, dash offset = circumference - (percent / 100) * circumference
  const expenseOffset = circumference - (expensePercent / 100) * circumference;
  
  return (
    <motion.div 
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="vui-card p-6 flex flex-col justify-between"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-gray-400 font-medium">Gambaran Saldo</h3>
        <span className="material-symbols-outlined text-gray-500">pie_chart</span>
      </div>

      <div className="flex-1 flex items-center justify-center relative py-4">
        <svg width="180" height="180" viewBox="0 0 160 160" className="transform -rotate-90 drop-shadow-xl">
          {/* Background circle (Balance) */}
          <circle 
            cx="80" 
            cy="80" 
            r={radius} 
            fill="none" 
            stroke="#10173d" 
            strokeWidth="24" 
          />
          <circle 
            cx="80" 
            cy="80" 
            r={radius} 
            fill="none" 
            stroke="#0bc5ea" 
            strokeWidth="24" 
            strokeDasharray={circumference}
            strokeDashoffset={0}
            className="opacity-40"
          />
          {/* Foreground circle (Expense) */}
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: expenseOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="80" 
            cy="80" 
            r={radius} 
            fill="none" 
            stroke="#7551ff" 
            strokeWidth="24" 
            strokeDasharray={circumference}
            strokeLinecap="round" 
            className="drop-shadow-[0_0_8px_rgba(117,81,255,0.6)]"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Saldo Tersisa</span>
          <span className="text-[11px] font-black text-white leading-snug break-all">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(balance)}
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-4 gap-4">
        <div className="flex-1 bg-[#151923]/50 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_5px_#0bc5ea]"></div>
            <span className="text-xs text-gray-400 font-medium">Saldo</span>
          </div>
          <div className="text-lg font-semibold text-white">{balancePercent}%</div>
        </div>
        <div className="flex-1 bg-[#151923]/50 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_5px_#7551ff]"></div>
            <span className="text-xs text-gray-400 font-medium">Pengeluaran</span>
          </div>
          <div className="text-lg font-semibold text-white">{expensePercent}%</div>
        </div>
      </div>
    </motion.div>
  );
}
