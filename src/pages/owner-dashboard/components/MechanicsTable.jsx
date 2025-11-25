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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export function MechanicsTable({ data = [], onSelect, selectedId }) {
  const isMobile = useIsMobile();

  return (
    <Card className="border-border shadow-sm bg-card/80">
      <CardHeader>
        <CardTitle className="text-lg">Detalhamento por Mecânico</CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="flex flex-col gap-4">
            {data.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                Nenhum mecânico encontrado.
              </div>
            ) : (
              data.map((mechanic) => (
                <Card
                  key={mechanic.id}
                  className={cn(
                    "p-4 border border-border/50",
                    selectedId === mechanic.id && "bg-muted/20",
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-lg">{mechanic.nome}</div>
                      <Button
                        variant={
                          selectedId === mechanic.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => onSelect?.(mechanic.id)}
                      >
                        Ver detalhes
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-xs uppercase">
                          Orçamentos
                        </div>
                        <div className="font-medium">
                          Total: {mechanic.budgetsTotal}
                        </div>
                        <div className="text-green-600">
                          Aceitos: {mechanic.budgetsAccepted}
                        </div>
                        <div className="text-red-600">
                          Cancelados: {mechanic.budgetsCancelled}
                        </div>
                        <div className="text-yellow-600">
                          Abertos: {mechanic.budgetsOpen}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-muted-foreground text-xs uppercase">
                          Performance
                        </div>
                        <div className="font-medium">
                          Concluídos: {mechanic.servicesCompleted}
                        </div>
                        <div>Taxa Aceite: {mechanic.acceptRate}%</div>
                        <div>Taxa Canc.: {mechanic.cancelRate}%</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[960px] text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Mecânico</TableHead>
                  <TableHead>Budgets</TableHead>
                  <TableHead>Aceitos</TableHead>
                  <TableHead>Cancelados</TableHead>
                  <TableHead>Abertos</TableHead>
                  <TableHead>Serviços Concluídos</TableHead>
                  <TableHead>Taxa Aceite</TableHead>
                  <TableHead>Taxa Cancelamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Nenhum mecânico encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((mechanic) => (
                    <TableRow
                      key={mechanic.id}
                      className={cn(
                        selectedId === mechanic.id && "bg-muted/20",
                      )}
                    >
                      <TableCell className="align-middle font-medium">
                        {mechanic.nome}
                      </TableCell>
                      <TableCell className="align-middle">
                        {mechanic.budgetsTotal}
                      </TableCell>
                      <TableCell className="align-middle">
                        {mechanic.budgetsAccepted}
                      </TableCell>
                      <TableCell className="align-middle">
                        {mechanic.budgetsCancelled}
                      </TableCell>
                      <TableCell className="align-middle">
                        {mechanic.budgetsOpen}
                      </TableCell>
                      <TableCell className="align-middle">
                        {mechanic.servicesCompleted}
                      </TableCell>
                      <TableCell className="align-middle">
                        {mechanic.acceptRate}%
                      </TableCell>
                      <TableCell className="align-middle">
                        {mechanic.cancelRate}%
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <Button
                          variant={
                            selectedId === mechanic.id ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => onSelect?.(mechanic.id)}
                        >
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
