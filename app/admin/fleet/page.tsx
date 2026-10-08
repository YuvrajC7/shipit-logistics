import { PrismaClient } from "@prisma/client";
import { Truck, Plus, MapPin } from "lucide-react";
import { AddVehicleForm } from "@/components/admin/AddVehicleForm";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminFleetPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ON_TRIP": return "bg-blue-100 text-blue-700 border-blue-200";
      case "MAINTENANCE": return "bg-amber-100 text-amber-700 border-amber-200";
      case "RETIRED": return "bg-zinc-100 text-zinc-700 border-zinc-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Fleet Management</h1>
          <p className="text-zinc-500 font-medium text-lg mt-1">Manage vehicles, maintenance, and assignments.</p>
        </div>
        <AddVehicleForm />
      </div>

      <div className="bg-white border-black/5 rounded-[2rem] border border-black/5 shadow-xl shadow-black/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-black/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Capacity</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Added On</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-zinc-50/50 transition group cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-black/5 flex items-center justify-center shrink-0 group-hover:bg-white border-black/5 group-hover:shadow-sm transition text-zinc-500">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{vehicle.plateNo}</div>
                        <div className="text-xs font-medium text-zinc-500">{vehicle.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-zinc-600">{Number(vehicle.capacityKg).toLocaleString()} kg</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-600">
                      {new Date(vehicle.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
              
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    No vehicles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-black/5 bg-zinc-50/50 flex justify-between items-center text-sm font-medium text-zinc-500">
          <div>Showing {vehicles.length} vehicles</div>
        </div>
      </div>
    </div>
  );
}
