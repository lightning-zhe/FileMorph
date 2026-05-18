import { ArrowRightLeft, Github } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-slate-900 hover:opacity-80 transition-opacity">
          <ArrowRightLeft className="h-5 w-5" />
          <span className="text-base font-semibold tracking-tight">FileMorph</span>
        </a>

        {/* Right placeholder */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </nav>
  );
}
