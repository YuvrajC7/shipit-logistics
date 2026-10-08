import { Package } from "lucide-react";

export default function DispatcherShipmentsPage() {
  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Active Shipments</h1>
        <p className="text-zinc-500 font-medium text-lg mt-1">Dispatch and assign available shipments.</p>
      </div>
      <div className="bg-white rounded-[2rem] border border-black/5 p-16 text-center shadow-xl shadow-black/[0.02]">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
          <Package className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-display font-bold mb-2">No Active Shipments</h3>
        <p className="text-zinc-500">There are no pending shipments waiting for dispatch right now.</p>
      </div>
    </div>
  );
}
