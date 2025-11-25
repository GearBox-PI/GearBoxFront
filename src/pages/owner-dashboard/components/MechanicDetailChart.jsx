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

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPlaceholder } from "./ChartPlaceholder";
import { useTranslation } from "react-i18next";

const COLORS = {
  text: "#f8fafc",
  grid: "rgba(255,255,255,0.08)",
  budgets: "#FFC107",
  accepted: "#38BDF8",
  services: "#F472B6",
};

export function MechanicDetailChart({ mechanic, data = [], loading = false }) {
  const { t } = useTranslation();
  const hasMechanic = Boolean(mechanic);

  const chartOption = useMemo(() => {
    const categories = data.map((item) => item.period);
    return {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      legend: {
        data: ["Budgets Criados", "Aceitos", "Serviços"],
        bottom: 0,
        icon: "circle",
        textStyle: {
          color: COLORS.text,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
        },
        itemGap: 20,
      },
      grid: {
        left: 40,
        right: 40,
        bottom: 40,
        top: 40,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: categories,
        axisLabel: {
          color: COLORS.text,
          rotate: -25,
          interval: 0,
          fontSize: 13,
          margin: 16,
          fontFamily: "Inter, sans-serif",
        },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.25)" } },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: COLORS.text,
          margin: 16,
          fontSize: 13,
          fontFamily: "Inter, sans-serif",
        },
        splitLine: { lineStyle: { color: COLORS.grid } },
      },
      series: [
        {
          name: "Budgets Criados",
          type: "line",
          data: data.map((item) => item.created),
          smooth: true,
          symbolSize: 6,
          lineStyle: { color: COLORS.budgets, width: 2 },
          areaStyle: { color: "rgba(255,193,7,0.15)" },
        },
        {
          name: "Aceitos",
          type: "line",
          data: data.map((item) => item.accepted),
          smooth: true,
          symbolSize: 6,
          lineStyle: { color: COLORS.accepted, width: 2 },
          areaStyle: { color: "rgba(56,189,248,0.15)" },
        },
        {
          name: "Serviços",
          type: "line",
          data: data.map((item) => item.services),
          smooth: true,
          symbolSize: 6,
          lineStyle: { color: COLORS.services, width: 2 },
          areaStyle: { color: "rgba(244,114,182,0.2)" },
        },
      ],
    };
  }, [data]);

  return (
    <Card className="border-border shadow-sm bg-card/80">
      <CardHeader className="space-y-1.5 pb-0">
        <CardTitle className="text-lg">
          {hasMechanic
            ? `${t("owner.charts.mechanicDetail.title")} – ${mechanic.nome}`
            : t("owner.charts.mechanicDetail.title")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {t("owner.header.subtitle")}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div style={{ height: "450px", width: "100%" }}>
          {loading ? (
            <ChartPlaceholder loading title={t("charts.placeholder.loading")} />
          ) : !hasMechanic ? (
            <ChartPlaceholder
              title={t("owner.charts.mechanicDetail.select")}
              description={t("owner.charts.mechanicDetail.selectDesc")}
            />
          ) : data.length === 0 ? (
            <ChartPlaceholder
              title={t("owner.charts.mechanicDetail.empty")}
              description={t("owner.charts.mechanicDetail.emptyDesc")}
            />
          ) : (
            <ReactECharts
              option={chartOption}
              notMerge
              lazyUpdate
              style={{ height: "100%" }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
