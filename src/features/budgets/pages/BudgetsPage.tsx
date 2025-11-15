import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { listBudgets, listClients, listCars } from '@/services/gearbox';
import type { BudgetStatus } from '@/types/api';
import { cn } from '@/lib/utils';
import { Loader2, Clock, CheckCircle2, ThumbsDown, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState } from '@/components/EmptyState';

const statusConfig: Record<
  BudgetStatus,
  { label: string; description: string; icon: typeof Clock; className: string; iconClass: string }
> = {
  aberto: {
    label: 'Aberto',
    description: 'Aguardando aprovação',
    icon: Clock,
    className: 'bg-[rgba(245,163,0,0.15)] text-[hsl(var(--primary))] border-transparent',
    iconClass: 'text-[hsl(var(--primary))]',
  },
  aceito: {
    label: 'Aceito',
    description: 'Convertido em serviço',
    icon: CheckCircle2,
    className: 'bg-[hsl(var(--success-light))] text-[hsl(var(--success))]',
    iconClass: 'text-[hsl(var(--success))]',
  },
  recusado: {
    label: 'Recusado',
    description: 'Cliente recusou o orçamento',
    icon: ThumbsDown,
    className: 'bg-[rgba(239,83,80,0.15)] text-[hsl(var(--destructive))]',
    iconClass: 'text-[hsl(var(--destructive))]',
  },
  cancelado: {
    label: 'Cancelado',
    description: 'Removido ou expirado',
    icon: XCircle,
    className: 'bg-[rgba(229,231,235,0.15)] text-muted-foreground',
    iconClass: 'text-muted-foreground',
  },
};

const currencyFormat = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function Orcamentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { token } = useAuth();

  const budgetsQuery = useQuery({
    queryKey: ['budgets', token, page],
    queryFn: () => listBudgets(token!, { page, perPage: 10 }),
    enabled: Boolean(token),
  });

  const clientsQuery = useQuery({
    queryKey: ['clients', token, 'budgets-map'],
    queryFn: () => listClients(token!, { page: 1, perPage: 100 }),
    enabled: Boolean(token),
  });

  const carsQuery = useQuery({
    queryKey: ['cars', token, 'budgets-map'],
    queryFn: () => listCars(token!, { page: 1, perPage: 100 }),
    enabled: Boolean(token),
  });

  const clientMap = useMemo(() => {
    const entries = clientsQuery.data?.data?.map((client) => [client.id, client.nome]) ?? [];
    return new Map(entries);
  }, [clientsQuery.data]);

  const carMap = useMemo(() => {
    const entries = carsQuery.data?.data?.map((car) => [car.id, car]) ?? [];
    return new Map(entries);
  }, [carsQuery.data]);

  const budgets = budgetsQuery.data?.data ?? [];
  const filteredBudgets = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return budgets.filter((budget) => {
      const clientName = clientMap.get(budget.clientId)?.toLowerCase() ?? '';
      const car = carMap.get(budget.carId);
      const vehicleText = car ? `${car.marca} ${car.modelo} ${car.placa}`.toLowerCase() : '';
      const description = budget.description.toLowerCase();
      return (
        budget.id.toLowerCase().includes(term) ||
        clientName.includes(term) ||
        vehicleText.includes(term) ||
        description.includes(term)
      );
    });
  }, [budgets, searchTerm, clientMap, carMap]);

  return (
    <div className="page-container bg-gradient-hero rounded-2xl border border-border shadow-lg p-6 md:p-8">
      <PageHeader
        eyebrow="Financeiro"
        title="Orçamentos"
        subtitle="Listagem em tempo real da Gear Box API"
        actions={
          <SearchInput
            placeholder="Buscar por cliente, veículo ou descrição..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
          />
        }
      />

      {budgetsQuery.isLoading ? (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando orçamentos...
        </div>
      ) : budgetsQuery.isError ? (
        <p className="text-destructive">
          {budgetsQuery.error instanceof Error
            ? budgetsQuery.error.message
            : 'Erro ao buscar orçamentos'}
        </p>
      ) : (
        <>
          {filteredBudgets.length === 0 ? (
            <EmptyState
              title="Nenhum orçamento encontrado"
              description="Ajuste os filtros ou aguarde novos registros no backend."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBudgets.map((budget) => {
                const config = statusConfig[budget.status];
                const StatusIcon = config.icon;
                const clientName = clientMap.get(budget.clientId) ?? 'Cliente desconhecido';
                const car = carMap.get(budget.carId);
                const total = currencyFormat.format(Number(budget.amount) || 0);
                return (
                  <Card key={budget.id} className="border-border shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-1">{budget.id}</h3>
                          <Badge
                            className={cn(
                              'gap-1 text-xs font-semibold border border-transparent items-center',
                              config.className
                            )}
                          >
                            <StatusIcon className={cn('w-3 h-3', config.iconClass)} />
                            {config.label}
                          </Badge>
                          <p className="text-[11px] text-muted-foreground mt-1">{config.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{total}</p>
                          <p className="text-xs text-muted-foreground">
                            {budget.createdAt
                              ? new Date(budget.createdAt).toLocaleDateString('pt-BR')
                              : '—'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Cliente</p>
                          <p className="text-sm font-medium text-foreground">{clientName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Veículo</p>
                          <p className="text-sm font-medium text-foreground">
                            {car ? `${car.marca} ${car.modelo} · ${car.placa}` : 'Não localizado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Descrição</p>
                          <p className="text-sm text-foreground">{budget.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {budgetsQuery.data?.meta && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Página {budgetsQuery.data.meta.currentPage} de {budgetsQuery.data.meta.lastPage}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || budgetsQuery.isFetching}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === budgetsQuery.data.meta.lastPage || budgetsQuery.isFetching}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
