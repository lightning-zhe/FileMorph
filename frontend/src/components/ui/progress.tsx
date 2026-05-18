import { cn } from '../../lib/utils';

interface Props {
  value: number;
  className?: string;
}

export function Progress({ value, className }: Props) {
  return (
    <div className={cn('h-1 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className="h-full bg-slate-800 transition-all duration-500 ease-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
