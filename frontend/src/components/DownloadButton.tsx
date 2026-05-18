import type { ConversionResult } from '../types';
import { getDownloadUrl } from '../lib/api';

interface Props {
  result: ConversionResult;
  onNewConversion: () => void;
}

function SingleDownload({ result }: { result: ConversionResult }) {
  const ext = result.output_extension;
  const name = result.original_filename.replace(/\.[^.]+$/, '') + '.' + ext;
  const href = getDownloadUrl(result.download_url) + '?name=' + encodeURIComponent(name);

  return (
    <a
      href={href}
      download
      className="block w-full rounded-xl bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow-md hover:bg-green-700 active:scale-[0.98] transition-all text-center"
    >
      下载 {name}
    </a>
  );
}

function ImageGallery({ result }: { result: ConversionResult }) {
  return (
    <div className="space-y-3">
      {/* Per-page grid */}
      <div className="grid grid-cols-2 gap-3">
        {result.files.map((f) => {
          const imgSrc = f.download_url;
          const downloadHref = getDownloadUrl(f.download_url) + '?name=' + encodeURIComponent(f.filename);

          return (
            <div key={f.page} className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={imgSrc}
                alt={`第 ${f.page} 页`}
                className="w-full h-32 object-cover"
              />
              <div className="p-2 flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">第 {f.page} 页</span>
                <a
                  href={downloadHref}
                  download
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  下载本页
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zip download */}
      {result.zip_url && (
        <a
          href={getDownloadUrl(result.zip_url) + '?name=' + encodeURIComponent(result.original_filename.replace(/\.[^.]+$/, '') + '.zip')}
          download
          className="block w-full rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold text-lg shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all text-center"
        >
          下载全部 (ZIP)
        </a>
      )}
    </div>
  );
}

export default function DownloadButton({ result, onNewConversion }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
        <span className="text-green-600 text-xl">&#10003;</span>
        <span className="text-green-800 font-medium">转换完成！</span>
      </div>

      {result.result_type === 'multiple_images' ? (
        <ImageGallery result={result} />
      ) : (
        <SingleDownload result={result} />
      )}

      <button
        onClick={onNewConversion}
        className="block w-full rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-center"
      >
        转换新文件
      </button>
    </div>
  );
}
