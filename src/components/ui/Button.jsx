// components/ui/Button.jsx
import clsx from 'clsx';

const VARIANTS = {
  primary:
    'bg-brand-600 dark:bg-brand-500 text-white dark:text-midnight font-semibold hover:bg-brand-700 dark:hover:bg-brand-400 dark:hover:shadow-glow disabled:opacity-60',
  secondary:
    'bg-white dark:bg-surface text-ink dark:text-paper border border-ink/10 dark:border-surface-border hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400',
  danger: 'bg-rose-500 text-white hover:bg-rose-600',
  ghost: 'bg-transparent text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-white/5',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
