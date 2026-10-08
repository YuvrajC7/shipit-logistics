"use client";
import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";

const ShipmentMap = dynamic(() => import("@/components/admin/ShipmentMap"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-sm text-zinc-500">Loading Fleet Engine...</div> 
});

export default function DispatcherMapPage() {
  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Live Fleet Map</h1>
        <p className="text-zinc-500 font-medium text-lg mt-1">Real-time tracking of active shipments.</p>
      </div>
      <div className="flex-1 bg-zinc-200 rounded-[2rem] border border-black/10 overflow-hidden relative min-h-[500px]">
        <ShipmentMap origin="Mumbai" dest="Delhi" />
        <div className="absolute top-6 left-6 z-[400] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-black/5">
          <h3 className="font-bold text-sm flex items-center gap-2"><MapIcon className="w-4 h-4 text-[#C70E20]" /> Fleet View Active</h3>
          <p className="text-xs text-zinc-500 mt-1">OpenStreetMap (No API Key Required)</p>
        </div>
      </div>
    </div>
  );
}
