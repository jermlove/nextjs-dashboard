import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
	children: ReactNode;
	className?: string;
}

export function Card({ children, className = '' }: CardProps) {
	return (
		<div className={clsx('rounded-xl border bg-white shadow-sm dark:bg-gray-950', className)}>
			{children}
		</div>
	);
}

export function CardHeader({ children, className = '' }: CardProps) {
	return (
		<div className={clsx('flex flex-col space-y-1.5 p-6', className)}>
			{children}
		</div>
	);
}

export function CardTitle({ children, className = '' }: CardProps) {
	return (
		<h3 className={clsx('text-lg font-semibold leading-none tracking-tight', className)}>
			{children}
		</h3>
	);
}

export function CardDescription({ children, className = '' }: CardProps) {
	return (
		<p className={clsx('text-sm text-gray-500 dark:text-gray-400', className)}>
			{children}
		</p>
	);
}

export function CardContent({ children, className = '' }: CardProps) {
	return (
		<div className={clsx('p-6 pt-0', className)}>
			{children}
		</div>
	);
}

export function CardFooter({ children, className = '' }: CardProps) {
	return (
		<div className={clsx('flex items-center p-6 pt-0', className)}>
			{children}
		</div>
	);
}
