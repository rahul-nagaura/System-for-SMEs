export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-[#141414] font-sans flex flex-col pt-20">
      {/* Skeleton Navbar */}
      <div className="fixed top-0 w-full z-50 bg-white border-b border-[#d8d8d8] h-20 flex items-center justify-between px-6 md:px-12">
        <div className="w-40 h-6 bg-zinc-200 rounded animate-pulse"></div>
        <div className="hidden md:flex gap-8 items-center">
          <div className="w-16 h-4 bg-zinc-200 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-zinc-200 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-zinc-200 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-zinc-200 rounded animate-pulse"></div>
        </div>
        <div className="w-36 h-10 bg-zinc-200 rounded animate-pulse"></div>
      </div>

      {/* Skeleton Hero Section */}
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 md:px-12 py-12 md:py-24 space-y-12">
        <div className="space-y-6 max-w-3xl">
          {/* Eyebrow */}
          <div className="w-48 h-4 bg-zinc-200 rounded animate-pulse"></div>
          {/* Headline */}
          <div className="space-y-3">
            <div className="w-full md:w-3/4 h-12 bg-zinc-200 rounded animate-pulse"></div>
            <div className="w-2/3 h-12 bg-zinc-200 rounded animate-pulse"></div>
          </div>
          {/* Subtext */}
          <div className="space-y-2 pt-2">
            <div className="w-full h-4 bg-zinc-200 rounded animate-pulse"></div>
            <div className="w-5/6 h-4 bg-zinc-200 rounded animate-pulse"></div>
          </div>
          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <div className="w-full sm:w-52 h-14 bg-zinc-200 rounded animate-pulse"></div>
            <div className="w-full sm:w-52 h-14 bg-zinc-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-[#d8d8d8] p-6 space-y-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-4 h-4 bg-zinc-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="w-full h-3 bg-zinc-200 rounded animate-pulse"></div>
                <div className="w-full h-3 bg-zinc-200 rounded animate-pulse"></div>
                <div className="w-2/3 h-3 bg-zinc-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 bg-zinc-200 rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <div className="w-24 h-3 bg-zinc-200 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-zinc-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
