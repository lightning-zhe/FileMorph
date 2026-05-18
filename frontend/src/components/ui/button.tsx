import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const variants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:shadow-md',
        outline: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-5',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(variants({ variant, size }), className)} ref={ref} {...props} />
  ),
);
Button.displayName = 'Button';

export { Button, variants };
