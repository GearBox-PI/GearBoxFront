import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, actions, className }: EmptyStateProps) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'text-center py-16 border border-dashed border-border rounded-lg space-y-3 px-4',
        className
      )}
    >
      {icon && <div className="flex justify-center text-muted-foreground">{icon}</div>}
      <p className="text-lg font-semibold text-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {actions && <div className="mt-4 flex justify-center">{actions}</div>}
    </div>
  )
}
