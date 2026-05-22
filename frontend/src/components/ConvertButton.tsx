import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  onClick: () => void;
  disabled: boolean;
  waking: boolean;
}

export default function ConvertButton({ onClick, disabled, waking }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || waking}
      className={cn(
        'relative w-full h-12 rounded-2xl text-white font-semibold text-base transition-all duration-200',
        'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950',
        'shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5',
        'active:scale-[0.98] active:shadow-md',
        'disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0',
        'overflow-hidden',
      )}
    >
      {/* Shine line on hover */}
      <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />

      <span className="relative flex items-center justify-center gap-2">
        {waking ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            正在唤醒服务器，请稍候...
          </>
        ) : (
          <>
            开始转换
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}
