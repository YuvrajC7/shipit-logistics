import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
      <Loader2 className="w-12 h-12 animate-spin text-[#C70E20]" />
      <p className="text-zinc-500 font-medium animate-pulse">Loading dashboard data...</p>
    </div>
  );
}
