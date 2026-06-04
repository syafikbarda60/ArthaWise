"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import AnimatedBackground from "@/components/AnimatedBackground";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { PersonOutlineOutlined, EmailOutlined, LockOutlined, Save, CheckCircleOutlined } from "@mui/icons-material";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }
      const authUser = localStorage.getItem("auth_user");
      if (authUser) {
        const parsed = JSON.parse(authUser);
        setUser(prev => ({ ...prev, name: parsed.name, email: parsed.email }));
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload: any = { name: user.name };
      if (user.password.trim() !== "") {
        payload.password = user.password;
      }
      const response = await authApi.updateProfile(payload);
      
      // Update local storage
      localStorage.setItem("auth_user", JSON.stringify({
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
      }));
      
      setSuccess(true);
      setUser(prev => ({ ...prev, password: "" }));
      
      // Give feedback for 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
      // Dispatch custom event to notify other components (like dashboard) to update the name
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-gray-200">
      <AnimatedBackground />
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 p-6 lg:p-10 ml-0 md:ml-64 transition-all duration-300">
        <header className="mb-10">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-2xl font-bold text-white tracking-tight">Profil Pengguna</h1>
            <p className="text-sm text-zinc-500 mt-1">Kelola data personal dan pengaturan akun Anda.</p>
          </motion.div>
        </header>

        <div className="max-w-2xl">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="vui-card p-8"
          >
            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/5">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=2563eb&color=fff&size=128`} 
                alt="Avatar" 
                className="w-24 h-24 rounded-2xl ring-4 ring-brand-blue/20" 
              />
              <div>
                <h2 className="text-xl font-bold text-white">{user.name || "Memuat..."}</h2>
                <p className="text-sm text-zinc-400 mt-1">{user.email || "Memuat..."}</p>
                <div className="mt-3 inline-flex px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-[10px] uppercase font-black tracking-widest rounded-lg border border-brand-cyan/20">
                  Akun Aktif
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {error && (
                <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red text-sm font-medium">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-brand-green/10 border border-brand-green/20 rounded-xl text-brand-green text-sm font-medium flex items-center gap-3">
                  <CheckCircleOutlined style={{ fontSize: 20 }} />
                  Profil berhasil diperbarui!
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Nama Lengkap</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand-blue transition-colors">
                    <PersonOutlineOutlined style={{ fontSize: 20 }} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue/50 focus:bg-zinc-900/80 transition-all text-sm"
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Alamat Email</label>
                <div className="relative opacity-60 cursor-not-allowed">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                    <EmailOutlined style={{ fontSize: 20 }} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    readOnly
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 text-sm cursor-not-allowed"
                    placeholder="Alamat Email"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 pl-1 mt-1">Alamat email tidak dapat diubah saat ini.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Kata Sandi Baru (Opsional)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand-blue transition-colors">
                    <LockOutlined style={{ fontSize: 20 }} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-brand-blue/50 focus:bg-zinc-900/80 transition-all text-sm"
                    placeholder="Biarkan kosong jika tidak ingin mengubah sandi"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save style={{ fontSize: 20 }} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
