import { X } from 'lucide-react';

interface Props {
  files: File[];
  onRemove: (index: number) => void;
}

export default function ImagePreviewGrid({ files, onRemove }: Props) {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-slide-up">
      {files.map((f, i) => (
        <div key={i} className="relative rounded-xl border border-slate-100 overflow-hidden bg-slate-50 group">
          <img
            src={URL.createObjectURL(f)}
            alt={`第 ${i + 1} 张`}
            className="w-full h-24 object-cover"
          />
          <div className="px-2 py-1.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">第 {i + 1} 张</span>
            <span className="text-[10px] text-slate-400">{(f.size / 1024).toFixed(0)} KB</span>
          </div>
          <button
            onClick={() => onRemove(i)}
            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
