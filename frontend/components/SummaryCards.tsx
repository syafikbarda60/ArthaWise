"use client";

import { TransactionSummary } from "@/lib/types";

interface SummaryCardsProps {
  summary: TransactionSummary;
  loading?: boolean;
}

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount).replace('$', '$'); // Using $ for the vision UI look

export default function SummaryCards({ summary, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="vui-card p-4 min-h-[90px] animate-pulse" />
        ))}
      </div>
    );
  }

  const { balance, totalIncome, totalExpense } = summary;

  const STATS = [
    {
      title: "Today's Money",
      value: `$${Math.max(balance, 53000).toLocaleString()}`,
      change: "+55%",
      isPositive: true,
      icon: "account_balance_wallet",
    },
    {
      title: "Today's Users",
      value: "2,300",
      change: "+3%",
      isPositive: true,
      icon: "language",
    },
    {
      title: "New Clients",
      value: "+3,462",
      change: "-2%",
      isPositive: false,
      icon: "description",
    },
    {
      title: "Total Sales",
      value: `$${Math.max(totalIncome, 103430).toLocaleString()}`,
      change: "+5%",
      isPositive: true,
      icon: "shopping_cart",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {STATS.map((stat, i) => (
        <div key={i} className="vui-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[#A0AEC0] text-xs font-bold mb-1">{stat.title}</p>
            <div className="flex items-center gap-2">
              <h4 className="text-white text-lg font-bold">{stat.value}</h4>
              <span className={`text-sm font-bold ${stat.isPositive ? 'text-[#01B574]' : 'text-[#E31A1A]'}`}>
                {stat.change}
              </span>
            </div>
          </div>
          <div className="stat-icon bg-[#0075FF]">
            <span className="material-symbols-outlined text-white">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
