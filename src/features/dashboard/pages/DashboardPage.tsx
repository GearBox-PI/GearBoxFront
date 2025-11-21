import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Wrench,
  Users,
  Car,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { listServices, listClients, listCars } from '@/services/gearbox';
import { useMemo } from 'react';
import type { ServiceStatus } from '@/types/api';
import { useTranslation } from 'react-i18next';

const statusConfig: Record<
  ServiceStatus,
  { label: string; icon: typeof Clock; className: string; iconClass: string }
> = {
  Pendente: {
    label: 'Pendente',
    icon: AlertCircle,
    className: 'bg-[hsl(var(--warning-light))] text-[hsl(var(--warning))] border-transparent',
    iconClass: 'text-[hsl(var(--warning))]',
  },
  'Em andamento': {
    label: 'Em andamento',
    icon: Clock,
    className: 'bg-[rgba(245,163,0,0.15)] text-[hsl(var(--primary))] border-transparent',
    iconClass: 'text-[hsl(var(--primary))]',
  },
  Concluído: {
    label: 'Concluído',
    icon: CheckCircle2,
    className: 'bg-[hsl(var(--success-light))] text-[hsl(var(--success))] border-transparent',
    iconClass: 'text-[hsl(var(--success))]',
  },
  Cancelado: {
    label: 'Cancelado',
    icon: XCircle,
    className: 'bg-[rgba(239,83,80,0.15)] text-[hsl(var(--destructive))] border-transparent',
    iconClass: 'text-[hsl(var(--destructive))]',
  },
};

const currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Dashboard() {
  const { token } = useAuth();
  const { t } = useTranslation();

  const servicesQuery = useQuery({
    queryKey: ['services', token, 'dashboard'],
    queryFn: () => listServices(token!, { page: 1, perPage: 5 }),
    enabled: Boolean(token),
  });

  const clientsQuery = useQuery({
    queryKey: ['clients', token, 'dashboard'],
    queryFn: () => listClients(token!, { page: 1, perPage: 1 }),
    enabled: Boolean(token),
  });

  const carsQuery = useQuery({
    queryKey: ['cars', token, 'dashboard'],
    queryFn: () => listCars(token!, { page: 1, perPage: 1 }),
    enabled: Boolean(token),
  });

  const clientsForMapQuery = useQuery({
    queryKey: ['clients', token, 'dashboard-map'],
    queryFn: () => listClients(token!, { page: 1, perPage: 100 }),
    enabled: Boolean(token),
  });

  const carsForMapQuery = useQuery({
    queryKey: ['cars', token, 'dashboard-map'],
    queryFn: () => listCars(token!, { page: 1, perPage: 100 }),
    enabled: Boolean(token),
  });

  const clientMap = useMemo(() => {
    const entries = clientsForMapQuery.data?.data?.map((client) => [client.id, client.nome]) ?? [];
    return new Map(entries);
  }, [clientsForMapQuery.data]);

  const carMap = useMemo(() => {
    const entries = carsForMapQuery.data?.data?.map((car) => [car.id, car]) ?? [];
    return new Map(entries);
  }, [carsForMapQuery.data]);

  const serviceStats = servicesQuery.data;
  const totalRevenue =
    serviceStats?.data?.reduce((acc, service) => {
      const value = Number(service.totalValue);
      return acc + (Number.isNaN(value) ? 0 : value);
    }, 0) ?? 0;

  const openOrders =
    serviceStats?.data?.filter(
      (service) => service.status === 'Pendente' || service.status === 'Em andamento'
    ).length ?? 0;

  const stats = [
    {
      title: t('dashboardGeneral.stats.orders'),
      value: serviceStats?.meta.total?.toString() ?? '—',
      change: t('dashboardGeneral.stats.ordersChange', { count: openOrders }),
      icon: Wrench,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: t('dashboardGeneral.stats.clients'),
      value: clientsQuery.data?.meta.total?.toString() ?? '—',
      change: t('dashboardGeneral.stats.clientsChange'),
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent-light',
    },
    {
      title: t('dashboardGeneral.stats.vehicles'),
      value: carsQuery.data?.meta.total?.toString() ?? '—',
      change: t('dashboardGeneral.stats.vehiclesChange'),
      icon: Car,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      title: t('dashboardGeneral.stats.revenue'),
      value: currencyFormat.format(totalRevenue),
      change: t('dashboardGeneral.stats.revenueChange'),
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
    },
  ];

  const loadingDashboard =
    servicesQuery.isLoading || clientsQuery.isLoading || carsQuery.isLoading;

  return (
    <div className="page-container bg-gradient-hero rounded-2xl border border-border shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <h1 className="heading-accent text-3xl font-bold text-foreground mb-2">
          {t('dashboardGeneral.title')}
        </h1>
        <p className="text-muted-foreground">{t('dashboardGeneral.subtitle')}</p>
      </div>

      {loadingDashboard ? (
        <div className="flex items-center gap-3 text-muted-foreground mb-8">
          <Loader2 className="w-4 h-4 animate-spin" />
          {t('dashboardGeneral.loading')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--primary))] mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle className="heading-accent text-xl">
            {t('dashboardGeneral.recentOrdersTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servicesQuery.isLoading ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('dashboardGeneral.recentOrdersLoading')}
            </div>
          ) : servicesQuery.isError ? (
            <p className="text-destructive">
              {servicesQuery.error instanceof Error
                ? servicesQuery.error.message
                : t('dashboardGeneral.recentOrdersError')}
            </p>
          ) : (
            <div className="space-y-4">
              {serviceStats?.data?.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-foreground">{order.id}</span>
                        <Badge
                          className={cn(
                            'gap-1 text-xs font-semibold border border-transparent',
                            statusConfig[order.status].className
                          )}
                        >
                          <StatusIcon className={cn('w-3 h-3', statusConfig[order.status].iconClass)} />
                          {statusConfig[order.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground font-medium mb-1">
                        {clientMap.get(order.clientId) ?? 'Cliente não encontrado'}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {(() => {
                          const car = carMap.get(order.carId);
                          return car ? `${car.marca} ${car.modelo} · ${car.placa}` : 'Veículo não localizado';
                        })()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.description ?? 'Sem descrição informada'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('pt-BR')
                          : '—'}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {currencyFormat.format(Number(order.totalValue) || 0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
