import { PrismaClient } from "@prisma/client";
import { Truck, Activity, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function DispatcherDashboard() {
  const [vehicles, activeShipments, idleDrivers] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.shipment.findMany({
      where: { status: { in: ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] } },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.driver.count({ where: { availability: true } })
  ]);

  const onTrip = vehicles.filter(v => v.status === 'ON_TRIP').length;
  const maintenance = vehicles.filter(v => v.status === 'MAINTENANCE').length;
  const available = vehicles.filter(v => v.status === 'AVAILABLE').length;

  return (
    <div className="space-y-10 p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-bold mb-3 tracking-tight">Dispatch Center</h1>
        <p className="text-zinc-500 font-medium text-lg">Monitor fleet health and active shipments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-8 rounded-[2rem] bg-[#C70E20] border border-[#C70E20] relative overflow-hidden text-white md:col-span-2 shadow-2xl shadow-[#C70E20]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2 relative z-10">Active Operations</p>
          <div className="flex items-end gap-4 relative z-10 mt-4">
            <h3 className="text-7xl font-display font-black tracking-tight">{activeShipments.length}</h3>
            <p className="text-white/90 pb-2 font-medium text-lg">shipments in progress</p>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-xl shadow-black/[0.02]">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
            <Truck className="w-7 h-7 text-blue-600" />
          </div>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Fleet Available</p>
          <h3 className="text-4xl font-display font-black tracking-tight">{available} / {vehicles.length}</h3>
        </div>

        <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-xl shadow-black/[0.02]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
            <Activity className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Idle Drivers</p>
          <h3 className="text-4xl font-display font-black tracking-tight">{idleDrivers}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-[2rem] overflow-hidden shadow-xl shadow-black/[0.02]">
          <div className="p-8 border-b border-black/5 flex justify-between items-center bg-zinc-50">
            <h2 className="font-display font-bold text-2xl text-[#C70E20] flex items-center gap-3">
               <AlertTriangle className="w-6 h-6" /> Action Required: Unassigned Shipments
            </h2>
          </div>
          <div className="divide-y divide-black/5">
            {activeShipments.filter(s => !s.driverId).map(ship => (
              <div key={ship.id} className="p-6 hover:bg-zinc-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">{ship.trackingNo}</div>
                    <div className="text-sm font-semibold text-zinc-500 flex items-center gap-2">
                       {ship.originCity} <ArrowRight className="w-3 h-3 text-zinc-300" /> {ship.destCity}
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 w-full sm:w-auto rounded-xl bg-black text-white font-bold text-sm hover:bg-zinc-800 transition shadow-lg shadow-black/10">
                  Assign Driver
                </button>
              </div>
            ))}
            {activeShipments.filter(s => !s.driverId).length === 0 && (
              <div className="p-16 text-center text-zinc-500">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="font-bold text-lg">No unassigned shipments.</p>
                <p className="text-sm">Everything is running smoothly.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-xl shadow-black/[0.02]">
          <h2 className="font-display font-bold text-2xl mb-8">Fleet Status</h2>
          
          <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div>
              <div className="flex justify-between text-sm mb-3 font-bold">
                <span className="text-zinc-500 uppercase tracking-widest">On Trip</span>
                <span className="text-black text-lg">{onTrip}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full bg-[#C70E20] rounded-full" style={{ width: `${(onTrip / vehicles.length) * 100}%` }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-3 font-bold">
                <span className="text-zinc-500 uppercase tracking-widest">Available</span>
                <span className="text-black text-lg">{available}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(available / vehicles.length) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-3 font-bold">
                <span className="text-zinc-500 uppercase tracking-widest">Maintenance</span>
                <span className="text-black text-lg">{maintenance}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(maintenance / vehicles.length) * 100}%` }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
