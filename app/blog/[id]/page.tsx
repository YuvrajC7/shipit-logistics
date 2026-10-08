import Link from 'next/link';

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-[#EDF1F4] flex flex-col items-center justify-center p-8">
      <div className="bg-white p-12 max-w-2xl w-full border-4 border-black text-center space-y-6">
        <h1 className="text-4xl font-display font-black uppercase tracking-tight">Article: {resolvedParams.id}</h1>
        <p className="text-xl font-medium text-gray-600">Full article content goes here.</p>
        <div className="pt-8">
          <Link href="/blog" className="bg-[#C70E20] hover:bg-[#A00B1A] text-white px-8 py-4 font-bold uppercase tracking-widest transition-colors inline-block">
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
