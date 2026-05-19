export default function HeroSection() {
  return (
    <section className="text-center pt-20 sm:pt-24 pb-6 sm:pb-8">
      <h1
        className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #334155 40%, #6366f1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        FileMorph
      </h1>
      <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
        轻量、快速、优雅的文件格式转换工具
      </p>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {['Word', 'PPT', 'PDF', '图片'].map((t) => (
          <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/70 text-slate-500 border border-slate-200/60 shadow-sm">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}
