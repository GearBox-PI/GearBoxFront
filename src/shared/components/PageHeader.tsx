import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
  align?: 'start' | 'between';
};

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  className,
  align = 'between',
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-center',
        align === 'between' ? 'md:justify-between' : 'md:justify-start',
        className
      )}
    >
      <div className="space-y-1.5">
        {eyebrow && (
          <p className="text-xs md:text-sm uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="heading-accent text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 w-full md:w-auto">{actions}</div>}
    </div>
  )
}
