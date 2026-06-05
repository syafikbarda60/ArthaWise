"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dashboard,
  ReceiptLong,
  BarChart,
  Settings,
  Help,
  ChevronLeft,
  ChevronRight,
  GppGood,
  Hexagon,
  Search,
} from "@mui/icons-material";
import { cn } from "@/lib/utils";

const MAIN_ITEMS = [
  { label: "Dasbor", href: "/dashboard", icon: <Dashboard style={{ fontSize: 20 }} /> },
  { label: "Transaksi", href: "/transactions", icon: <ReceiptLong style={{ fontSize: 20 }} /> },
  { label: "Analisis AI", href: "/analytics", icon: <BarChart style={{ fontSize: 20 }} /> },
];

const HELP_ITEMS = [
  { label: "Bantuan", href: "/support", icon: <Help style={{ fontSize: 20 }} /> },
  { label: "Profil", href: "/profile", icon: <Settings style={{ fontSize: 20 }} /> },
];

const sidebarVariants = {
  expanded: { width: 280 },
  collapsed: { width: 80 },
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Top Navigation */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-4 py-3 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center overflow-hidden w-8 h-8">
            <img src="/logo.png" alt="ArthaWise" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-white tracking-widest text-xs uppercase">ArthaWise</span>
        </div>
      </header>

      {/* Persistent Sidebar */}
      <motion.nav
        initial={false}
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-[#09090b] border-r border-white/5 px-4 py-8 overflow-hidden",
          collapsed ? "items-center" : "items-start"
        )}
      >
        {/* Logo & Toggle */}
        <div
          className={cn(
            "flex items-center w-full mb-10 px-2",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center overflow-hidden relative group cursor-pointer">
              <img src="/logo.png" alt="ArthaWise" className="w-15 h-15 object-contain relative z-10" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity" />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  key="logo-text"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="font-black text-white tracking-widest uppercase text-base whitespace-nowrap"
                >
                  ArthaWise
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.button
                key="collapse-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors shrink-0"
              >
                <ChevronLeft style={{ fontSize: 18 }} />
              </motion.button>
            )}
          </AnimatePresence>

          {collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setCollapsed(false)}
              className="mt-4 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
            >
              <ChevronRight style={{ fontSize: 18 }} />
            </motion.button>
          )}
        </div>

        {/* Search */}
        <div className="w-full px-2 mb-8">
          <div
            className={cn(
              "relative flex items-center bg-zinc-900/50 border border-white/5 rounded-xl transition-all",
              collapsed ? "w-10 h-10 justify-center hover:bg-zinc-800 cursor-pointer" : "w-full px-3 py-2.5"
            )}
          >
            <Search style={{ fontSize: 16 }} className="text-zinc-500 shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.input
                  key="search-input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  type="text"
                  placeholder="Cari transaksi..."
                  className="ml-3 bg-transparent border-none text-xs text-white placeholder-zinc-600 focus:outline-none w-full"
                />
              )}
            </AnimatePresence>
            {!collapsed && (
              <div className="px-1.5 py-0.5 bg-zinc-800 border border-white/10 rounded text-[9px] font-black text-zinc-500">
                ⌘K
              </div>
            )}
          </div>
        </div>

        {/* Main Nav Items */}
        <div className="w-full space-y-1">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                key="main-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 ml-4"
              >
                Menu Utama
              </motion.p>
            )}
          </AnimatePresence>
          {MAIN_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="block w-full">
                <div
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 group relative",
                    isActive ? "bg-zinc-900 text-white border border-white/5" : "text-zinc-500 hover:text-white hover:bg-zinc-900/30"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute left-0 top-3 bottom-3 w-1 bg-brand-blue rounded-r-full"
                    />
                  )}
                  <span className={cn("transition-colors shrink-0", isActive ? "text-brand-blue" : "group-hover:text-white")}>
                    {item.icon}
                  </span>
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        key={`label-${item.href}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-bold tracking-tight whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(37,99,235,0.8)] shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help Items */}
        <div className="w-full space-y-1 mt-10">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                key="help-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 ml-4"
              >
                Dukungan
              </motion.p>
            )}
          </AnimatePresence>
          {HELP_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="block w-full">
                <div
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 group",
                    isActive ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-900/30"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        key={`help-${item.href}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-bold tracking-tight whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button 
            onClick={() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_user");
              window.location.href = "/login";
            }}
            className="w-full"
          >
            <div className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 group text-zinc-500 hover:text-brand-red hover:bg-brand-red/10">
              <span className="shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-bold tracking-tight whitespace-nowrap"
                  >
                    Keluar
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>

        {/* Status Card */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="mt-auto w-full p-5 bg-zinc-900/40 rounded-3xl border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 text-brand-green/10">
                <GppGood style={{ fontSize: 48 }} />
              </div>
              <h6 className="text-white text-xs font-bold mb-1 relative z-10">Status Sistem</h6>
              <p className="text-zinc-500 text-[10px] mb-4 leading-relaxed relative z-10">
                Semua model AI berjalan dengan performa optimal.
              </p>
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">Aman</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/5">
        {MAIN_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all",
                  isActive ? "text-brand-blue" : "text-zinc-500"
                )}
              >
                {item.icon}
                <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
