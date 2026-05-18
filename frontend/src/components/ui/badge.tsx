import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const variants = cva(
  'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-slate-200 bg-slate-100 text-slate-700',
        outline: 'border-slate-200 text-slate-600',
        success: 'border-green-200 bg-green-50 text-green-700',
        destructive: 'border-red-200 bg-red-50 text-red-700',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof variants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(variants({ variant }), className)} {...props} />;
}
