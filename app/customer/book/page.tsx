import { Package, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { bookShipment } from "./actions";

export const dynamic = 'force-dynamic';

export default function CustomerBookPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <Link href="/customer" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black font-semibold text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-display font-bold tracking-tight">Book a Shipment</h1>
        <p className="text-zinc-500 font-medium text-lg mt-2">Enter details below to generate a new shipment. Our system will automatically calculate the best rate.</p>
      </div>
      
      <div className="bg-white rounded-[2rem] border border-black/5 p-8 md:p-12 shadow-xl shadow-black/[0.02]">
        <form action={bookShipment} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 border-b border-black/5 pb-2">
              <Package className="w-4 h-4" /> Routing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-600 mb-2">Origin City *</label>
                <input required name="originCity" type="text" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition outline-none" placeholder="e.g. Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-600 mb-2">Destination City *</label>
                <input required name="destCity" type="text" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition outline-none" placeholder="e.g. Bangalore" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 border-b border-black/5 pb-2">
              Receiver Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-600 mb-2">Full Name *</label>
                <input required name="receiverName" type="text" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-600 mb-2">Phone Number *</label>
                <input required name="receiverPhone" type="tel" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition outline-none" placeholder="+91 9876543210" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 border-b border-black/5 pb-2">
              Package Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-600 mb-2">Weight (kg) *</label>
                <input required name="weightKg" type="number" step="0.1" min="0.1" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition outline-none" placeholder="5.5" />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-600 mb-2">Service Type *</label>
                <select required name="serviceType" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition outline-none bg-white">
                  <option value="STANDARD">Standard (3-5 days)</option>
                  <option value="EXPRESS">Express (1-2 days) - 1.5x Rate</option>
                  <option value="SAME_DAY">Same Day - 2.5x Rate</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-600 mb-2">Description / Notes (Optional)</label>
              <textarea name="notes" rows={3} className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 focus:border-[#C70E20] transition outline-none" placeholder="Handle with care, fragile items inside..."></textarea>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#C70E20] hover:bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-black/10">
            <Send className="w-5 h-5" /> Calculate Rate & Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
