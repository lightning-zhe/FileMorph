import { useState } from 'react';
import { Download, CheckCircle2, Package, Share2, Loader2 } from 'lucide-react';
import type { ConversionResult } from '../types';
import { getDownloadUrl } from '../lib/api';
import { cn } from '../lib/utils';

function truncateName(name: string, max = 16): string {
  if (name.length <= max) return name;
  const dot = name.lastIndexOf('.');
  if (dot < 0) return name.slice(0, max - 1) + '…';
  const ext = name.slice(dot);
  return name.slice(0, Math.max(3, max - ext.length - 1)) + '…' + ext;
}

interface Props {
  result: ConversionResult;
  onNewConversion: () => void;
}

async function shareFile(url: string, filename: string) {
  const fullUrl = getDownloadUrl(url) + '?name=' + encodeURIComponent(filename);

  // Try file share
  try {
    const res = await fetch(fullUrl);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: blob.type || 'application/octet-stream' });
    await navigator.share({ files: [file], title: filename });
    return;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return;
  }

  // Fallback: share URL
  try {
    await navigator.share({ url: fullUrl, title: filename });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return;
    await navigator.clipboard.writeText(fullUrl);
  }
}

function ShareButton({ url, filename }: { url: string; filename: string }) {
  const [sharing, setSharing] = useState(false);
  const handle = async () => { setSharing(true); await shareFile(url, filename); setSharing(false); };
  if (typeof navigator === 'undefined' || !navigator.share) return null;

  return (
    <button
      onClick={handle}
      disabled={sharing}
      className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 active:scale-[0.97] transition-all duration-150 shrink-0"
    >
      {sharing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
      转发
    </button>
  );
}

function DownloadBtn({ url, name, variant }: { url: string; name: string; variant: 'primary' | 'ghost' }) {
  const href = getDownloadUrl(url) + '?name=' + encodeURIComponent(name);
  return (
    <a href={href} download className="flex-1">
      <button
        className={cn(
          'w-full h-12 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-[0.97] inline-flex items-center justify-center gap-2',
          variant === 'primary'
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5'
            : 'border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 shadow-sm',
        )}
      >
        {variant === 'primary' ? <Download className="h-4 w-4 shrink-0" /> : <Package className="h-4 w-4" />}
        <span className="truncate">{variant === 'primary' ? `下载 ${truncateName(name)}` : name}</span>
      </button>
    </a>
  );
}

export default function ResultPanel({ result, onNewConversion }: Props) {
  const ext = result.output_extension;
  const downloadName = result.original_filename.replace(/\.[^.]+$/, '') + '.' + ext;
  const isMulti = result.result_type === 'multiple_images' && result.files.length > 1;

  return (
    <div className="space-y-4">
      {/* Success badge with pop animation */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 backdrop-blur-sm px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-check-pop" />
        <span className="text-sm font-semibold text-emerald-700">转换完成</span>
      </div>

      {/* Multi-image grid */}
      {isMulti && (
        <div className="animate-fade-slide-up stagger-1 space-y-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {result.files.map((f) => (
                <div key={f.page} className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                  <img src={getDownloadUrl(f.download_url)} alt={`Page ${f.page}`} className="w-full h-20 object-cover" />
                  <div className="px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">第 {f.page} 页</span>
                    <div className="flex items-center gap-1">
                      <ShareButton url={f.download_url} filename={f.filename} />
                      <a href={getDownloadUrl(f.download_url) + '?name=' + encodeURIComponent(f.filename)} download className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium">下载</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {result.zip_url && (
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <DownloadBtn url={result.zip_url} name="下载全部 ZIP" variant="ghost" />
                <ShareButton url={result.zip_url} filename={downloadName.replace(/\.[^.]+$/, '.zip')} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Single file */}
      {!isMulti && (
        <div className="animate-fade-slide-up stagger-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <DownloadBtn url={result.download_url} name={downloadName} variant="primary" />
            <ShareButton url={result.download_url} filename={downloadName} />
          </div>
        </div>
      )}

      {/* New conversion */}
      <button
        onClick={onNewConversion}
        className="w-full h-11 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100/60 active:scale-[0.98] transition-all duration-150 animate-fade-slide-up stagger-2"
      >
        转换新文件
      </button>
    </div>
  );
}
