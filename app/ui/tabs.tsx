"use client";
import { ReactNode, useState, createContext, useContext } from 'react';
import clsx from 'clsx';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

interface TabsContextProps {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export function Tabs({ defaultValue, value: controlledValue, onValueChange, className, children }: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const setValue = (val: string) => {
    if (!isControlled) setUncontrolledValue(val);
    onValueChange?.(val);
  };
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={clsx('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={clsx('inline-flex items-center rounded-md bg-gray-100 p-1', className)}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  const selected = context.value === value;
  return (
    <button
      type="button"
      className={clsx(
        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
        selected
          ? 'bg-white text-gray-900 shadow'
          : 'text-gray-600 hover:text-gray-900 hover:bg-white/70',
        className
      )}
      aria-selected={selected}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  if (context.value !== value) return null;
  return (
    <div className={clsx('mt-2', className)}>
      {children}
    </div>
  );
}
