import { PrismaClient } from "@prisma/client";
import { ArrowLeft, Search, Filter } from "lucide-react";
import Link from "next/link";
import { ShipmentTable } from "@/components/admin/ShipmentTable";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

import { SearchInput } from "@/components/admin/SearchInput";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminShipmentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || "";
  
  const shipments = await prisma.shipment.findMany({
    where: query ? {
      OR: [
        { trackingNo: { contains: query, mode: 'insensitive' } },
        { destCity: { contains: query, mode: 'insensitive' } },
      ]
    } : undefined,
    orderBy: { createdAt: "desc" },
    include: { sender: true }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black transition mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-display font-bold tracking-tight">All Shipments</h1>
          <p className="text-zinc-500 font-medium text-lg mt-1">Manage and track all system shipments.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <SearchInput />
          <button className="p-2.5 rounded-xl border border-black/10 bg-white border-black/5 hover:bg-zinc-50 text-zinc-600 transition flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ScrollReveal delay={0.1}>
        <ShipmentTable shipments={JSON.parse(JSON.stringify(shipments))} />
      </ScrollReveal>
    </div>
  );
}
