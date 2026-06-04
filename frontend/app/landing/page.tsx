"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";

/* =========================================================================
   REACT BITS INSPIRED COMPONENTS 
   https://reactbits.dev/
========================================================================= */

/* ─── BlurText: Kata muncul dari blur ───────────────────────────────── */
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

/* ─── ShinyText: Teks dengan gradient shimmer ───────────────────────── */
const ShinyText = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
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
};

/* ─── SpotlightCard: Kartu dengan efek senter di background ─────────── */
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

/* ─── MagnetButton: Tombol yang tertarik ke arah kursor ─────────────── */
const MagnetButton = ({ children, className = "", href }: { children: React.ReactNode, className?: string, href: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <Link href={href} ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} className={`inline-block ${className}`}>
        {children}
      </Link>
    </motion.div>
  );
};

/* ─── ColorBends Background ───────────────────────── */
import ColorBends from "@/components/ColorBends";
import { StarBorder } from "@/components/StarBorder";
import { TiltedCard } from "@/components/TiltedCard";

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
          <span key={i} className="inline-flex items-center gap-3 px-6 text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}>
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: "#09f" }} />
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
      <span className="w-4 h-px" style={{ background: "#09f" }} />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#09f" }}>
        {label}
      </span>
    </motion.div>
  );
}

const FEATURES = [
  { num: "01", title: "Prediksi Presisi AI", desc: "Neural network LSTM meramalkan total pengeluaran esok hari berdasarkan pola historis yang Anda catat.", tag: "LSTM", tagColor: "#09f" },
  { num: "02", title: "Live Dashboard", desc: "Visualisasi keuangan interaktif yang menampilkan grafik, KPI, dan analisis arus kas instan.", tag: "REAL-TIME", tagColor: "#22c55e" },
  { num: "03", title: "Smart Categorization", desc: "Algoritma cerdas yang dapat mengelompokkan kategori transaksi secara otomatis dari nama transaksi.", tag: "CLASSIFIER", tagColor: "#a855f7" },
  { num: "04", title: "Ekspor & Impor Data", desc: "Download rekap dalam format DOCX siap cetak, atau unggah masal data pengeluaran via CSV.", tag: "PRODUCTIVITY", tagColor: "#f97316" },
];

const STEPS = [
  { n: "1", title: "Daftar akun", desc: "Buat akun gratis dalam 30 detik. Tidak perlu kartu kredit." },
  { n: "2", title: "Catat transaksi", desc: "Input pemasukan & pengeluaran, atau import via CSV sekaligus." },
  { n: "3", title: "AI bekerja", desc: "Sistem menganalisis pola dan membuat prediksi otomatis." },
  { n: "4", title: "Ambil keputusan", desc: "Gunakan insight untuk menabung lebih efisien." },
];

