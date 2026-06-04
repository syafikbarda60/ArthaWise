"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { LockOutlined, EmailOutlined, ArrowForward } from "@mui/icons-material";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("auth_user", JSON.stringify(res.data));
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Gagal login. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="vui-card p-10 backdrop-blur-2xl bg-[#09090b]/80 border border-white/10 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 overflow-hidden">
              <img src="/logo.png" alt="ArthaWise" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Welcome Back</h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">Masuk untuk mengelola finansial Anda</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold mb-6">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand-blue transition-colors">
                  <EmailOutlined style={{ fontSize: 20 }} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-transparent transition-all placeholder:text-zinc-600 font-medium"
                  placeholder="anda@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand-blue transition-colors">
                  <LockOutlined style={{ fontSize: 20 }} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-transparent transition-all placeholder:text-zinc-600 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white rounded-xl py-4 font-black tracking-wide text-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-brand-blue/20"
            >
              {loading ? "MEMPROSES..." : "MASUK SEKARANG"}
              {!loading && <ArrowForward style={{ fontSize: 18 }} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center mt-8 text-xs font-medium text-zinc-500">
            Belum punya akun?{" "}
            <Link href="/register" className="text-brand-blue hover:text-blue-400 font-bold hover:underline transition-colors">
              Daftar Gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
