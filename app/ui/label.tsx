import { LabelHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          'block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300',
          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';
