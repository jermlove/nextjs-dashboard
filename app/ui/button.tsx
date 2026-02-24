import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export function Button({ children, className, variant = 'primary', ...rest }: ButtonProps) {
  const baseClasses =
    'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';
  const variantClasses: Record<string, string> = {
    primary: 'bg-blue-500 text-white hover:bg-blue-400 focus-visible:outline-blue-500 active:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-400 focus-visible:outline-gray-500 active:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-400 focus-visible:outline-red-500 active:bg-red-600',
    outline: 'border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 focus-visible:outline-blue-500 active:bg-blue-100',
  };
  return (
    <button
      {...rest}
      className={clsx(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
}
