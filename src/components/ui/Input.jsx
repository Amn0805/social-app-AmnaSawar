// components/ui/Input.jsx
import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(function Input(
  { label, error, className, textarea = false, ...rest },
  ref
) {
  const Tag = textarea ? 'textarea' : 'input';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-1.5">
          {label}
        </label>
      )}
      <Tag
        ref={ref}
        className={clsx(
          'w-full rounded-xl border bg-white dark:bg-surface px-4 py-2.5 text-sm text-ink dark:text-paper',
          'placeholder:text-mutedLight dark:placeholder:text-muted',
          'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40',
          error
            ? 'border-rose-500'
            : 'border-ink/10 dark:border-surface-border focus:border-brand-500 dark:focus:border-brand-400',
          textarea && 'resize-none min-h-[100px]',
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-rose-500 animate-fadeUp">{error}</p>}
    </div>
  );
});

export default Input;
