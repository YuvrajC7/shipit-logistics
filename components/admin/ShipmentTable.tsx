"use client";

import { useState } from "react";
import { Package, Search, Filter, X, ArrowRight, User as UserIcon, MapPin, Weight, FileText, Phone, Map } from "lucide-react";
import dynamic from "next/dynamic";
import * as Dialog from "@radix-ui/react-dialog";

const ShipmentMap = dynamic(() => import("./ShipmentMap"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-sm text-zinc-500">Loading Map Engine...</div> 
});

export function ShipmentTable({ shipments }: { shipments: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "IN_TRANSIT": return "bg-blue-100 text-blue-700 border-blue-200";
      case "FAILED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <>
      <div className="bg-white rounded-[2rem] border border-black/5 shadow-xl shadow-black/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-black/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Tracking No</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Route</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Sender</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {shipments.map((ship) => (
                <tr 
                  key={ship.id} 
                  onClick={() => setSelected(ship)}
                  className="hover:bg-zinc-50/50 transition group cursor-pointer"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-black/5 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition">
                        <Package className="w-5 h-5 text-zinc-400" />
                      </div>
                      <span className="font-bold font-mono text-sm">{ship.trackingNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span>{ship.originCity}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-300" />
                      <span>{ship.destCity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold">{ship.sender.fullName}</div>
                    <div className="text-xs text-zinc-500 font-medium">{ship.sender.email}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(ship.status)}`}>
                      {ship.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div suppressHydrationWarning className="text-sm font-semibold text-zinc-600">
                      {new Date(ship.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                </tr>
              ))}
              
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-black/5 bg-zinc-50/50 flex justify-between items-center text-sm font-medium text-zinc-500">
          <div>Showing {shipments.length} shipments</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-white border border-black/10 hover:bg-zinc-50 disabled:opacity-50">Previous</button>
            <button className="px-4 py-2 rounded-lg bg-white border border-black/10 hover:bg-zinc-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Shipment Details Modal */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-[fadeIn_0.2s_ease-out]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
            {selected && (
              <>
                <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between bg-zinc-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center shadow-sm">
                      <Package className="w-6 h-6 text-[#C70E20]" />
                    </div>
                    <div>
                      <Dialog.Title className="text-2xl font-display font-bold font-mono tracking-tight">{selected.trackingNo}</Dialog.Title>
                      <div className="text-sm font-semibold text-zinc-500 flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-widest ${getStatusColor(selected.status)}`}>
                          {selected.status}
                        </span>
                        • {new Date(selected.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-100 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Routing Info
                      </h4>
                      <div className="flex items-center gap-4 bg-zinc-50 border border-black/5 p-4 rounded-xl">
                        <div className="flex-1">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Origin</div>
                          <div className="font-bold">{selected.originCity}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-300 shrink-0" />
                        <div className="flex-1 text-right">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Destination</div>
                          <div className="font-bold">{selected.destCity}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-50 border border-black/5 p-4 rounded-xl">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Weight className="w-3 h-3" /> Weight</div>
                        <div className="font-bold">{Number(selected.weightKg).toLocaleString()} kg</div>
                      </div>
                      <div className="bg-zinc-50 border border-black/5 p-4 rounded-xl">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><FileText className="w-3 h-3" /> Charge</div>
                        <div className="font-bold">{selected.charge ? `₹${Number(selected.charge).toLocaleString()}` : 'N/A'}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" /> Parties Involved
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-black/5 pb-3">
                          <span className="text-sm font-semibold text-zinc-500">Sender</span>
                          <span className="text-sm font-bold">{selected.sender?.fullName}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-black/5 pb-3">
                          <span className="text-sm font-semibold text-zinc-500">Receiver</span>
                          <span className="text-sm font-bold">{selected.receiverName}</span>
                        </div>
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-sm font-semibold text-zinc-500 flex items-center gap-1"><Phone className="w-3 h-3" /> Receiver Phone</span>
                          <span className="text-sm font-bold">{selected.receiverPhone}</span>
                        </div>
                      </div>
                    </div>
                    
                    {selected.notes && (
                      <div>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Description / Notes
                        </h4>
                        <div className="bg-amber-50 text-amber-900 border border-amber-200 p-4 rounded-xl text-sm font-medium">
                          {selected.notes}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-[400px] lg:h-auto min-h-[400px] bg-zinc-100 rounded-2xl overflow-hidden border border-black/10 relative">
                     <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-black/5 flex items-center gap-2 text-xs font-bold">
                       <Map className="w-3 h-3 text-[#C70E20]" /> Live Route Map
                     </div>
                     <ShipmentMap origin={selected.originCity} dest={selected.destCity} />
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }
      `}} />
    </>
  );
}
