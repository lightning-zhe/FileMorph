export default function HeroSection() {
  return (
    <section className="text-center pt-16 sm:pt-24 pb-4 sm:pb-8 animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
        FileMorph
      </h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
        轻量、快速、优雅的文件格式转换工具
      </p>
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400">
        支持 Word &middot; PPT &middot; PDF &middot; 图片
      </p>
    </section>
  );
}
