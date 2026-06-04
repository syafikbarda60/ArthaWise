"use client";

import React from "react";
import { motion } from "framer-motion";
import { TransactionSummary, Transaction } from "@/lib/types";
import { TrendingUp, TrendingDown, AccountBalanceWallet, NorthEast, SouthEast, MoreVert } from "@mui/icons-material";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  summary: TransactionSummary;
  transactions: Transaction[];
  loading?: boolean;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      delay: i * 0.12,
    },
  }),
};

export default function SummaryCards({ summary, transactions, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="vui-card h-36 animate-pulse" />
        ))}
      </div>
    );
  }

  const { totalIncome, totalExpense, balance } = summary;

  const cards = [
    {
      title: "Saldo Bersih",
      value: formatRupiah(balance),
      icon: <AccountBalanceWallet className="text-brand-blue" style={{ fontSize: 20 }} />,
      color: "blue",
      trend: balance > 0 ? "Surplus" : balance < 0 ? "Defisit" : "Stabil",
      isPositive: balance >= 0,
      desc: "Total saldo periode ini",
    },
    {
      title: "Total Pemasukan",
      value: formatRupiah(totalIncome),
      icon: <TrendingUp className="text-brand-green" style={{ fontSize: 20 }} />,
      color: "green",
      trend: totalIncome > 0 ? `${transactions.filter(t => t.type === "income").length} Transaksi` : "Belum ada",
      isPositive: true,
      desc: "Gaji & pendapatan periode ini",
    },
    {
      title: "Total Pengeluaran",
      value: formatRupiah(totalExpense),
      icon: <TrendingDown className="text-brand-red" style={{ fontSize: 20 }} />,
      color: "red",
      trend: totalIncome > 0 
        ? `${((totalExpense / totalIncome) * 100).toFixed(1)}% dari pemasukan` 
        : "Overbudget",
      isPositive: totalExpense <= totalIncome,
      desc: "Biaya & pengeluaran periode ini",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
          className="vui-card p-6 relative overflow-hidden group cursor-default"
        >
          <div className="flex justify-between items-start mb-5">
            <div
              className={cn(
                "p-3 rounded-2xl border transition-all duration-300",
                card.color === "blue" && "bg-brand-blue/10 border-brand-blue/20 text-brand-blue group-hover:bg-brand-blue/20",
                card.color === "green" && "bg-brand-green/10 border-brand-green/20 text-brand-green group-hover:bg-brand-green/20",
                card.color === "red" && "bg-brand-red/10 border-brand-red/20 text-brand-red group-hover:bg-brand-red/20"
              )}
            >
              {card.icon}
            </div>
            <button className="text-zinc-700 hover:text-white transition-colors">
              <MoreVert style={{ fontSize: 16 }} />
            </button>
          </div>

          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{card.title}</div>
            <div className="text-xl font-black text-white tracking-tight mb-4 break-words">{card.value}</div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[10px] text-zinc-500 font-medium">{card.desc}</span>
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border",
                  card.isPositive
                    ? "text-brand-green bg-brand-green/5 border-brand-green/10"
                    : "text-brand-red bg-brand-red/5 border-brand-red/10"
                )}
              >
                {card.isPositive ? <NorthEast style={{ fontSize: 10 }} strokeWidth={3} /> : <SouthEast style={{ fontSize: 10 }} strokeWidth={3} />}
                {card.trend}
              </div>
            </div>
          </div>

          {/* Glow on hover */}
          <div
            className={cn(
              "absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-all duration-500 rounded-full",
              card.color === "blue" && "bg-brand-blue",
              card.color === "green" && "bg-brand-green",
              card.color === "red" && "bg-brand-red"
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}
