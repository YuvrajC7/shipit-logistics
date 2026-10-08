import { PrismaClient } from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { MapPin, Truck, Calendar, Package, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import CustomerShipmentList from "@/components/customer/CustomerShipmentList";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function CustomerDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const shipments = await prisma.shipment.findMany({
    where: { senderId: user.id },
    orderBy: { createdAt: "desc" },
    include: { trackingEvents: { orderBy: { createdAt: "desc" }, take: 1 } }
  });

  const activeCount = shipments.filter(s => s.status !== 'DELIVERED' && s.status !== 'CANCELLED').length;
  const totalSpent = shipments.reduce((acc, s) => acc + Number(s.charge || 0), 0);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold mb-3 tracking-tight">My Shipments</h1>
          <p className="text-zinc-500 font-medium text-lg">Manage and track your active deliveries.</p>
        </div>
        <Link href="/customer/book" className="px-6 py-4 rounded-xl bg-black text-white font-bold flex items-center gap-2 hover:bg-zinc-800 transition shadow-lg shadow-black/10">
          <Package className="w-5 h-5" /> Book New Shipment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2rem] bg-white border border-black/5 flex flex-col gap-3 relative overflow-hidden group hover:border-black/10 transition shadow-xl shadow-black/[0.02]">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Active Shipments</p>
          <h3 className="text-5xl font-display font-black tracking-tight">{activeCount}</h3>
          <div className="absolute top-6 right-6 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
             <ArrowUpRight className="w-6 h-6 text-zinc-300" />
          </div>
        </div>
        <div className="p-8 rounded-[2rem] bg-white border border-black/5 flex flex-col gap-3 relative overflow-hidden group hover:border-black/10 transition shadow-xl shadow-black/[0.02]">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Total Shipments</p>
          <h3 className="text-5xl font-display font-black tracking-tight">{shipments.length}</h3>
          <div className="absolute top-6 right-6 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
             <ArrowUpRight className="w-6 h-6 text-zinc-300" />
          </div>
        </div>
        <div className="p-8 rounded-[2rem] bg-[#C70E20]/5 border border-[#C70E20]/10 flex flex-col gap-3 relative overflow-hidden">
          <p className="text-sm font-bold text-[#C70E20] uppercase tracking-widest">Total Spent (INR)</p>
          <h3 className="text-5xl font-display font-black tracking-tight text-[#C70E20]">₹{totalSpent.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-[2rem] shadow-xl shadow-black/[0.02] overflow-hidden">
        <div className="p-8 border-b border-black/5 flex justify-between items-center bg-zinc-50">
          <h2 className="font-display font-bold text-2xl">Recent Orders</h2>
        </div>
        
        <CustomerShipmentList shipments={JSON.parse(JSON.stringify(shipments))} />
      </div>
    </div>
  );
}
