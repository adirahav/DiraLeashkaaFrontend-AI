import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 md:px-6 grid grid-cols-12 gap-4', className)}>
      {children}
    </div>
  );
}
