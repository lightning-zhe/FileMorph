import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SourceFormat, TargetFormat } from './types';
import { detectSourceFormat } from './lib/conversions';
import { useConverter } from './hooks/useConverter';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UploadZone from './components/UploadZone';
import FormatSelector from './components/FormatSelector';
import ConvertButton from './components/ConvertButton';
import ResultPanel from './components/ResultPanel';
import { cn } from './lib/utils';
import { ArrowRight } from 'lucide-react';

const SUPPORTED = [
  { from: 'DOCX', to: 'PDF', trigger: 'docx' },
  { from: 'PDF', to: 'DOCX', trigger: 'pdf' },
  { from: 'PDF', to: 'PNG', trigger: 'pdf' },
  { from: 'PPTX', to: 'PDF', trigger: 'pptx' },
  { from: 'PPTX', to: 'PNG', trigger: 'pptx' },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<TargetFormat | null>(null);
  const { status, result, error, convert, reset } = useConverter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('shared') !== '1') return;
    window.history.replaceState({}, '', '/');
    fetch('/pending-share')
      .then((res) => {
        if (!res.ok) return;
        const disposition = res.headers.get('content-disposition') || '';
        const match = disposition.match(/filename="?(.+?)"?$/);
        const name = match?.[1] || 'shared-file';
        return res.blob().then((blob) => handleSelectFile(new File([blob], name)));
      })
      .catch(() => {});
  }, []);

  const sourceFormat: SourceFormat | null = useMemo(
    () => (file ? detectSourceFormat(file.name) : null),
    [file],
  );

  const handleSelectFile = (f: File) => { setFile(f); setTargetFormat(null); reset(); };
  const handleConvert = () => { if (file && targetFormat) convert(file, targetFormat); };
  const handleReset = () => { setTargetFormat(null); reset(); };

  const handleFormatTap = (trigger: string, to: TargetFormat) => {
    if (!file || detectSourceFormat(file.name) !== trigger) {
      // Suggest opening the file picker
      const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
      if (input) input.click();
      return;
    }
    setTargetFormat(to);
  };

  const isBusy = status === 'waking';
  const canConvert = file !== null && targetFormat !== null && !isBusy;
  const showForm = status !== 'success';
  const step = file ? (targetFormat ? (status === 'success' ? 3 : 2) : 1) : 0;

  return (
    <div className="min-h-dvh bg-slate-50">
      <Navbar />

      <motion.div {...fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <HeroSection />
      </motion.div>

      <main className="max-w-lg mx-auto px-5 pb-10">
        {/* Main card */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] border border-white/60 bg-white/75 backdrop-blur-xl shadow-xl shadow-slate-200/50 p-5 sm:p-6 space-y-5"
        >
          <UploadZone file={file} onSelect={handleSelectFile} disabled={isBusy} />

          {sourceFormat && showForm && (
            <FormatSelector sourceFormat={sourceFormat} value={targetFormat} onChange={setTargetFormat} disabled={isBusy} />
          )}

          {sourceFormat && targetFormat && showForm && (
            <ConvertButton onClick={handleConvert} disabled={!canConvert} waking={isBusy} />
          )}

          {status === 'error' && (
            <motion.div {...fadeUp} className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={reset} className="mt-2 text-sm text-red-600 underline hover:no-underline">重试</button>
            </motion.div>
          )}

          {status === 'success' && result && (
            <ResultPanel result={result} onNewConversion={handleReset} />
          )}
        </motion.div>

        {/* Format badges — interactive pills */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 overflow-x-auto hide-scrollbar"
        >
          <div className="flex items-center justify-center gap-1.5 min-w-max px-2">
            {SUPPORTED.map((s) => {
              const isActive = sourceFormat === s.trigger && targetFormat === s.to;
              return (
                <button
                  key={s.from + s.to}
                  onClick={() => handleFormatTap(s.trigger, s.to as TargetFormat)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow-sm shrink-0 transition-all duration-200 active:scale-95',
                    isActive
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'bg-white/70 border-slate-200/70 text-slate-500 hover:border-slate-300 hover:bg-white',
                  )}
                >
                  {s.from}
                  <ArrowRight className="h-2.5 w-2.5 text-slate-300" />
                  {s.to}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex items-center justify-center gap-2 text-[13px] text-slate-400"
        >
          {[
            { n: 1, label: '选文件' },
            { n: 2, label: '转格式' },
            { n: 3, label: '下载' },
          ].map((s, i, arr) => (
            <span key={s.n} className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold transition-all duration-300',
                    step >= s.n
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400',
                  )}
                >
                  {step > s.n ? (
                    <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    s.n
                  )}
                </span>
                <span className={cn('transition-colors duration-300', step >= s.n ? 'text-slate-600 font-medium' : 'text-slate-400')}>
                  {s.label}
                </span>
              </span>
              {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />}
            </span>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
