"use client";

import { useState } from "react";
import { Transaction } from "@/lib/types";
import { transactionApi } from "@/lib/api";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: () => void;
  loading?: boolean;
}

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount).replace('$', '$');

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Drink": "text-[#0BC5EA]",
  "Transport": "text-[#7551FF]",
  "Shopping": "text-[#0075FF]",
  "Entertainment": "text-[#E31A1A]",
  "Health": "text-[#01B574]",
  "Salary": "text-[#01B574]",
};

export default function TransactionList({ transactions, onDelete, loading }: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await transactionApi.remove(id);
      onDelete?.();
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="vui-card p-6 h-full">
        <h3 className="text-lg font-bold text-white mb-6">Recent Transactions</h3>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[60px] rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="vui-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Orders overview</h3>
        <span className="text-sm font-bold text-[#01B574]">+30% <span className="text-[#A0AEC0]">this month</span></span>
      </div>

      <div className="flex flex-col relative">
         {/* Vertical Timeline Line */}
         <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-[rgba(255,255,255,0.1)] z-0"></div>

        {transactions.length === 0 ? (
           <p className="text-[#A0AEC0] text-sm py-4">No transactions found.</p>
        ) : (
          transactions.map((tx, idx) => {
            const isIncome = tx.type === "income";
            const colorClass = CATEGORY_COLORS[tx.category] || "text-[#0075FF]";
            
            return (
              <div key={tx._id} className="flex gap-4 relative z-10 mb-6 last:mb-0 group">
                <div className="mt-1">
                   <span className={`material-symbols-outlined text-[22px] bg-[#060B28] rounded-full ${colorClass}`}>
                      {isIncome ? "add_circle" : "shopping_cart"}
                   </span>
                </div>
                <div className="flex-1 flex flex-col">
                   <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white leading-tight">
                        {tx.title}
                        <span className={`ml-2 text-xs font-normal ${isIncome ? 'text-[#01B574]' : 'text-[#A0AEC0]'}`}>
                           {isIncome ? "+" : "-"}{formatIDR(tx.amount)}
                        </span>
                      </p>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        disabled={deletingId === tx._id}
                        className="opacity-0 group-hover:opacity-100 text-[#A0AEC0] hover:text-[#E31A1A] transition-all disabled:opacity-50"
                      >
                         <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                   </div>
                   <p className="text-xs text-[#A0AEC0] mt-1 font-medium">{formatDate(tx.date)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
