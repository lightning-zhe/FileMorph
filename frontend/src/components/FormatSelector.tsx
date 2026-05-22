import type { TargetFormat, SourceFormat } from '../types';
import { TARGET_FORMATS, getTargetLabel, FORMAT_LABELS } from '../lib/conversions';
import { Badge } from './ui/badge';

interface Props {
  sourceFormat: SourceFormat;
  value: TargetFormat | null;
  onChange: (fmt: TargetFormat) => void;
  disabled: boolean;
}

export default function FormatSelector({ sourceFormat, value, onChange, disabled }: Props) {
  const options = TARGET_FORMATS[sourceFormat] ?? [];

  return (
    <div className="space-y-2.5">
      {/* Source format pill */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">源格式</span>
        <Badge>{FORMAT_LABELS[sourceFormat] ?? sourceFormat.toUpperCase()}</Badge>
        <span className="text-slate-300">→</span>
        <span className="text-sm text-slate-500">转换为</span>
      </div>

      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as TargetFormat)}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm transition-colors hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none disabled:opacity-50 appearance-none cursor-pointer"
      >
        <option value="" disabled>
          选择目标格式
        </option>
        {options.map((fmt) => (
          <option key={fmt} value={fmt}>
            {getTargetLabel(fmt)}
          </option>
        ))}
      </select>
    </div>
  );
}
