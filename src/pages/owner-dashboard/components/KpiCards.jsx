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

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCards({ metrics = [] }) {
  if (!metrics.length) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className={cn(
            "border-border/50 bg-card/50 backdrop-blur-sm shadow-sm"
          )}
        >
          <CardContent className="flex min-h-[110px] flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </div>
            <p className="text-2xl font-semibold text-foreground break-words w-full leading-tight">
              {metric.value}
            </p>
            {metric.helper && (
              <p className="text-xs text-muted-foreground">{metric.helper}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
