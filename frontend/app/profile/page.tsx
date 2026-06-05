"use client";

import React, { useEffect, useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Settings, Person, Email, VpnKey, DeleteForever, ExitToApp } from "@mui/icons-material";

export default function ProfilePage() {
  const [userName, setUserName] = useState("Pengguna Artha");
  const [userEmail, setUserEmail] = useState("user@arthawise.app");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }
      const userStr = localStorage.getItem("auth_user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || "Pengguna");
          setUserEmail(user.email || "user@arthawise.app");
        } catch (e) {}
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-gray-200">
      <AnimatedBackground />
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-4 pt-20 pb-20 lg:p-10 lg:pt-10 lg:pb-10 ml-0 md:ml-64 transition-all duration-300">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 lg:mb-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight shrink-0">Profil Pengguna</h1>
            <p className="text-sm text-zinc-500 mt-1">Kelola informasi akun dan pengaturan keamanan</p>
          </motion.div>
        </header>
        
        <div className="flex-1 overflow-y-auto pr-2 pb-6 md:pb-10 customized-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            {/* Profile Card */}
            <div className="p-8 bg-zinc-900/40 rounded-3xl border border-white/5 relative overflow-hidden backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&size=120`} alt="Avatar" className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl ring-4 ring-brand-blue/20" />
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                    <Settings style={{ fontSize: 20 }} />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl font-black text-white mb-2">{userName}</h2>
                  <p className="text-zinc-400 flex items-center justify-center sm:justify-start gap-2">
                    <Email style={{ fontSize: 16 }} /> {userEmail}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-lg text-xs font-bold uppercase tracking-widest border border-brand-green/20">
                    Akun Aktif
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue mb-4">
                    <Person />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Informasi Pribadi</h3>
                  <p className="text-sm text-zinc-500 mb-6">Ubah nama, email, dan preferensi akun Anda.</p>
                </div>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-colors border border-white/10">
                  Edit Profil
                </button>
              </div>

              <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-cyan mb-4">
                    <VpnKey />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Keamanan</h3>
                  <p className="text-sm text-zinc-500 mb-6">Ubah kata sandi dan aktifkan autentikasi dua faktor.</p>
                </div>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-colors border border-white/10">
                  Ubah Sandi
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-12 p-6 border border-red-500/20 bg-red-500/5 rounded-3xl backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-2 text-brand-red">Zona Berbahaya</h3>
              <p className="text-sm text-zinc-500 mb-6">Tindakan di bawah ini tidak dapat dibatalkan.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold text-white transition-colors border border-white/10">
                  <ExitToApp style={{ fontSize: 18 }} />
                  Keluar dari Akun
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-red/10 hover:bg-brand-red/20 rounded-xl text-sm font-bold text-brand-red transition-colors border border-brand-red/30">
                  <DeleteForever style={{ fontSize: 18 }} />
                  Hapus Akun
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
