"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

/* =========================================================================
   REACT BITS INSPIRED COMPONENTS 
   https://reactbits.dev/
========================================================================= */

/* ─── BlurText ─────────────────────────────────────────────────────── */
const BlurText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  const words = text.split(" ");
  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(12px)", opacity: 0, y: 15 }}
          whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + i * 0.08, duration: 0.8, ease: "easeOut" }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

/* ─── ShinyText ────────────────────────────────────────────────────── */
const ShinyText = ({ text, className = "" }: { text: string; className?: string }) => (
  <span
    className={`inline-block ${className}`}
    style={{
      background: "linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 60%)",
      backgroundSize: "200% 100%",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "#09f",
      animation: "shine 10s linear infinite",
    }}
  >
    {text}
  </span>
);

/* ─── SpotlightCard ────────────────────────────────────────────────── */
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(0,153,255,0.15)" }: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(1); }}
      onBlur={() => { setIsFocused(false); setOpacity(0); }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

/* ─── MagnetButton ─────────────────────────────────────────────────── */
const MagnetButton = ({ children, className = "", href }: { children: React.ReactNode; className?: string; href: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    setPosition({ x: (clientX - (left + width / 2)) * 0.1, y: (clientY - (top + height / 2)) * 0.1 });
  };

  return (
    <motion.div animate={{ x: position.x, y: position.y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}>
      <Link href={href} ref={ref} onMouseMove={handleMouse} onMouseLeave={() => setPosition({ x: 0, y: 0 })} className={`inline-block ${className}`}>
        {children}
      </Link>
    </motion.div>
  );
};

/* ─── Imports ──────────────────────────────────────────────────────── */
import ColorBends from "@/components/ColorBends";
import { StarBorder } from "@/components/StarBorder";
import { TiltedCard } from "@/components/TiltedCard";
import dynamic from "next/dynamic";
const CardSwap = dynamic(() => import("@/components/CardSwap"), { ssr: false });
import { Card } from "@/components/CardSwap";

/* ========================================================================= */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const steps = 60;
    const inc = to / steps;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.round(cur));
    }, 1200 / steps);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const TICKER = ["Dashboard Real-Time", "AI LSTM Forecast", "Smart Categorization", "Laporan DOCX", "Import CSV", "Filter Kategori", "Analisis Anomali", "Smart Insights"];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...TICKER, ...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden py-3">
      <motion.div
        className="flex gap-0 whitespace-nowrap"
        animate={{ x: reverse ? ["0%", "33.33%"] : ["0%", "-33.33%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 text-[11px] font-semibold tracking-widest uppercase text-white/15">
            <span className="w-1 h-1 rounded-full inline-block bg-[#09f]" />
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function SectionTag({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 mb-5"
    >
      <span className="w-4 h-px bg-[#09f]" />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#09f]">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── SVG Icons (Lucide-style, inline) ─────────────────────────────── */
const IconBrain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.58.7 3 1.81 4L12 21l6.19-9.5A5.49 5.49 0 0 0 20 7.5 5.5 5.5 0 0 0 14.5 2h-5z"/>
    <path d="M12 2v6.5"/>
    <path d="M9.5 7.5h5"/>
  </svg>
);
const IconBarChart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);
const IconTag = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l6.58-6.58a1 1 0 0 0 0-1.42L12 2Z"/><path d="M7 7h.01"/>
  </svg>
);
const IconFileText = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

const FEATURE_ICONS = [IconBrain, IconBarChart, IconTag, IconFileText];

const FEATURES = [
  { num: "01", title: "Prediksi Presisi AI", desc: "Neural network LSTM meramalkan total pengeluaran esok hari berdasarkan pola historis yang Anda catat.", tag: "LSTM", tagColor: "#09f" },
  { num: "02", title: "Live Dashboard", desc: "Visualisasi keuangan interaktif yang menampilkan grafik, KPI, dan analisis arus kas instan.", tag: "REAL-TIME", tagColor: "#22c55e" },
  { num: "03", title: "Smart Categorization", desc: "Algoritma cerdas yang mengelompokkan kategori transaksi secara otomatis dari nama transaksi.", tag: "CLASSIFIER", tagColor: "#a855f7" },
  { num: "04", title: "Ekspor & Impor Data", desc: "Download rekap dalam format DOCX siap cetak, atau unggah masal data pengeluaran via CSV.", tag: "PRODUCTIVITY", tagColor: "#f97316" },
];

const STEPS = [
  { n: "1", title: "Daftar akun", desc: "Buat akun gratis dalam 30 detik. Tanpa kartu kredit." },
  { n: "2", title: "Catat transaksi", desc: "Input pemasukan & pengeluaran, atau import via CSV." },
  { n: "3", title: "AI bekerja", desc: "Sistem menganalisis pola dan membuat prediksi otomatis." },
  { n: "4", title: "Ambil keputusan", desc: "Gunakan insight untuk menabung lebih efisien." },
];

const BARS = [30, 55, 40, 75, 48, 63, 38, 80, 45, 58, 42, 70, 52, 47, 85, 35, 60, 44, 72, 50];

/* ========================================================================= */

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden select-none relative"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", scrollBehavior: "smooth" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        h1, h2, h3, h4, .font-display { font-family: 'Outfit', sans-serif !important; }
        @keyframes shine { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes star-movement-bottom { 0% { transform: translate(0%, 0%); opacity: 1; } 100% { transform: translate(-100%, 0%); opacity: 0; } }
        @keyframes star-movement-top { 0% { transform: translate(0%, 0%); opacity: 1; } 100% { transform: translate(100%, 0%); opacity: 0; } }
        ::selection { background: rgba(0,153,255,0.25); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #09f; border-radius: 2px; }
      `}</style>

      {/* Fuzzy Overlay / Grain */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

      {/* ColorBends Background */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <ColorBends
          colors={["#2220d0", "#8a5cff", "#00ffd1"]}
          rotation={90} speed={0.2} scale={1} frequency={1}
          warpStrength={1} mouseInfluence={1} noise={0.15}
          parallax={0.5} iterations={1} intensity={1.5}
          bandWidth={6} transparent={true} autoRotate={0}
        />
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] pointer-events-none" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING PILL NAVBAR (React Bits style)
         ═══════════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <motion.nav
          animate={{
            backgroundColor: scrolled ? "rgba(15,15,15,0.85)" : "rgba(15,15,15,0.5)",
            borderColor: scrolled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
            width: scrolled ? "720px" : "800px",
            paddingTop: scrolled ? "10px" : "14px",
            paddingBottom: scrolled ? "10px" : "14px",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between px-5 rounded-2xl border backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{ maxWidth: "100%", width: 800 }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer group shrink-0">
            <img src="/logo.png" alt="ArthaWise Logo" className="h-8 object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[["#fitur", "Fitur"], ["#cara-kerja", "Cara Kerja"], ["#statistik", "Statistik"]].map(([href, label]) => (
              <a key={label} href={href} className="px-3.5 py-1.5 text-[13px] font-medium text-white/50 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/login" className="hidden sm:block px-3.5 py-1.5 text-[13px] font-medium text-white/50 hover:text-white transition-colors cursor-pointer">
              Masuk
            </Link>
            <Link href="/register" className="px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-200">
              Daftar
            </Link>
          </div>
        </motion.nav>
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center px-6 pt-32 pb-24 z-10" style={{ minHeight: "100dvh" }}>
        <motion.div style={{ y: heroY, scale: heroScale, opacity: heroOpacity }} className="flex flex-col items-center text-center max-w-3xl mx-auto relative z-10">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-10 cursor-default border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <span className="px-2 py-0.5 text-[10px] font-black tracking-wider uppercase bg-[#09f] text-white rounded-full">
              NEW
            </span>
            <span className="text-[12px] font-medium text-white/60">
              AI-Powered Finance Tracker
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black tracking-[-0.03em] leading-[1.05] mb-8">
            <BlurText text="Kelola keuangan dengan" delay={0.1} className="block text-white" />
            <BlurText text="kecerdasan buatan" delay={0.35} className="block text-white" />
          </h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-[16px] leading-[1.8] max-w-lg mb-12 text-white/40"
          >
            Lacak pengeluaran, dapatkan prediksi esok hari dari neural network,
            dan ambil keputusan finansial yang lebih cerdas.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <MagnetButton href="/register" className="group flex items-center gap-3 px-7 py-3 rounded-xl font-semibold text-[14px] cursor-pointer border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-200">
              Mulai Gratis
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </MagnetButton>
            <Link href="#fitur"
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-medium text-[14px] cursor-pointer border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all duration-200">
              Pelajari Fitur
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 w-full max-w-4xl mx-auto z-10"
        >
          <div className="absolute -bottom-1 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-[#050505] to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#09f]/15 blur-[120px] rounded-full pointer-events-none" />

          <TiltedCard intensity={8} className="w-full h-full">
            <SpotlightCard className="rounded-2xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-[#0A0A0A]/90 backdrop-blur-xl" spotlightColor="rgba(0,153,255,0.12)">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-1.5">
                  {["#ff5f57", "#ffbd2e", "#28c840"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                </div>
                <div className="flex-1 mx-4 px-3 py-1 rounded-md flex items-center gap-2 bg-black/40 border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#09f]" />
                  <span className="text-[10px] font-mono text-white/30">arthawise.app/dashboard</span>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { l: "Saldo Bersih", v: "Rp 4.280.000", c: "#fff", dot: "#09f" },
                    { l: "Pemasukan", v: "Rp 9.800.000", c: "#22c55e", dot: "#22c55e" },
                    { l: "Pengeluaran", v: "Rp 5.520.000", c: "#f43f5e", dot: "#f43f5e" },
                  ].map((k, idx) => (
                    <motion.div
                      key={k.l}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + idx * 0.1 }}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: k.dot }} />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{k.l}</span>
                      </div>
                      <div className="text-base font-black" style={{ color: k.c }}>{k.v}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-white/40">Pengeluaran Harian</span>
                    </div>
                    <div className="flex items-end gap-0.5 h-16">
                      {BARS.map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 1.6 + i * 0.02, duration: 0.4, ease: "easeOut" }}
                          style={{ originY: 1, height: `${h}%`, background: i === BARS.length - 1 ? "#09f" : `rgba(0,153,255,${0.1 + h / 250})`, borderRadius: "2px 2px 0 0" }}
                          className="flex-1"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-[11px] font-bold text-white/40 block mb-3">Prediksi Besok</span>
                    <div className="text-2xl font-black text-[#09f]">Rp 52.400</div>
                    <div className="text-[11px] text-white/30 mt-1">± Rp 5.718 MAE</div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </TiltedCard>
        </motion.div>
      </section>

      {/* TICKER */}
      <div className="relative z-10 border-y border-white/5 bg-white/[0.01]">
        <Marquee />
        <div className="border-t border-white/5"><Marquee reverse /></div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES — Bento Grid with SVG Icons
         ═══════════════════════════════════════════════════════════════ */}
      <section id="fitur" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <SectionTag label="Fitur Unggulan" />
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
              <span className="text-white">Bukan pencatat biasa.</span><br />
              <span className="text-white/30">Asisten finansial AI.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-5 auto-rows-[260px]">
            {FEATURES.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <motion.div
                  key={f.num}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`relative group ${i === 0 ? "md:col-span-4 md:row-span-2" : i === 1 ? "md:col-span-2" : i === 2 ? "md:col-span-2" : "md:col-span-6"}`}
                >
                  <SpotlightCard className="relative h-full p-8 rounded-2xl cursor-pointer border border-white/8 bg-[#0A0A0A]/70 backdrop-blur-sm transition-all duration-300 hover:border-white/15 flex flex-col justify-between overflow-hidden" spotlightColor={`${f.tagColor}20`}>
                    
                    {/* Corner glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                      style={{ background: f.tagColor }} />

                    <div className="flex items-start justify-between mb-5 relative z-10">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/8 bg-white/[0.03]" style={{ color: f.tagColor }}>
                        <Icon />
                      </div>
                      <span className="text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full"
                        style={{ background: `${f.tagColor}15`, color: f.tagColor, border: `1px solid ${f.tagColor}30` }}>
                        {f.tag}
                      </span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight group-hover:text-[#09f] transition-colors duration-200">{f.title}</h3>
                      <p className="text-[14px] leading-relaxed text-white/40 max-w-sm">{f.desc}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CARD SWAP — WHY ARTHAWISE
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <SectionTag label="Kenapa ArthaWise?" />
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1.1] mb-6">
                <span className="text-white">Satu platform,</span><br />
                <span className="text-white/30">semua kebutuhan.</span>
              </h2>
              <p className="text-[15px] leading-[1.8] text-white/40 max-w-md mb-8">
                Dari pencatatan harian hingga prediksi AI esok hari — semuanya terintegrasi dalam satu dashboard yang elegan.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#09f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: "Cepat & Ringan", desc: "Interface responsif tanpa loading lama"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#09f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    title: "Aman & Privat", desc: "Data terenkripsi, hanya Anda yang bisa akses"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#09f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    ),
                    title: "Insight Instan", desc: "AI langsung memberikan analisis begitu data masuk"
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-default">
                    <div className="mt-0.5 p-1.5 rounded-md bg-[#09f]/10 border border-[#09f]/20">{item.icon}</div>
                    <div>
                      <div className="text-[14px] font-bold text-white mb-0.5">{item.title}</div>
                      <div className="text-[13px] text-white/40">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: CardSwap */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden md:block"
              style={{ height: 500 }}
            >
              <CardSwap
                cardDistance={65}
                verticalDistance={80}
                delay={4000}
                pauseOnHover={true}
                width={600}
                height={420}
              >
                <Card className="p-6 flex flex-col justify-between">
                  <div className="text-[#09f] text-[11px] font-bold tracking-widest uppercase mb-3">Prediksi AI</div>
                  <div>
                    <div className="text-2xl font-black text-white mb-1">Rp 52.400</div>
                    <div className="text-[13px] text-white/40">Estimasi pengeluaran besok. Margin error (MAE): ± Rp 6.100</div>
                  </div>
                </Card>
                <Card className="p-6 flex flex-col justify-between">
                  <div className="text-[#22c55e] text-[11px] font-bold tracking-widest uppercase mb-3">Ringkasan Bulan Ini</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] text-white/40 mb-1">Pemasukan</div>
                      <div className="text-lg font-black text-[#22c55e]">Rp 9.8jt</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-white/40 mb-1">Pengeluaran</div>
                      <div className="text-lg font-black text-[#f43f5e]">Rp 5.5jt</div>
                    </div>
                  </div>
                  <div className="text-[13px] text-white/40 mt-4">Anda hemat <span className="text-[#22c55e] font-bold">43%</span> bulan ini</div>
                </Card>
                <Card className="p-6 flex flex-col justify-between">
                  <div className="text-[#a855f7] text-[11px] font-bold tracking-widest uppercase mb-3">Top Kategori</div>
                  <div className="space-y-3">
                    {[["Makanan", 42, "#09f"], ["Transport", 28, "#a855f7"], ["Hiburan", 18, "#f97316"]].map(([name, pct, clr]) => (
                      <div key={name as string}>
                        <div className="flex justify-between text-[12px] mb-1"><span className="text-white/60">{name}</span><span className="text-white/30">{pct}%</span></div>
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: clr as string }} /></div>
                      </div>
                    ))}
                  </div>
                </Card>
              </CardSwap>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
         ═══════════════════════════════════════════════════════════════ */}
      <section id="cara-kerja" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <SectionTag label="Cara Kerja" />
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em]">
              <BlurText text="Mulai dalam 4 langkah" delay={0.2} />
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="absolute top-5 left-0 right-0 h-px hidden md:block bg-gradient-to-r from-transparent via-[#09f]/30 to-transparent origin-left z-0"
            />

            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative flex flex-col items-center text-center z-10"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-6 bg-[#050505] text-[#09f] border border-[#09f]/30">
                  {s.n}
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/40">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATS
         ═══════════════════════════════════════════════════════════════ */}
      <section id="statistik" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { to: 160, suffix: "+", label: "Transaksi Dianalisis" },
              { to: 2, suffix: " Model", label: "Algoritma AI Aktif" },
              { to: 1, suffix: " Hari", label: "Horizon Prediksi" },
              { to: 100, suffix: "%", label: "Data Terenkripsi" },
            ].map((s) => (
              <SpotlightCard key={s.label} className="text-center p-8 rounded-2xl bg-[#0A0A0A]/60 border border-white/8 hover:border-white/15 transition-colors">
                <div className="text-4xl md:text-5xl font-black mb-3 text-white">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-[12px] font-semibold tracking-wider uppercase text-[#09f]">{s.label}</div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-36 px-6 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,153,255,0.08)_0%,transparent_70%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <SectionTag label="Mulai Hari Ini" />
          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[1] mb-8">
            <span className="text-white">Ambil kendali</span><br />
            <ShinyText text="finansial Anda." className="text-[#09f]" />
          </h2>
          <p className="text-[16px] mb-12 max-w-md mx-auto leading-[1.75] text-white/40">
            Bergabung sekarang dan biarkan AI bekerja untuk masa depan keuangan yang lebih baik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <MagnetButton href="/register"
              className="group flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-[15px] cursor-pointer bg-[#09f] text-black hover:bg-[#09f]/90 shadow-[0_0_40px_rgba(0,153,255,0.25)] hover:shadow-[0_0_60px_rgba(0,153,255,0.4)] transition-all duration-300">
              Buat Akun Gratis
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </MagnetButton>
          </div>
        </motion.div>
      </section>

      {/* Footer spacer */}
      <div className="h-20 relative z-10" />
    </div>
  );
}
