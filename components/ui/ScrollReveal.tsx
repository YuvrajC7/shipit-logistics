"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function ScrollReveal({ children, delay = 0, yOffset = 50 }: { children: ReactNode, delay?: number, yOffset?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, rotateX: 15, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
