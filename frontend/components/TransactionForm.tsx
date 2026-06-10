"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { transactionApi } from "@/lib/api";
import { NewTransactionPayload, TransactionCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: TransactionCategory[] = [
  "Food & Drink", "Transport", "Shopping", "Entertainment",
  "Health", "Utilities", "Salary", "Freelance", "Investment", "Other",
];

const CATEGORY_ID: Record<string, string> = {
  "Food & Drink": "Makanan & Minuman",
  Transport: "Transportasi",
  Shopping: "Belanja",
  Entertainment: "Hiburan",
  Health: "Kesehatan",
  Utilities: "Utilitas",
  Salary: "Gaji",
  Freelance: "Freelance",
  Investment: "Investasi",
  Other: "Lainnya",
};

interface TransactionFormProps {
  onSuccess?: () => void;
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewTransactionPayload>({
    title: "",
    amount: 0,
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.amount <= 0) return;
    try {
      setLoading(true);
      await transactionApi.create(formData);
      setFormData({ title: "", amount: 0, type: "expense", date: new Date().toISOString().split("T")[0], description: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="vui-card p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Tambah Transaksi</h2>
        <p className="text-sm text-gray-400">Catat entri manual (AI akan mengkategorikan otomatis)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-3">
          {(["expense", "income"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={cn(
                "py-2.5 rounded-xl text-sm font-semibold transition-all border",
                formData.type === type
                  ? type === "expense"
                    ? "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                    : "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                  : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
              )}
            >
              {type === "expense" ? "Pengeluaran" : "Pemasukan"}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">JUDUL</label>
          <input
            type="text"
            required
            placeholder="cth. Makan Siang, Gaji Bulanan"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="vui-input w-full"
          />
        </div>

        {/* Amount + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">JUMLAH (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">Rp</span>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="vui-input w-full"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">TANGGAL</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="vui-input w-full"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">KATEGORI</label>
          <select
            value={formData.category || ""}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
            className="vui-input w-full bg-[#09090b]"
          >
            <option value="">-- Biarkan AI kategorikan --</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_ID[c]}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">CATATAN</label>
          <input
            type="text"
            placeholder="Catatan opsional untuk AI mengkategorikan lebih akurat..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="vui-input w-full"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden group rounded-xl bg-brand-blue text-white font-bold py-3.5 transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,117,255,0.3)] hover:shadow-[0_0_30px_rgba(0,117,255,0.5)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Simpan Transaksi
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
