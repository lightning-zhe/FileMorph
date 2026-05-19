import { ArrowRightLeft, Github } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200/40 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-5">
        <a href="/" className="flex items-center gap-2 text-slate-900 hover:opacity-80 transition-opacity">
          <ArrowRightLeft className="h-[18px] w-[18px]" />
          <span className="text-[15px] font-semibold tracking-tight">FileMorph</span>
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100/80 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    </nav>
  );
}
