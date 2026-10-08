"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function SearchInput({ placeholder = "Search tracking..." }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (val) params.set("q", val);
      else params.delete("q");
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isPending ? 'text-[#C70E20] animate-pulse' : 'text-zinc-500'}`} />
      <input 
        type="text" 
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
        className="pl-9 pr-4 py-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] text-sm font-medium w-full md:w-64 transition-all"
      />
    </div>
  );
}
