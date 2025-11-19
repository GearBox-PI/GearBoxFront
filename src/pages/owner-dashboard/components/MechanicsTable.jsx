import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MechanicsTable({ data = [], onSelect, selectedId }) {
  return (
    <Card className="border-border shadow-sm bg-card/80">
      <CardHeader>
        <CardTitle className="text-lg">Detalhamento por Mecânico</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
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
                <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                  Nenhum mecânico encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((mechanic) => (
                <TableRow
                  key={mechanic.id}
                  className={cn(
                    selectedId === mechanic.id && 'bg-muted/20'
                  )}
                >
                  <TableCell className="align-middle font-medium">{mechanic.nome}</TableCell>
                  <TableCell className="align-middle">{mechanic.budgetsTotal}</TableCell>
                  <TableCell className="align-middle">{mechanic.budgetsAccepted}</TableCell>
                  <TableCell className="align-middle">{mechanic.budgetsCancelled}</TableCell>
                  <TableCell className="align-middle">{mechanic.budgetsOpen}</TableCell>
                  <TableCell className="align-middle">{mechanic.servicesCompleted}</TableCell>
                  <TableCell className="align-middle">{mechanic.acceptRate}%</TableCell>
                  <TableCell className="align-middle">{mechanic.cancelRate}%</TableCell>
                  <TableCell className="align-middle text-right">
                    <Button
                      variant={selectedId === mechanic.id ? 'default' : 'outline'}
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
      </CardContent>
    </Card>
  )
}
