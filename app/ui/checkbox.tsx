import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={clsx(
          'h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100',
          className
        )}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
