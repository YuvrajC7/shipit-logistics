import { PrismaClient } from "@prisma/client";
import { Users, Search, Plus, User as UserIcon, Shield, Truck, Briefcase } from "lucide-react";
import { AddUserForm } from "@/components/admin/AddUserForm";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: [
      { role: "asc" },
      { fullName: "asc" }
    ]
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN": return { icon: Shield, bg: "bg-purple-100 text-purple-700 border-purple-200" };
      case "DISPATCHER": return { icon: Briefcase, bg: "bg-blue-100 text-blue-700 border-blue-200" };
      case "DRIVER": return { icon: Truck, bg: "bg-amber-100 text-amber-700 border-amber-200" };
      default: return { icon: UserIcon, bg: "bg-zinc-100 text-zinc-700 border-zinc-200" }; // CUSTOMER
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">User Management</h1>
          <p className="text-zinc-500 font-medium text-lg mt-1">Manage staff, drivers, and customers.</p>
        </div>
        <AddUserForm />
      </div>

      <div className="bg-white border-black/5 rounded-[2rem] border border-black/5 shadow-xl shadow-black/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-black/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">User</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                const Icon = roleBadge.icon;
                return (
                  <tr key={user.id} className="hover:bg-zinc-50/50 transition group cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-black text-sm font-bold shrink-0">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-zinc-600">{user.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleBadge.bg}`}>
                        <Icon className="w-3 h-3" /> {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-black/5 bg-zinc-50/50 flex justify-between items-center text-sm font-medium text-zinc-500">
          <div>Showing {users.length} users</div>
        </div>
      </div>
    </div>
  );
}
