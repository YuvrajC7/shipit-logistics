"use client";

import { createBrowserClient } from "@supabase/ssr";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function TopNav({ theme = "light" }: { theme?: "light" | "dark" | "transparent" }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-black";
  const mutedText = isDark ? "text-white/60" : "text-black/60";
  const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-black/5";

  // Derive title from pathname
  const role = pathname.split("/")[1] || "dashboard";
  const title = role.charAt(0).toUpperCase() + role.slice(1) + " Portal";

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`w-full px-8 py-6 flex items-center justify-between ${theme === 'transparent' ? '' : (isDark ? 'bg-black/95 border-b border-white/10' : 'bg-white/80 backdrop-blur-md border-b border-black/5')} z-50 sticky top-0`}
    >
      <div className="flex items-center gap-3">
        <Link href={`/${role}`} className="flex items-center gap-2 group">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="#C70E20" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform group-hover:scale-105">
            <path d="M0 0 L20 0 A12 12 0 0 1 32 12 L32 14 L12 14 A12 12 0 0 1 0 2 Z" />
            <path d="M32 32 L12 32 A12 12 0 0 1 0 20 L0 18 L20 18 A12 12 0 0 1 32 30 Z" />
          </svg>
          <span className={`font-display font-black text-[22px] tracking-wide mt-0.5 ${textColor}`}>SHIPIT</span>
        </Link>
        <span className={`font-medium ${mutedText} ml-2 tracking-normal text-lg hidden md:inline-block border-l border-current pl-3 py-1 opacity-40`}>{title}</span>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <div className="hidden md:flex items-center gap-3 mr-4">
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center`}>
              <UserIcon className={`w-5 h-5 ${mutedText}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${textColor}`}>{user.email?.split("@")[0] || "User"}</span>
              <span className={`text-xs font-semibold ${mutedText} uppercase tracking-widest`}>{role}</span>
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black text-white hover:bg-zinc-800'} transition-colors`}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.header>
  );
}
