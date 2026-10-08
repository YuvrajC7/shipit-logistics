"use client";

import { TopNav } from "./TopNav";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RadioReceiver, Package, Map } from "lucide-react";

export function DispatcherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/dispatcher", label: "Cockpit", icon: RadioReceiver },
    { href: "/dispatcher/shipments", label: "Queue", icon: Package },
    { href: "/dispatcher/map", label: "Fleet Map", icon: Map },
  ];

  return (
    <div className="h-screen flex flex-col bg-zinc-100 text-black font-sans overflow-hidden">
      <TopNav />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Thin left rail */}
        <aside className="w-20 bg-black flex flex-col items-center py-6 gap-6 shrink-0 z-20 shadow-2xl">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                title={link.label}
                className="relative flex items-center justify-center w-12 h-12 rounded-xl transition-all group"
              >
                {isActive && (
                  <motion.div 
                    layoutId="dispatcher-active"
                    className="absolute inset-0 bg-[#C70E20] rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
              </Link>
            );
          })}
        </aside>

        {/* Edge-to-edge scrollable main content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full"
          >
            {/* Inner padding applied by pages, not layout, to allow full-bleed maps */}
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
