import { Download, CheckCircle2, Package } from 'lucide-react';
import type { ConversionResult } from '../types';
import { getDownloadUrl } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Props {
  result: ConversionResult;
  onNewConversion: () => void;
}

export default function ResultPanel({ result, onNewConversion }: Props) {
  const ext = result.output_extension;
  const downloadName = result.original_filename.replace(/\.[^.]+$/, '') + '.' + ext;
  const isMulti = result.result_type === 'multiple_images' && result.files.length > 1;

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Success badge */}
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-green-800">转换完成</span>
      </div>

      {/* Multi-image: thumbnail grid */}
      {isMulti && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {result.files.map((f) => (
                <div key={f.page} className="rounded-lg border border-slate-100 overflow-hidden bg-slate-50">
                  <img
                    src={f.download_url}
                    alt={`Page ${f.page}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      第 {f.page} 页
                    </span>
                    <a
                      href={getDownloadUrl(f.download_url) + '?name=' + encodeURIComponent(f.filename)}
                      download
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      下载
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* ZIP download */}
            {result.zip_url && (
              <div className="mt-4">
                <a href={getDownloadUrl(result.zip_url) + '?name=' + encodeURIComponent(downloadName.replace(/\.[^.]+$/, '.zip'))} download>
                  <Button variant="default" size="sm" className="w-full">
                    <Package className="h-4 w-4" />
                    下载全部 (ZIP)
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Single file download */}
      {!isMulti && (
        <a href={getDownloadUrl(result.download_url) + '?name=' + encodeURIComponent(downloadName)} download>
          <Button size="lg" className="w-full">
            <Download className="h-5 w-5" />
            下载 {downloadName}
          </Button>
        </a>
      )}

      {/* New conversion */}
      <Button variant="ghost" size="sm" className="w-full" onClick={onNewConversion}>
        转换新文件
      </Button>
    </div>
  );
}
