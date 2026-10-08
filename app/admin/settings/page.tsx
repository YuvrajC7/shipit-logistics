import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Platform Settings</h1>
          <p className="text-zinc-500 font-medium text-lg mt-1">Configure global application settings.</p>
        </div>
        <button className="bg-black hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-black/5 p-8 shadow-xl shadow-black/[0.02]">
        <h2 className="text-xl font-bold mb-6">General Preferences</h2>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-bold text-zinc-600 mb-2">Platform Name</label>
            <input type="text" defaultValue="SwiftFreight" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-600 mb-2">Support Email</label>
            <input type="email" defaultValue="support@swiftfreight.com" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
