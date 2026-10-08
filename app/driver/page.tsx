import { PrismaClient } from "@prisma/client";
import { MapPin, Navigation, PackageCheck, AlertCircle, ArrowRight } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

import { FramerGlass } from "@/components/ui/FramerGlass";

export const dynamic = 'force-dynamic';

export default async function DriverDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const driver = await prisma.driver.findUnique({
    where: { id: user.id },
    include: {
      shipments: {
        where: { status: { in: ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] } },
        orderBy: { eta: "asc" }
      }
    }
  });

  if (!driver) return <div className="p-10 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100">Driver profile not found. Please contact dispatch.</div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-display font-bold mb-3 tracking-tight">My Active Trips</h1>
        <p className="text-zinc-500 font-medium text-lg">Manage your current deliveries and routes.</p>
      </div>

      <FramerGlass />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-8 rounded-[2rem] ${driver.availability ? 'bg-[#C70E20] border-[#C70E20] text-white' : 'bg-white border-black/5 text-black'} border relative overflow-hidden shadow-2xl shadow-black/10`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <p className="opacity-80 text-sm font-bold uppercase tracking-widest mb-2 relative z-10">Status</p>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`w-4 h-4 rounded-full border-2 border-white/20 ${driver.availability ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <h3 className="text-4xl font-display font-black tracking-tight">{driver.availability ? 'Available' : 'Off Duty'}</h3>
          </div>
        </div>
        
        <div className="p-8 rounded-[2rem] bg-white border-black/5 border border-black/5 shadow-xl shadow-black/[0.02]">
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Active Deliveries</p>
          <h3 className="text-4xl font-display font-black tracking-tight">{driver.shipments.length}</h3>
        </div>

        <div className="p-8 rounded-[2rem] bg-white border-black/5 border border-black/5 shadow-xl shadow-black/[0.02]">
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Total Completed</p>
          <h3 className="text-4xl font-display font-black tracking-tight">{driver.totalTrips}</h3>
        </div>
      </div>

      <div className="bg-white border-black/5 border border-black/5 rounded-[2rem] overflow-hidden shadow-xl shadow-black/[0.02]">
        <div className="p-8 border-b border-black/5 bg-zinc-50">
          <h2 className="font-display font-bold text-2xl">Current Route Queue</h2>
        </div>
        
        <div className="divide-y divide-black/5">
          {driver.shipments.map(ship => (
            <div key={ship.id} className="p-8 hover:bg-zinc-50 transition">
              <div className="flex flex-col lg:flex-row gap-8 justify-between">
                
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display font-black text-2xl tracking-tight">{ship.trackingNo}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-200">
                      {ship.status.replace("_", " ")}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 rounded-2xl bg-zinc-50 border border-black/5">
                    <div className="space-y-1.5">
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Receiver</p>
                      <p className="text-base font-bold">{ship.receiverName}</p>
                      <p className="text-sm font-semibold text-zinc-500">{ship.receiverPhone}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Destination</p>
                      <p className="text-base font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#C70E20]" /> {ship.destCity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[240px] justify-center">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(ship.originCity)}&destination=${encodeURIComponent(ship.destCity)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition shadow-lg shadow-black/10"
                  >
                    <Navigation className="w-5 h-5" /> Navigate
                  </a>
                  
                  <form action={async (formData) => {
                    "use server";
                    const { advanceShipmentStatus } = await import("./actions");
                    await advanceShipmentStatus(formData);
                  }}>
                    <input type="hidden" name="shipmentId" value={ship.id} />
                    <input type="hidden" name="currentStatus" value={ship.status} />
                    <input type="hidden" name="destCity" value={ship.destCity} />
                    <button type="submit" className="w-full py-4 rounded-xl bg-white border-black/5 text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-100 transition border border-black/10 shadow-sm">
                      <PackageCheck className="w-5 h-5 text-[#C70E20]" /> 
                      {ship.status === 'OUT_FOR_DELIVERY' ? 'Mark Delivered' : 'Mark Out for Delivery'}
                    </button>
                  </form>
                </div>
                
              </div>
            </div>
          ))}

          {driver.shipments.length === 0 && (
            <div className="p-20 text-center text-zinc-500">
              <AlertCircle className="w-16 h-16 mx-auto mb-6 opacity-20" strokeWidth={1} />
              <p className="font-medium text-lg">No active deliveries assigned to you right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
