"use client";

import { TopNav } from "./TopNav";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Truck, Package } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/fleet", label: "Fleet", icon: Truck },
    { href: "/admin/shipments", label: "Shipments", icon: Package },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-black font-sans relative overflow-x-hidden selection:bg-[#C70E20]/30">
      {/* Truck Theme Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C70E20]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

      <TopNav theme="transparent" />

      {/* Horizontal Sub-Navigation for Admin */}
      <div className="bg-white/70 backdrop-blur-xl sticky top-[88px] z-40 shadow-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative px-6 py-4 flex items-center gap-2 font-bold text-sm transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#C70E20]' : 'text-zinc-500 hover:text-black'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C70E20]' : ''}`} />
                {link.label}
                {isActive && (
                  <motion.div 
                    layoutId="admin-nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C70E20]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
