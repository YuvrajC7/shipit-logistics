import { PrismaClient } from "@prisma/client";
import { Package, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function DriverHistoryPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const pastShipments = await prisma.shipment.findMany({
    where: { 
      driverId: user.id,
      status: 'DELIVERED'
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Trip History</h1>
        <p className="text-zinc-500 font-medium text-lg mt-1">Your past completed deliveries.</p>
      </div>
      
      <div className="bg-white border-black/5 rounded-[2rem] border border-black/5 overflow-hidden shadow-xl shadow-black/[0.02]">
        <div className="divide-y divide-black/5">
          {pastShipments.map(ship => (
            <div key={ship.id} className="p-8 hover:bg-zinc-50 transition flex flex-col md:flex-row gap-6 justify-between items-center group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl tracking-tight mb-2">{ship.trackingNo}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {ship.originCity} → {ship.destCity}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Delivered {new Date(ship.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Earned</p>
                <p className="text-2xl font-black text-emerald-400">₹{Number(ship.charge || 0) * 0.15}</p>
              </div>
            </div>
          ))}

          {pastShipments.length === 0 && (
            <div className="p-20 text-center text-zinc-500">
              <Package className="w-16 h-16 mx-auto mb-6 opacity-20" strokeWidth={1} />
              <h3 className="text-2xl font-display font-bold mb-2">No Past Trips</h3>
              <p className="font-medium text-lg">You haven't completed any trips yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