const BARS = [30,55,40,75,48,63,38,80,45,58,42,70,52,47,85,35,60,44,72,50];

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
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes star-movement-bottom { 0% { transform: translate(0%, 0%); opacity: 1; } 100% { transform: translate(-100%, 0%); opacity: 0; } }
        @keyframes star-movement-top { 0% { transform: translate(0%, 0%); opacity: 1; } 100% { transform: translate(100%, 0%); opacity: 0; } }
        ::selection { background: rgba(245,158,11,0.25); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #F59E0B; border-radius: 2px; }
      `}</style>

      {/* Fuzzy Overlay / Grain (Modern Texture) */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

      {/* React Bits: Color Bends Background */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <ColorBends
          colors={["#2220d0", "#8a5cff", "#00ffd1"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent={true}
          autoRotate={0}
        />
        {/* Latar Hitam Mesh */}
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] pointer-events-none" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714558603/grid_1_h5jymt.png')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none mix-blend-overlay" />
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(5,5,5,0.7)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center cursor-pointer group">
            <img src="/logo.png" alt="ArthaWise Logo" className="h-10 object-contain transition-transform group-hover:scale-105" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[["#fitur", "Fitur"], ["#cara-kerja", "Cara Kerja"], ["#statistik", "Statistik"]].map(([href, label]) => (
              <motion.a key={label} href={href} whileHover={{ color: "#fff" }} className="px-4 py-2 text-[13px] font-medium rounded-lg transition-colors cursor-pointer"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                {label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-[13px] font-medium transition-colors hover:text-white cursor-pointer"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              Masuk
            </Link>
            <MagnetButton href="/register" className="group flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold cursor-pointer transition-all bg-white text-black hover:bg-white/90">
              Mulai Gratis
            </MagnetButton>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-24 z-10">
        <motion.div style={{ y: heroY, scale: heroScale, opacity: heroOpacity }} className="flex flex-col items-center text-center max-w-4xl mx-auto relative z-10 mt-12">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
            className="flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8 cursor-default border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-[#09f]" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/80">
              <ShinyText text="AI-Powered · LSTM · Classifier" />
            </span>
          </motion.div>

          <h1 className="text-[clamp(3.5rem,9vw,7.5rem)] font-black tracking-[-0.04em] leading-[0.95] mb-8">
            <BlurText text="Finansial Anda," delay={0.1} className="block text-white" />
            <BlurText text="Lebih Cerdas" delay={0.3} className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]" />
            <BlurText text="dari Sebelumnya." delay={0.5} className="block text-white/30" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-[16px] leading-[1.75] max-w-xl mb-10 text-white/40"
          >
            Platform manajemen keuangan personal bertenaga AI. Lacak pengeluaran, ramal masa depan finansial,
            dan dapatkan insight cerdas secara real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center gap-6 mb-6"
          >
            <StarBorder color="#F59E0B" speed="3s">
              <MagnetButton href="/register" className="group flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-[14px] cursor-pointer bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-white/10 text-white shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:shadow-[0_0_60px_rgba(245,158,11,0.3)] transition-all">
                Mulai Gratis Sekarang
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </MagnetButton>
            </StarBorder>
            <Link href="/login"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-[14px] cursor-pointer border border-white/10 text-white/50 hover:bg-white/5 transition-colors">
              Sudah punya akun →
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-24 w-full max-w-4xl mx-auto z-10"
        >
          <div className="absolute -bottom-1 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-[#050505] to-transparent" />
          
          {/* Glowing Aura Behind Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#F59E0B]/20 blur-[120px] rounded-full pointer-events-none" />

          <TiltedCard intensity={10} className="w-full h-full">
            <SpotlightCard className="rounded-2xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-[#0A0A0A]/80 backdrop-blur-xl" spotlightColor="rgba(245,158,11,0.15)">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-1.5">
                  {["#ff5f57","#ffbd2e","#28c840"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                </div>
                <div className="flex-1 mx-4 px-3 py-1 rounded-md flex items-center gap-2 bg-black/40 border border-white/5 shadow-inner">
                  <motion.div animate={{ opacity: [1,0.3,1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-[10px] font-mono text-white/30">arthawise.app/dashboard</span>
                </div>
              </div>

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

      {/* FEATURES */}
      <section id="fitur" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
            <div>
              <SectionTag label="Fitur Unggulan" />
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
                <span className="text-white">Bukan pencatat biasa.</span><br />
                <span className="text-white/30">Asisten finansial AI.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[280px]">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={i === 0 ? "md:col-span-4 md:row-span-2 relative group" : i === 1 ? "md:col-span-2 md:row-span-1 relative group" : i === 2 ? "md:col-span-2 md:row-span-1 relative group" : "md:col-span-6 md:row-span-1 relative group"}
              >
                {/* Glowing Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 to-[#8B5CF6]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
                
                <SpotlightCard className="relative h-full p-8 rounded-3xl cursor-pointer border border-white/10 bg-[#0F172A]/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/50 flex flex-col justify-between overflow-hidden">
                  
                  {/* Decorative Gradient Blob Inside Card */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#F59E0B]/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <span className="text-sm font-black tracking-widest text-[#F59E0B] font-display">{f.num}</span>
                    <span className="text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      style={{ background: `${f.tagColor}20`, color: f.tagColor, border: `1px solid ${f.tagColor}40` }}>
                      {f.tag}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-display font-black text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F59E0B] group-hover:to-white transition-all duration-300">{f.title}</h3>
                    <p className="text-[15px] leading-relaxed text-white/50 max-w-sm">{f.desc}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
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
              className="absolute top-5 left-0 right-0 h-px hidden md:block bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left z-0"
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
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-6 bg-black text-white border border-white/20">
                  {s.n}
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/40">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="statistik" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { to: 160, suffix: "+", label: "Transaksi Dianalisis" },
              { to: 2, suffix: " Model", label: "Algoritma AI Aktif" },
              { to: 1, suffix: " Hari", label: "Horizon Prediksi" },
              { to: 100, suffix: "%", label: "Data Terenkripsi" },
            ].map((s, i) => (
              <SpotlightCard key={s.label} className="text-center p-8 rounded-3xl bg-[#0F172A]/40 border border-white/10 hover:border-[#F59E0B]/30 transition-colors">
                <div className="text-5xl md:text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-[13px] font-semibold tracking-wider uppercase text-[#F59E0B]">{s.label}</div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-36 px-6 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)]" />
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
            <ShinyText text="finansial Anda." className="text-[#F59E0B]" />
          </h2>
          <p className="text-[16px] mb-12 max-w-md mx-auto leading-[1.75] text-white/40">
            Bergabung sekarang dan biarkan AI bekerja untuk masa depan keuangan yang lebih baik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <StarBorder color="#F59E0B" speed="2s" className="hover:scale-105 transition-transform duration-300">
              <MagnetButton href="/register"
                className="group flex items-center gap-3 px-12 py-5 rounded-xl font-bold text-[16px] text-black cursor-pointer bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] shadow-[0_0_60px_rgba(245,158,11,0.4)]">
                Buat Akun Gratis Sekarang
              </MagnetButton>
            </StarBorder>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
