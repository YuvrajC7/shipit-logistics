"use client";

import { useState, useTransition } from "react";
import { Plus, X, User as UserIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { addUserAction } from "@/app/admin/users/actions";

export function AddUserForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await addUserAction(formData);
        setOpen(false);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-[#C70E20] hover:bg-[#A00B1A] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-[fadeIn_0.2s_ease-out]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
          <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center shadow-sm">
                <UserIcon className="w-5 h-5 text-[#C70E20]" />
              </div>
              <Dialog.Title className="text-xl font-display font-bold tracking-tight">New User Account</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-100 transition">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Full Name</label>
              <input name="fullName" required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition-all font-medium" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Email Address</label>
              <input name="email" type="email" required placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition-all font-medium" />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Temporary Password</label>
              <input name="password" type="text" required defaultValue="password123" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition-all font-mono text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Role</label>
              <select name="role" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition-all font-bold text-sm">
                <option value="CUSTOMER">Customer</option>
                <option value="DRIVER">Driver</option>
                <option value="DISPATCHER">Dispatcher</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isPending} className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                {isPending ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
