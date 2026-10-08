"use client";

import { TopNav } from "./TopNav";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation, History } from "lucide-react";

export function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/driver", label: "Active", icon: Navigation },
    { href: "/driver/history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-black font-sans pb-24 md:pb-0 relative overflow-hidden">
      {/* Truck Theme Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

      <TopNav theme="transparent" />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-black/5 px-6 py-4 flex justify-around items-center z-50 md:hidden pb-safe">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#C70E20]' : 'text-zinc-500 hover:text-black transition'}`}
            >
              <div className={`p-2 rounded-xl ${isActive ? 'bg-[#C70E20]/10' : ''}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop side nav is hidden since mobile-first, but we can put it here if needed */}
      <div className="hidden md:flex flex-col fixed top-1/2 left-8 -translate-y-1/2 gap-4">
         {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all shadow-xl shadow-black/[0.02] ${isActive ? 'bg-[#C70E20] text-white scale-110 shadow-[#C70E20]/20' : 'bg-white border border-black/5 text-zinc-500 hover:text-black hover:bg-zinc-50'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
