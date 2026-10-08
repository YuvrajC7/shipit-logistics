"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Zap, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: "Admin", email: "admin@swiftfreight.com" },
    { label: "Dispatcher", email: "dispatch@swiftfreight.com" },
    { label: "Driver", email: "raj.kumar@swiftfreight.com" },
    { label: "Customer", email: "techcorp@swiftfreight.com" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Full-screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md transition-all">
          <Loader2 className="w-16 h-16 animate-spin text-[#C70E20]" strokeWidth={1.5} />
        </div>
      )}

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C70E20]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-medium text-sm bg-white border border-black/5 px-4 py-2 rounded-full shadow-sm z-20">
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Homepage
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="#C70E20" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M0 0 L20 0 A12 12 0 0 1 32 12 L32 14 L12 14 A12 12 0 0 1 0 2 Z" />
            <path d="M32 32 L12 32 A12 12 0 0 1 0 20 L0 18 L20 18 A12 12 0 0 1 32 30 Z" />
          </svg>
        </div>
        
        <div className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-2xl shadow-black/[0.04]">
          <h1 className="text-3xl font-display font-bold text-center mb-2">Welcome back</h1>
          <p className="text-zinc-500 text-center font-medium mb-8">Sign in to your SHIPIT account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-50 border border-black/10 rounded-xl px-4 py-3.5 text-black placeholder-zinc-400 font-medium focus:outline-none focus:border-[#C70E20] focus:ring-1 focus:ring-[#C70E20] transition shadow-sm"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-black/10 rounded-xl px-4 py-3.5 pr-12 text-black placeholder-zinc-400 font-medium focus:outline-none focus:border-[#C70E20] focus:ring-1 focus:ring-[#C70E20] transition shadow-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 mt-8 disabled:opacity-50 shadow-lg shadow-black/10 text-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black/5">
            <p className="text-xs font-bold text-zinc-400 mb-4 uppercase tracking-widest text-center">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map(acc => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    if(acc.label === "Admin") setPassword("Admin@1234");
                    if(acc.label === "Dispatcher") setPassword("Dispatch@1234");
                    if(acc.label === "Driver") setPassword("Driver@1234");
                    if(acc.label === "Customer") setPassword("Customer@1234");
                  }}
                  className="px-4 py-3 text-sm font-bold bg-zinc-50 hover:bg-zinc-100 border border-black/5 rounded-xl text-zinc-600 transition"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
