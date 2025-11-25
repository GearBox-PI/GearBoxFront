/*
 * Gear Box – Sistema de Gestão para Oficinas Mecânicas
 * Copyright (C) 2025 Gear Box
 *
 * Este arquivo é parte do Gear Box.
 * O Gear Box é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da GNU Affero General Public License, versão 3,
 * conforme publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil,
 * mas SEM QUALQUER GARANTIA; sem mesmo a garantia implícita de
 * COMERCIABILIDADE ou ADEQUAÇÃO A UM DETERMINADO FIM.
 * Consulte a GNU AGPLv3 para mais detalhes.
 *
 * Você deve ter recebido uma cópia da GNU AGPLv3 junto com este programa.
 * Caso contrário, veja <https://www.gnu.org/licenses/>.
 */

import { FileBarChart2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChartPlaceholder({ title, description, className, loading = false }) {
  return (
    <div
      className={cn(
        'flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/70 px-6 text-center',
        className
      )}
    >
      {loading ? (
        <Loader2
          className="mb-3 h-6 w-6 animate-spin text-muted-foreground"
          aria-hidden
        />
      ) : (
        <FileBarChart2 className="mb-3 h-7 w-7 text-muted-foreground" aria-hidden />
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
