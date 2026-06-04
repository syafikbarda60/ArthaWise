"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#09090b]">
      {/* Dynamic Ambient Glows */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-[0.15] blur-[120px] mix-blend-screen pointer-events-none"
        style={{
          background: "radial-gradient(circle, #2563eb 0%, rgba(37, 99, 235, 0) 70%)",
        }}
      />

      <motion.div 
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[10%] right-[5%] w-[50%] h-[60%] rounded-full opacity-[0.12] blur-[140px] mix-blend-screen pointer-events-none"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, rgba(139, 92, 246, 0) 70%)",
        }}
      />

      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[30%] left-[25%] w-[40%] h-[40%] rounded-full opacity-[0.1] blur-[100px] mix-blend-screen pointer-events-none"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 212, 0) 70%)",
        }}
      />

      {/* Subtle dot grid - much less intrusive than line grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
