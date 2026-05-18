import { useState } from 'react';
import { Download, CheckCircle2, Package, Share2, Loader2 } from 'lucide-react';
import type { ConversionResult } from '../types';
import { getDownloadUrl } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Props {
  result: ConversionResult;
  onNewConversion: () => void;
}

async function shareFile(url: string, filename: string) {
  const fullUrl = getDownloadUrl(url) + '?name=' + encodeURIComponent(filename);
  try {
    const res = await fetch(fullUrl);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: blob.type || 'application/octet-stream' });
    await navigator.share({ files: [file], title: filename });
  } catch {
    // Fallback 1: share URL
    try {
      await navigator.share({ url: fullUrl, title: filename });
    } catch {
      // Fallback 2: copy link
      await navigator.clipboard.writeText(fullUrl);
    }
  }
}

function ShareButton({ url, filename }: { url: string; filename: string }) {
  const [sharing, setSharing] = useState(false);

  const handle = async () => {
    setSharing(true);
    await shareFile(url, filename);
    setSharing(false);
  };

  if (typeof navigator === 'undefined' || !navigator.share) return null;

  return (
    <Button variant="outline" size="sm" onClick={handle} disabled={sharing}>
      {sharing ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      转发
    </Button>
  );
}

export default function ResultPanel({ result, onNewConversion }: Props) {
  const ext = result.output_extension;
  const downloadName = result.original_filename.replace(/\.[^.]+$/, '') + '.' + ext;
  const isMulti = result.result_type === 'multiple_images' && result.files.length > 1;

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-green-800">转换完成</span>
      </div>

      {isMulti && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {result.files.map((f) => (
                <div key={f.page} className="rounded-lg border border-slate-100 overflow-hidden bg-slate-50">
                  <img
                    src={getDownloadUrl(f.download_url)}
                    alt={`Page ${f.page}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">第 {f.page} 页</span>
                    <div className="flex items-center gap-1">
                      <ShareButton url={f.download_url} filename={f.filename} />
                      <a
                        href={getDownloadUrl(f.download_url) + '?name=' + encodeURIComponent(f.filename)}
                        download
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                      >
                        下载
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {result.zip_url && (
              <div className="mt-4 flex gap-2">
                <a href={getDownloadUrl(result.zip_url) + '?name=' + encodeURIComponent(downloadName.replace(/\.[^.]+$/, '.zip'))} download className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    <Package className="h-4 w-4" />
                    下载全部 ZIP
                  </Button>
                </a>
                <ShareButton
                  url={result.zip_url}
                  filename={downloadName.replace(/\.[^.]+$/, '.zip')}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isMulti && (
        <div className="flex gap-2">
          <a href={getDownloadUrl(result.download_url) + '?name=' + encodeURIComponent(downloadName)} download className="flex-1">
            <Button size="lg" className="w-full">
              <Download className="h-5 w-5" />
              下载 {downloadName}
            </Button>
          </a>
          <ShareButton url={result.download_url} filename={downloadName} />
        </div>
      )}

      <Button variant="ghost" size="sm" className="w-full" onClick={onNewConversion}>
        转换新文件
      </Button>
    </div>
  );
}
