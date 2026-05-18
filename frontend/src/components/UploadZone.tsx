import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { Upload, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';

interface Props {
  file: File | null;
  onSelect: (file: File) => void;
  disabled: boolean;
}

export default function UploadZone({ file, onSelect, disabled }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(e.type === 'dragover');
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f) onSelect(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onSelect(f);
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200',
        dragOver
          ? 'border-slate-400 bg-slate-50/80 scale-[1.01]'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40',
        disabled && 'opacity-50 pointer-events-none',
      )}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".docx,.pptx,.pdf,.png,.jpg,.jpeg"
        onChange={handleChange}
        className="hidden"
      />

      {file ? (
        <div className="space-y-3">
          <FileText className="h-10 w-10 mx-auto text-slate-400" />
          <p className="text-base font-semibold text-slate-800">{file.name}</p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline">{(file.size / 1024 / 1024).toFixed(1)} MB</Badge>
            <Badge variant="outline">{file.name.split('.').pop()?.toUpperCase()}</Badge>
          </div>
          <p className="text-xs text-slate-400">点击更换文件</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-slate-100 text-slate-400">
            <Upload className="h-7 w-7" />
          </div>
          <p className="text-base font-medium text-slate-600">
            拖拽文件到这里，或点击选择
          </p>
          <p className="text-sm text-slate-400">
            支持 DOCX、PPTX、PDF &middot; 最大 50MB
          </p>
        </div>
      )}
    </div>
  );
}
