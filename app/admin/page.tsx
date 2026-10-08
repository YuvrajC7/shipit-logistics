import { PrismaClient } from "@prisma/client";
import { Users, Truck, Package, Activity, ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const stats = await Promise.all([
    prisma.user.count(),
    prisma.shipment.count(),
    prisma.vehicle.count(),
    prisma.driver.count()
  ]);

  const recentShipments = await prisma.shipment.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { sender: true }
  });

  const cards = [
    { title: "Total Users", value: stats[0], icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { title: "Total Shipments", value: stats[1], icon: Package, color: "text-[#C70E20]", bg: "bg-[#C70E20]/5", border: "border-[#C70E20]/10" },
    { title: "Active Vehicles", value: stats[2], icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "Active Drivers", value: stats[3], icon: Activity, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-display font-bold mb-3 tracking-tight">Platform Overview</h1>
        <p className="text-zinc-500 font-medium text-lg">Welcome to the SwiftFreight Admin Control Center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`p-8 rounded-[2rem] bg-white border-black/5 border border-black/5 flex flex-col gap-6 relative overflow-hidden group hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.02] transition duration-300`}>
            <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.border} border flex items-center justify-center`}>
              <card.icon className={`w-7 h-7 ${card.color}`} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-500 mb-1 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-4xl font-display font-black tracking-tight">{card.value}</h3>
            </div>
            <div className="absolute top-6 right-6 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
               <ArrowUpRight className="w-6 h-6 text-zinc-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 p-8 rounded-[2rem] bg-white border-black/5 border border-black/5 shadow-xl shadow-black/[0.02]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold">Recent Shipments</h2>
            <Link href="/admin/shipments" className="text-sm font-bold text-[#C70E20] hover:text-[#A00B1A] transition bg-[#C70E20]/5 px-4 py-2 rounded-lg">View All</Link>
          </div>
          <div className="space-y-4">
            {recentShipments.map(ship => (
              <div key={ship.id} className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50 border border-black/5 hover:border-black/10 hover:bg-white border-black/5 transition group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white border-black/5 border border-black/5 flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                    <Package className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-0.5">{ship.trackingNo}</div>
                    <div className="text-sm font-semibold text-zinc-500 flex items-center gap-2">
                       {ship.originCity} <ArrowRight className="w-3 h-3 text-zinc-600" /> {ship.destCity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold">{ship.sender.fullName}</div>
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">Sender</div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                    ship.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    ship.status === 'IN_TRANSIT' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                    'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {ship.status.replace("_", " ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-[#C70E20] border border-[#C70E20] text-black relative overflow-hidden shadow-2xl shadow-[#C70E20]/20 flex flex-col">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white border-black/5/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <h2 className="text-2xl font-display font-bold mb-2 relative z-10">System Status</h2>
          <p className="text-black/80 font-medium mb-10 relative z-10">All systems are fully operational.</p>
          
          <div className="space-y-6 relative z-10 flex-1">
            <div className="flex justify-between items-center pb-5 border-b border-white/20">
              <span className="text-black/80 font-semibold">API Latency</span>
              <span className="font-bold text-lg">24ms</span>
            </div>
            <div className="flex justify-between items-center pb-5 border-b border-white/20">
              <span className="text-black/80 font-semibold">Database Load</span>
              <span className="font-bold text-lg">12%</span>
            </div>
            <div className="flex justify-between items-center pb-5 border-b border-white/20">
              <span className="text-black/80 font-semibold">Active Workers</span>
              <span className="font-bold text-lg">8/8</span>
            </div>
          </div>
          
          <button className="w-full py-4 mt-8 bg-white border-black/5 text-[#C70E20] font-bold rounded-xl shadow-lg hover:bg-zinc-50 transition relative z-10">
             Run Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
