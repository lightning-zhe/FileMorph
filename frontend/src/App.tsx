import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SourceFormat, TargetFormat } from './types';
import { detectSourceFormat } from './lib/conversions';
import { useConverter } from './hooks/useConverter';
import { imagesToPdf } from './lib/api';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UploadZone from './components/UploadZone';
import FormatSelector from './components/FormatSelector';
import ConvertButton from './components/ConvertButton';
import ResultPanel from './components/ResultPanel';
import ImagePreviewGrid from './components/ImagePreviewGrid';
import MorphCat from './components/MorphCat';
import { cn } from './lib/utils';
import { ArrowRight } from 'lucide-react';

const SUPPORTED = [
  { from: 'DOCX', to: 'PDF', trigger: 'docx' },
  { from: 'DOCX', to: 'HTML', trigger: 'docx' },
  { from: 'PDF', to: 'DOCX', trigger: 'pdf' },
  { from: 'PDF', to: 'PNG', trigger: 'pdf' },
  { from: 'PPTX', to: 'PDF', trigger: 'pptx' },
  { from: 'PPTX', to: 'PNG', trigger: 'pptx' },
  { from: '图片', to: 'PDF', trigger: 'image' },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<TargetFormat | null>(null);
  const { status, result, error, convert, reset } = useConverter();
  const [imageStatus, setImageStatus] = useState<'idle' | 'waking' | 'success' | 'error'>('idle');
  const [imageResult, setImageResult] = useState<any>(null);
  const [imageError, setImageError] = useState('');

  const isImageMode = imageFiles.length > 0;
  const formatRowRef = useRef<HTMLDivElement>(null);

  const scrollFormat = (dir: 'left' | 'right') => {
    formatRowRef.current?.scrollBy({ left: dir === 'left' ? -60 : 60, behavior: 'smooth' });
  };

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
    () => isImageMode ? 'image' : (file ? detectSourceFormat(file.name) : null),
    [file, isImageMode],
  );

  const handleSelectFile = (f: File) => {
    setFile(f);
    setImageFiles([]);
    setTargetFormat(null);
    reset();
    resetImages();
  };

  const handleSelectMultiple = (fs: File[]) => {
    if (fs.length === 0) return;
    // If single non-image file, route to document flow
    if (fs.length === 1 && detectSourceFormat(fs[0].name) !== 'image') {
      handleSelectFile(fs[0]);
      return;
    }
    setImageFiles(fs);
    setFile(null);
    setTargetFormat('image-pdf' as TargetFormat);
    reset();
    resetImages();
  };

  const handleRemoveImage = (i: number) => {
    const next = imageFiles.filter((_, idx) => idx !== i);
    if (next.length === 0) { resetAll(); return; }
    setImageFiles(next);
  };

  const handleConvert = () => {
    if ((!file && !isImageMode) || !targetFormat) return;
    if (isImageMode) {
      convertImages();
    } else {
      convert(file!, targetFormat);
    }
  };

  const convertImages = useCallback(async () => {
    setImageStatus('waking');
    setImageError('');
    setImageResult(null);
    try {
      const data = await imagesToPdf(imageFiles);
      setImageResult(data);
      setImageStatus('success');
    } catch (e) {
      setImageError(e instanceof Error ? e.message : 'Conversion failed');
      setImageStatus('error');
    }
  }, [imageFiles]);

  const handleReset = () => {
    if (isImageMode) {
      resetImages();
    } else {
      setTargetFormat(null);
      reset();
    }
  };

  const resetImages = () => {
    setImageStatus('idle');
    setImageResult(null);
    setImageError('');
  };

  const resetAll = () => {
    setFile(null);
    setImageFiles([]);
    setTargetFormat(null);
    reset();
    resetImages();
  };

  const handleFormatTap = (trigger: string, to: TargetFormat) => {
    if (trigger === 'image') {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
      if (input) { input.accept = '.png,.jpg,.jpeg,.webp'; input.multiple = true; input.click(); }
      return;
    }
    if (!file || detectSourceFormat(file.name) !== trigger) {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
      if (input) { input.accept = '.docx,.pptx,.pdf,.png,.jpg,.jpeg'; input.multiple = false; input.click(); }
      return;
    }
    setTargetFormat(to);
  };

  const isBusy = status === 'waking' || imageStatus === 'waking';
  const hasSource = isImageMode || file !== null;
  const canConvert = hasSource && targetFormat !== null && !isBusy;
  const showForm = (status !== 'success' && imageStatus !== 'success');
  const step = hasSource ? (targetFormat ? ((status === 'success' || imageStatus === 'success') ? 3 : 2) : 1) : 0;
  const showCat = !targetFormat && !isBusy && status !== 'success' && imageStatus !== 'success';

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col">
      <Navbar />

      <motion.div {...fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <HeroSection />
      </motion.div>

      <main className="flex-1 flex flex-col items-center px-5 max-w-[720px] mx-auto">
        {/* Main card */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 w-full rounded-[28px] border border-white/60 bg-white/75 backdrop-blur-xl shadow-xl shadow-slate-200/50 p-5 space-y-4"
        >
          <UploadZone
            file={file}
            files={imageFiles}
            onSelect={handleSelectFile}
            onSelectMultiple={handleSelectMultiple}
            disabled={isBusy}
            multiple={!file}
          />

          {/* Image mode: preview grid */}
          {isImageMode && (
            <ImagePreviewGrid files={imageFiles} onRemove={handleRemoveImage} />
          )}

          {/* Image mode: auto-set target, show convert button */}
          {isImageMode && showForm && (
            <ConvertButton onClick={handleConvert} disabled={!canConvert} waking={imageStatus === 'waking'} />
          )}

          {/* Image mode: error */}
          {imageStatus === 'error' && (
            <motion.div {...fadeUp} className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3">
              <p className="text-sm text-red-700">{imageError}</p>
              <button onClick={resetImages} className="mt-2 text-sm text-red-600 underline hover:no-underline">重试</button>
            </motion.div>
          )}

          {/* Image mode: success */}
          {imageStatus === 'success' && imageResult && (
            <ResultPanel
              result={{
                result_type: 'single_file',
                source_format: 'image',
                target_format: 'image-pdf' as any,
                download_url: imageResult.download_url,
                original_filename: 'images.pdf',
                output_extension: 'pdf',
                files: [],
                zip_url: null,
              }}
              onNewConversion={resetAll}
            />
          )}

          {/* Non-image flow — keep existing */}
          {!isImageMode && (
            <>
              {sourceFormat && showForm && sourceFormat !== 'image' && (
                <FormatSelector sourceFormat={sourceFormat} value={targetFormat} onChange={setTargetFormat} disabled={isBusy} />
              )}

              {sourceFormat && targetFormat && showForm && sourceFormat !== 'image' && (
                <ConvertButton onClick={handleConvert} disabled={!canConvert} waking={status === 'waking'} />
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
            </>
          )}
        </motion.div>

        {/* Format badges */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 w-full relative"
        >
          {/* Left scroll arrow — desktop only */}
          <button
            onClick={() => scrollFormat('left')}
            className="hidden md:flex absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {/* Right scroll arrow — desktop only */}
          <button
            onClick={() => scrollFormat('right')}
            className="hidden md:flex absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div ref={formatRowRef} className="overflow-x-auto hide-scrollbar">
            <div className="flex items-center justify-center gap-1.5 min-w-max px-6">
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
          </div>
        </motion.div>

        {/* Empty state mascot */}
        {showCat && (
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12"
          >
            <MorphCat hint={hasSource && !targetFormat} />
          </motion.div>
        )}

        {/* Step indicator */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 pb-6 flex items-center justify-center gap-2 text-[13px] text-slate-400"
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
