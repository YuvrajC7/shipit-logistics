"use client";

import { TopNav } from "./TopNav";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageSearch, PlusCircle, Settings } from "lucide-react";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/customer", label: "My Shipments", icon: PackageSearch },
    { href: "/customer/book", label: "Book New", icon: PlusCircle },
    { href: "/customer/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-black font-sans relative overflow-x-hidden selection:bg-[#C70E20]/20">
      {/* Soft background glow effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#C70E20]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C70E20]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <TopNav theme="transparent" />

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row gap-12">
        
        {/* Floating Sidebar Menu for Customer */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 shrink-0"
        >
          <nav className="flex flex-col gap-2 sticky top-32">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                      ? 'bg-white text-[#C70E20] shadow-xl shadow-black/[0.03] scale-105' 
                      : 'text-zinc-500 hover:text-black hover:bg-black/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#C70E20]' : 'opacity-70'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </motion.aside>

        {/* Page Content Wrapped in Page Transition */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>

      </main>
    </div>
  );
}
