"use client";

import { useState } from "react";
import { assignDriverAction } from "@/app/dispatcher/actions";
import { Loader2, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

type Driver = {
  id: string;
  user: {
    fullName: string;
    phone: string | null;
  };
  licenseNo: string;
};

export default function AssignDriverButton({ shipmentId, trackingNo, availableDrivers }: { shipmentId: string, trackingNo: string, availableDrivers: Driver[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string>("");

  const handleAssign = async () => {
    if (!selectedDriver) return;
    setLoading(true);
    await assignDriverAction(shipmentId, selectedDriver);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-6 py-3 w-full sm:w-auto rounded-xl bg-black text-white font-bold text-sm hover:bg-zinc-800 transition shadow-lg shadow-black/10">
          Assign Driver
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl z-50 w-full max-w-md animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold font-display">Assign to {trackingNo}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-zinc-100 rounded-full transition"><X className="w-5 h-5 text-zinc-500" /></button>
            </Dialog.Close>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
            {availableDrivers.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 bg-zinc-50 rounded-xl border border-black/5">
                No available drivers currently.
              </div>
            ) : (
              availableDrivers.map(driver => (
                <label key={driver.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition cursor-pointer ${selectedDriver === driver.id ? 'border-[#C70E20] bg-red-50/30' : 'border-black/5 hover:border-black/10'}`}>
                  <input type="radio" name="driver" className="hidden" checked={selectedDriver === driver.id} onChange={() => setSelectedDriver(driver.id)} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedDriver === driver.id ? 'border-[#C70E20]' : 'border-zinc-300'}`}>
                    {selectedDriver === driver.id && <div className="w-2.5 h-2.5 bg-[#C70E20] rounded-full" />}
                  </div>
                  <div>
                    <div className="font-bold text-black">{driver.user.fullName}</div>
                    <div className="text-sm font-medium text-zinc-500">{driver.licenseNo}</div>
                  </div>
                </label>
              ))
            )}
          </div>

          <div className="mt-6">
            <button 
              onClick={handleAssign} 
              disabled={loading || !selectedDriver}
              className="w-full bg-[#C70E20] text-white font-bold py-3.5 rounded-xl transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Assignment"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
