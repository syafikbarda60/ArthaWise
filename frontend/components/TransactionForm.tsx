"use client";

import { useState } from "react";
import { transactionApi } from "@/lib/api";
import { NewTransactionPayload, TransactionCategory } from "@/lib/types";

const CATEGORIES: { key: TransactionCategory; label: string }[] = [
  { key: "Food & Drink", label: "Food" },
  { key: "Transport", label: "Transit" },
  { key: "Shopping", label: "Shopping" },
  { key: "Entertainment", label: "Entertain" },
  { key: "Health", label: "Health" },
  { key: "Utilities", label: "Utilities" },
  { key: "Salary", label: "Salary" },
  { key: "Freelance", label: "Freelance" },
  { key: "Investment", label: "Invest" },
  { key: "Other", label: "Other" },
];

interface TransactionFormProps {
  onSuccess?: () => void;
}

const INITIAL = {
  title: "",
  amount: "",
  category: "" as TransactionCategory | "",
  type: "expense" as "income" | "expense",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) return setError("Please select a category.");
    setLoading(true);
    setError(null);
    try {
      const payload: NewTransactionPayload = {
        title: form.title.trim(),
        amount: parseFloat(form.amount),
        category: form.category as TransactionCategory,
        type: form.type,
        date: form.date,
      };
      await transactionApi.create(payload);
      setSuccess(true);
      setForm(INITIAL);
      setTimeout(() => { setSuccess(false); onSuccess?.(); }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vui-card p-6 h-full flex flex-col">
      <div className="flex flex-col mb-6">
        <h3 className="text-lg font-bold text-white mb-1">Add Transaction</h3>
        <p className="text-sm text-[#A0AEC0]">Record a new entry to your ledger</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-1" htmlFor="title">Title</label>
          <input
            id="title"
            className="vui-input"
            type="text"
            placeholder="e.g. Orbital Coffee"
            value={form.title}
            onChange={(e) => { set("title", e.target.value); setError(null); }}
            required
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-1" htmlFor="amount">Amount ($)</label>
          <input
            id="amount"
            className="vui-input"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={form.amount}
            onChange={(e) => { set("amount", e.target.value); setError(null); }}
            required
          />
        </div>

        {/* Type Toggle */}
        <div className="flex flex-col">
           <label className="text-sm text-white mb-2 ml-1">Type</label>
           <div className="flex bg-[#0B1437] p-1 rounded-xl border border-[rgba(255,255,255,0.1)]">
             <button
                type="button"
                onClick={() => set("type", "expense")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${form.type === 'expense' ? 'bg-[#0075FF] text-white' : 'text-[#A0AEC0]'}`}
             >
                EXPENSE
             </button>
             <button
                type="button"
                onClick={() => set("type", "income")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${form.type === 'income' ? 'bg-[#0075FF] text-white' : 'text-[#A0AEC0]'}`}
             >
                INCOME
             </button>
           </div>
        </div>

        {/* Category Select */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-1" htmlFor="category">Category</label>
          <select
            id="category"
            className="vui-input cursor-pointer appearance-none"
            value={form.category}
            onChange={(e) => { set("category", e.target.value); setError(null); }}
            required
          >
            <option value="" disabled>Select Category</option>
            {CATEGORIES.map(c => <option key={c.key} value={c.key} className="bg-[#0B1437]">{c.label}</option>)}
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-1" htmlFor="date">Date</label>
          <input
            id="date"
            className="vui-input"
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </div>

        {error && <p className="text-[#E31A1A] text-xs ml-1">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className="mt-auto w-full bg-[#0075FF] hover:bg-[#0075FF]/80 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : success ? "SAVED!" : "ADD TRANSACTION"}
        </button>
      </form>
    </div>
  );
}
