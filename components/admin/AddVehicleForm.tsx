"use client";

import { useState, useTransition } from "react";
import { Plus, X, Truck } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { addVehicleAction } from "@/app/admin/fleet/actions";

export function AddVehicleForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addVehicleAction(formData);
      setOpen(false);
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-[#C70E20] hover:bg-[#A00B1A] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-[fadeIn_0.2s_ease-out]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
          <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center shadow-sm">
                <Truck className="w-5 h-5 text-[#C70E20]" />
              </div>
              <Dialog.Title className="text-xl font-display font-bold tracking-tight">New Vehicle</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-100 transition">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Plate Number</label>
              <input name="plateNo" required placeholder="MH 01 AB 1234" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition-all font-mono uppercase" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">Type</label>
                <select name="type" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition-all font-semibold text-sm">
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Box Truck">Box Truck</option>
                  <option value="Semi Trailer">Semi Trailer</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">Capacity (KG)</label>
                <input name="capacity" type="number" required defaultValue="1000" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition-all font-mono" />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isPending} className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                {isPending ? 'Saving...' : 'Register Vehicle'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
