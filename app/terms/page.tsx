import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#EDF1F4] flex flex-col items-center justify-center p-8">
      <div className="bg-white p-12 max-w-2xl w-full border-4 border-black text-center space-y-6">
        <h1 className="text-6xl font-display font-black uppercase tracking-tight">terms</h1>
        <p className="text-xl font-medium text-gray-600">This page is under construction.</p>
        <div className="pt-8">
          <Link href="/" className="bg-[#C70E20] hover:bg-[#A00B1A] text-white px-8 py-4 font-bold uppercase tracking-widest transition-colors inline-block">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
