import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { Upload, FileText, ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';

interface Props {
  file: File | null;
  files: File[];
  onSelect: (file: File) => void;
  onSelectMultiple: (files: File[]) => void;
  disabled: boolean;
  multiple: boolean;
}

export default function UploadZone({ file, files, onSelect, onSelectMultiple, disabled, multiple }: Props) {
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
    const dropped = Array.from(e.dataTransfer.files);
    if (multiple) onSelectMultiple(dropped);
    else if (dropped[0]) onSelect(dropped[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (multiple) onSelectMultiple(selected);
    else if (selected[0]) onSelect(selected[0]);
  };

  const hasFile = multiple ? files.length > 0 : !!file;

  return (
    <div
      className={cn(
        'relative rounded-[22px] border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all duration-300',
        dragOver
          ? 'border-indigo-400 bg-indigo-50/70 scale-[1.02] shadow-lg shadow-indigo-100/50'
          : 'border-slate-200/80 hover:border-slate-300 hover:bg-white/70 hover:shadow-md',
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
        accept={multiple ? '.png,.jpg,.jpeg,.webp,.docx,.pptx,.pdf' : '.docx,.pptx,.pdf,.png,.jpg,.jpeg'}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      {hasFile ? (
        <div className="space-y-3">
          {multiple ? (
            <>
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-400">
                <ImageIcon className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-slate-800">已选 {files.length} 张图片</p>
              <p className="text-xs text-slate-400">点击更换或添加更多</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-400">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-slate-800 truncate px-4">{file!.name}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline">{(file!.size / 1024 / 1024).toFixed(1)} MB</Badge>
                <Badge variant="outline">{file!.name.split('.').pop()?.toUpperCase()}</Badge>
              </div>
              <p className="text-xs text-slate-400">点击更换文件</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-[20px] bg-indigo-400/20 blur-xl animate-pulse" />
            <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-[20px] bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/60 text-indigo-400 shadow-sm animate-float">
              <Upload className="h-8 w-8" />
            </div>
          </div>
          <p className="text-base font-medium text-slate-600">
            {multiple ? '选择多张图片，或拖拽到这里' : '拖拽文件到这里，或点击选择'}
          </p>
          <p className="text-sm text-slate-400">
            {multiple ? '支持 PNG、JPG、JPEG、WEBP' : '支持 DOCX、PPTX、PDF · 最大 50MB'}
          </p>
        </div>
      )}
    </div>
  );
}
