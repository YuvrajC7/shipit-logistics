"use client";

import { motion } from "framer-motion";
import { Package, Navigation, Activity } from "lucide-react";

export function FramerGlass() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className="w-full h-[200px] rounded-[2rem] overflow-hidden shadow-2xl relative mb-8 group cursor-default"
    >
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black">
        <motion.div 
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(199,14,32,0.1)_0deg,transparent_60deg,transparent_300deg,rgba(199,14,32,0.1)_360deg)] blur-2xl"
        />
      </div>

      {/* Glassmorphic Foreground Panel */}
      <div className="absolute inset-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] flex items-center justify-between p-8 z-10 overflow-hidden">
        {/* Floating background shapes inside glass */}
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-10 top-0 w-40 h-40 bg-[#C70E20]/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [20, -20, 20], y: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-10 bottom-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-white/80 font-bold uppercase tracking-widest text-sm">Live System</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-display font-black text-white tracking-tight"
          >
            Logistics Engine <span className="text-[#C70E20]">Active</span>
          </motion.h2>
        </div>

        <div className="hidden md:flex items-center gap-4 relative z-20">
          {[Package, Navigation].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (i * 0.1), type: "spring" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:bg-white/10 transition-colors"
            >
              <Icon className="w-8 h-8 text-white/70" strokeWidth={1.5} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
