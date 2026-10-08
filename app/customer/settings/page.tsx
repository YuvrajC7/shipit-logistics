import { Settings, Save } from "lucide-react";

export default function CustomerSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Account Settings</h1>
        <p className="text-zinc-500 font-medium text-lg mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-black/5 p-8 shadow-xl shadow-black/[0.02] max-w-2xl">
        <h2 className="text-xl font-bold mb-6">Personal Info</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-zinc-600 mb-2">Full Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#C70E20]/20 outline-none" />
          </div>
          <button className="bg-black hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
