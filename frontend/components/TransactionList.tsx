"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/lib/types";
import { transactionApi } from "@/lib/api";
import { DeleteOutlined, OpenInNew, NorthEast, SouthWest, CalendarToday } from "@mui/icons-material";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

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

export default function TransactionList({ transactions, onTransactionDeleted }: TransactionListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.15 }}
      className="vui-card overflow-hidden"
    >
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Aktivitas Terkini</h3>
          <p className="text-xs text-zinc-500 font-medium">Aliran transaksi real-time</p>
        </div>
        <button className="text-xs font-bold text-brand-blue hover:text-blue-400 transition-colors flex items-center gap-1 group">
          LIHAT SEMUA <OpenInNew style={{ fontSize: 14 }} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-900/30">
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Deskripsi</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Kategori</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tanggal</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Jumlah</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {transactions.length > 0 ? (
                transactions.slice(0, 8).map((t, idx) => (
                  <motion.tr
                    key={t._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 200, damping: 24, delay: idx * 0.04 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center border shrink-0",
                            t.type === "income"
                              ? "bg-brand-green/10 border-brand-green/20 text-brand-green"
                              : "bg-zinc-800 border-white/5 text-zinc-400"
                          )}
                        >
                          {t.type === "income" ? <SouthWest style={{ fontSize: 16 }} /> : <NorthEast style={{ fontSize: 16 }} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors">{t.title}</div>
                          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                            {t.type === "income" ? "Pemasukan" : "Pengeluaran"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-zinc-900/50 border border-white/5 rounded-full text-[10px] font-black text-zinc-400 group-hover:border-white/10 transition-colors">
                        {CATEGORY_ID[t.category] || t.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <CalendarToday style={{ fontSize: 13 }} />
                        <span className="text-xs font-medium">{t.date.substring(0, 10)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div
                        className={cn(
                          "text-sm font-black tracking-tight",
                          t.type === "income" ? "text-brand-green" : "text-white"
                        )}
                      >
                        {t.type === "income" ? "+" : "-"}
                        {formatRupiah(t.amount)}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={async () => {
                          try {
                            await transactionApi.remove(t._id);
                            onTransactionDeleted();
                          } catch (e) {
                            console.error("Gagal menghapus", e);
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-brand-red hover:border-brand-red/30 transition-all group/btn ml-auto"
                        title="Hapus transaksi"
                      >
                        <DeleteOutlined style={{ fontSize: 13 }} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-600">
                      <OpenInNew style={{ fontSize: 36 }} className="mb-4 opacity-10" />
                      <p className="text-sm font-medium">Buku kas kosong. Aman & terlindungi.</p>
                      <p className="text-xs mt-1">Mulai tambahkan transaksi baru.</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
