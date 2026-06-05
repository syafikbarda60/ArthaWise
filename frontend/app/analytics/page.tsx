"use client";

import React, { useEffect, useState } from "react";
import { aiApi } from "@/lib/api";
import { ForecastDataPoint, FinancialProfile } from "@/lib/types";
import AnimatedBackground from "@/components/AnimatedBackground";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Psychology, 
  TrendingUp, 
  CheckCircle, 
  Info, 
  TrackChanges, 
  Bolt, 
  NorthEast,
  GppGood,
  AutoAwesome
} from "@mui/icons-material";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function AnalyticsPage() {
  const [forecast, setForecast] = useState<ForecastDataPoint[]>([]);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [forecastConfidence, setForecastConfidence] = useState<number>(94.2);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }
    }
    const fetchAiData = async () => {
      try {
        const [profData, forecastRes] = await Promise.all([
          aiApi.getFinancialProfile(),
          aiApi.getForecast()
        ]);
        setProfile(profData);
        setForecast(forecastRes.data);
        setForecastConfidence(forecastRes.confidence);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAiData();
  }, [router]);

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-gray-200">
      <AnimatedBackground />
      <Sidebar activeHref="/analytics" />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-4 pt-20 pb-20 lg:p-10 lg:pt-10 lg:pb-10 ml-0 md:ml-64 transition-all duration-300">
        <header className="flex justify-between items-center mb-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              AI Insights <span className="text-[10px] bg-brand-blue/20 text-brand-blue px-2 py-1 rounded-md uppercase tracking-widest font-black">Beta</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Deep analysis powered by TensorFlow LSTM & Clustering models</p>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-xl"
          >
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="text-xs font-medium text-zinc-400">Models Active</span>
          </motion.div>
        </header>
        
        <div className="flex-1 overflow-y-auto pr-2 pb-6 md:pb-10 customized-scrollbar">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-4"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-brand-blue animate-spin" />
                  <div className="absolute inset-2 rounded-full border-t-2 border-brand-purple animate-spin" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute inset-4 rounded-full border-t-2 border-brand-cyan animate-spin" style={{ animationDuration: '2s' }} />
                </div>
                <p className="text-sm font-medium text-zinc-500 animate-pulse">Consulting AI Models...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                
                {/* Clustering Profile (F-05) */}
                <motion.div 
                  variants={itemVariants}
                  className="lg:col-span-5 vui-card p-8 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 text-brand-purple/5 group-hover:text-brand-purple/10 transition-colors">
                    <Psychology style={{ fontSize: 120 }} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20 text-brand-purple shadow-xl shadow-purple-500/10">
                        <TrackChanges style={{ fontSize: 24 }} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Financial Persona</h3>
                        <div className="text-2xl font-bold text-white tracking-tight">{profile?.cluster}</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 mb-8">
                      <p className="text-sm text-zinc-300 leading-relaxed italic">
                        "{profile?.description}"
                      </p>
                    </div>
                    
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Bolt style={{ fontSize: 14 }} className="text-brand-purple" />
                      Model Characteristics
                    </h4>
                    <div className="space-y-3">
                      {profile?.characteristics.map((char, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-brand-purple/30 transition-colors group/item"
                        >
                          <CheckCircle style={{ fontSize: 16 }} className="text-brand-green" />
                          <span className="text-sm text-zinc-200">{char}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                            <GppGood style={{ fontSize: 14 }} className="text-brand-cyan" />
                          </div>
                        ))}
                      </div>
                      <button className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1">
                        RECALIBRATE PERSONA <NorthEast style={{ fontSize: 14 }} />
                      </button>
                    </div>
                  </div>
                </motion.div>
                
                {/* LSTM Forecasting (F-06) */}
                <motion.div 
                  variants={itemVariants}
                  className="lg:col-span-7 vui-card p-8 group"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20 text-brand-cyan shadow-xl shadow-cyan-500/10">
                        <TrendingUp style={{ fontSize: 24 }} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Predictive Analytics</h3>
                        <div className="text-2xl font-bold text-white tracking-tight">LSTM Spending Forecast</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-zinc-500 uppercase mb-1">Confidence</div>
                      <div className="text-lg font-black text-brand-cyan">{forecastConfidence.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  {/* Forecast display (1 day) */}
                  <div className="mt-8 flex justify-center">
                    {forecast.length > 0 ? (
                      <div className="w-full max-w-md text-center p-8 bg-zinc-900/80 rounded-3xl border border-brand-cyan/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-50" />
                        
                        <div className="relative z-10">
                          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Pengeluaran Besok</p>
                          <div className="text-5xl font-black text-white tracking-tighter mb-2">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(forecast[0].predicted_expense)}
                          </div>
                          <p className="text-xs text-brand-cyan font-bold bg-brand-cyan/10 inline-block px-3 py-1 rounded-full">
                            Tingkat Akurasi (MAE): Tinggi
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center text-zinc-500 text-sm">Belum ada prediksi</div>
                    )}
                  </div>
                  
                  <div className="mt-10 grid grid-cols-1 gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 flex gap-4 items-center">
                      <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                        <Info style={{ fontSize: 18 }} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Status Pengeluaran</div>
                        <div className="text-sm font-bold text-white">
                          Berdasarkan pola 14 hari terakhir, Anda diprediksi melakukan pengeluaran besok. Siapkan dana!
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl flex gap-3">
                    <Info style={{ fontSize: 16 }} className="text-brand-blue shrink-0 mt-0.5" />
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      This sequence was computed using a <strong>Long Short-Term Memory (LSTM)</strong> recurrent neural network, trained on your last 90 days of transaction metadata. Predictions are updated every 24 hours.
                    </p>
                  </div>
                </motion.div>
                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
