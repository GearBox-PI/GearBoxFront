import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartPlaceholder } from './ChartPlaceholder'

const LEGEND = ['Budgets', 'Concluídos', 'Aceitos', 'Cancelados']
const COLORS = {
  text: '#f8fafc',
  grid: 'rgba(255,255,255,0.08)',
  axis: 'rgba(255,255,255,0.25)',
  budgets: '#FFC107',
  concluded: '#38BDF8',
  accepted: '#F472B6',
  cancelled: '#F43F5E',
}

export function MechanicsComparisonChart({ data = [], loading = false }) {
  const chartOption = useMemo(() => {
    const categories = data.map((item) => item.name)
    const budgets = data.map((item) => item.budgets ?? 0)
    const concluded = data.map((item) => item.services ?? 0)
    const acceptance = data.map((item) => item.acceptRate ?? 0)
    const cancellation = data.map((item) => item.cancelRate ?? 0)

    const formatTooltip = (items) => {
      const entries = Array.isArray(items) ? items : [items]
      const header = entries[0]?.axisValueLabel ?? entries[0]?.name ?? ''
      const rows = entries
        .map((item) => {
          const isRate = item.seriesName === 'Aceitos' || item.seriesName === 'Cancelados'
          const value = isRate ? `${item.value ?? 0}%` : item.value ?? 0
          return `${item.marker} ${item.seriesName}: ${value}`
        })
        .join('<br/>')
      return `<div class="text-xs font-medium">${header}</div><div class="text-xs">${rows}</div>`
    }

      return {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: formatTooltip,
        },
        legend: {
          data: LEGEND,
          top: 8,
          icon: 'circle',
          textStyle: { color: COLORS.text, fontSize: 12 },
        },
        grid: { left: 80, right: 32, bottom: 30, top: 96, containLabel: true },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: { color: COLORS.text, interval: 0, rotate: -25, fontSize: 12, formatter: (value) => value.length > 14 ? `${value.slice(0, 14)}…` : value },
          axisLine: { lineStyle: { color: COLORS.axis } },
        },
      yAxis: [
        {
          type: 'value',
            axisLabel: { color: COLORS.text, margin: 12 },
            splitLine: { lineStyle: { color: COLORS.grid } },
          },
          {
            type: 'value',
            axisLabel: { formatter: '{value}%', color: COLORS.text, margin: 12 },
            splitLine: { show: false },
            min: 0,
            max: 100,
        },
      ],
      series: [
        {
          name: 'Budgets',
          type: 'bar',
          data: budgets,
          barWidth: 12,
          itemStyle: { color: COLORS.budgets, borderRadius: [4, 4, 0, 0] },
        },
        {
          name: 'Concluídos',
          type: 'bar',
          data: concluded,
          barWidth: 12,
          itemStyle: { color: COLORS.concluded, borderRadius: [4, 4, 0, 0] },
        },
        {
          name: 'Aceitos',
          type: 'line',
          data: acceptance,
          yAxisIndex: 1,
          smooth: true,
          symbolSize: 7,
          lineStyle: { color: COLORS.accepted, width: 2 },
          itemStyle: { color: COLORS.accepted },
        },
        {
          name: 'Cancelados',
          type: 'line',
          data: cancellation,
          yAxisIndex: 1,
          smooth: true,
          symbolSize: 7,
          lineStyle: { color: COLORS.cancelled, width: 2 },
          itemStyle: { color: COLORS.cancelled },
        },
      ],
    }
  }, [data])

  return (
    <Card className="border-border shadow-sm bg-card/80">
      <CardHeader className="space-y-1.5 pb-0">
        <CardTitle className="text-lg">Comparativo de Mecânicos</CardTitle>
        <p className="text-xs text-muted-foreground">Budgets, serviços e taxas por profissional.</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[630px]">
          {loading ? (
            <ChartPlaceholder loading title="Carregando dados..." />
          ) : data.length === 0 ? (
            <ChartPlaceholder
              title="Ainda sem comparativos"
              description="Cadastre mecânicos ativos e gere budgets para liberar o gráfico."
            />
          ) : (
            <ReactECharts option={chartOption} notMerge lazyUpdate style={{ height: '100%' }} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
