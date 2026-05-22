import { useState } from 'react';
import { Download, CheckCircle2, Share2, Loader2 } from 'lucide-react';
import type { ConversionResult } from '../types';
import { getDownloadUrl } from '../lib/api';

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

function ShareBtn({ url, filename, label }: { url: string; filename: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const handle = async () => { setBusy(true); await shareFile(url, filename); setBusy(false); };
  if (typeof navigator === 'undefined' || !navigator.share) return null;

  return (
    <button
      onClick={handle}
      disabled={busy}
      className="inline-flex items-center gap-1 h-7 px-2 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shrink-0"
    >
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Share2 className="h-3 w-3" />}
      {label}
    </button>
  );
}

async function getAllFiles(files: { download_url: string; filename: string }[]) {
  const blobs = await Promise.all(
    files.map(async (f) => {
      const fullUrl = getDownloadUrl(f.download_url) + '?name=' + encodeURIComponent(f.filename);
      const res = await fetch(fullUrl);
      return { blob: await res.blob(), name: f.filename };
    }),
  );
  return blobs.map((b) => new File([b.blob], b.name, { type: 'image/png' }));
}

function SaveAllBtn({ files }: { files: { download_url: string; filename: string }[] }) {
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    setBusy(true);
    try { await navigator.share({ files: await getAllFiles(files) }); } catch {}
    setBusy(false);
  };
  if (typeof navigator === 'undefined' || !navigator.share) return null;

  return (
    <button
      onClick={handle}
      disabled={busy}
      className="w-full sm:flex-1 max-w-xs sm:max-w-none mx-auto sm:mx-0 h-14 rounded-xl bg-indigo-50 border border-indigo-200 text-[15px] font-semibold text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
    >
      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
      保存/转发全部
    </button>
  );
}

function truncName(name: string, max = 20): string {
  if (name.length <= max) return name;
  const dot = name.lastIndexOf('.');
  if (dot < 0) return name.slice(0, max - 1) + '…';
  const ext = name.slice(dot);
  return name.slice(0, Math.max(3, max - ext.length - 1)) + '…' + ext;
}

const isMobile = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;

function SaveFileBtn({ url, filename, label }: { url: string; filename: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const handle = async () => { setBusy(true); await shareFile(url, filename); setBusy(false); };
  const href = getDownloadUrl(url) + '?name=' + encodeURIComponent(filename);
  const cls = 'w-full h-14 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white font-semibold text-[15px] shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 overflow-hidden';

  // Desktop: direct download link
  if (!isMobile) {
    return (
      <a href={href} download className={cls}>
        <Download className="h-5 w-5 shrink-0" />
        <span className="truncate">{label || '下载'}</span>
      </a>
    );
  }

  // Mobile: share sheet
  return (
    <button onClick={handle} disabled={busy} className={cls}>
      {busy ? <Loader2 className="h-5 w-5 animate-spin shrink-0" /> : <Share2 className="h-5 w-5 shrink-0" />}
      <span className="truncate">{label || '保存'}</span>
    </button>
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
                  <img src={getDownloadUrl(f.download_url)} alt={`第 ${f.page} 页`} className="w-full h-28 object-cover" />
                  <div className="p-2 space-y-2">
                    <span className="block text-[11px] text-slate-500 font-medium text-center">第 {f.page} 页</span>
                    <div className="flex items-center justify-center">
                      {isMobile ? (
                        <ShareBtn url={f.download_url} filename={f.filename} label="保存/转发" />
                      ) : (
                        <a href={getDownloadUrl(f.download_url) + '?name=' + encodeURIComponent(f.filename)} download className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shrink-0">
                          <Download className="h-3 w-3" /> 下载
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {result.zip_url && (
              <div className="mt-3">
                {isMobile ? (
                  <SaveAllBtn files={result.files} />
                ) : (
                  <a href={getDownloadUrl(result.zip_url) + '?name=' + encodeURIComponent(downloadName.replace(/\.[^.]+$/, '.zip'))} download>
                    <button className="w-full h-14 rounded-xl bg-indigo-50 border border-indigo-200 text-[15px] font-semibold text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all inline-flex items-center justify-center gap-2">
                      <Download className="h-5 w-5" />
                      下载全部
                    </button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Single file — save via share sheet */}
      {!isMulti && (
        <div className="animate-fade-slide-up stagger-1">
          <SaveFileBtn url={result.download_url} filename={downloadName} label={`${isMobile ? '保存' : '下载'} ${truncName(downloadName)}`} />
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
