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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ReportCard = {
  label: string;
  value: string;
  helper?: string | null;
};

type MechanicRow = {
  nome: string;
  budgetsTotal: number;
  budgetsAccepted: number;
  servicesCompleted: number;
  acceptRate: number;
  cancelRate: number;
  ticketAverage: number | null;
};

type ReportTexts = {
  reportTitle: string;
  periodLabel: string;
  generatedAt: string;
  summaryTitle: string;
  comparisonTitle: string;
  comparisonSubtitle: string;
  mechanicsTitle: string;
  mechanicsTableHeaders: {
    mechanic: string;
    budgets: string;
    accepted: string;
    services: string;
    ticket: string;
    acceptance: string;
    cancellation: string;
  };
};

export type ExecutiveReportOptions = {
  filename: string;
  periodLabel: string;
  emissionDate: Date;
  summaryCards: ReportCard[];
  comparisonCards: ReportCard[];
  mechanicRows: MechanicRow[];
  texts: ReportTexts;
  logoUrl?: string;
};

const PAGE_MARGIN = 40;
const SECTION_SPACING = 24;
const CARD_HEIGHT = 90;
const CARD_PADDING = 16;
type JsPdfWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

export async function generateExecutiveReport(options: ExecutiveReportOptions) {
  const {
    filename,
    periodLabel,
    emissionDate,
    summaryCards,
    comparisonCards,
    mechanicRows,
    texts,
    logoUrl = "/logo.svg",
  } = options;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let cursorY =
    (await renderHeader(doc, {
      logoUrl,
      cursorY: PAGE_MARGIN,
      texts,
      periodLabel,
      emissionDate,
    })) + SECTION_SPACING;

  cursorY = renderPerformanceCards(doc, cursorY, summaryCards, texts.summaryTitle);
  cursorY = renderMechanicsComparison(doc, cursorY, comparisonCards, texts.comparisonTitle, texts.comparisonSubtitle);
  renderMechanicsTable(doc, cursorY, mechanicRows, texts);

  doc.save(filename);
}

async function renderHeader(
  doc: jsPDF,
  params: { logoUrl: string; cursorY: number; texts: ReportTexts; periodLabel: string; emissionDate: Date }
): Promise<number> {
  const { logoUrl, cursorY, texts, periodLabel, emissionDate } = params;
  const logoDataUrl = await loadLogo(logoUrl);
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", PAGE_MARGIN, cursorY, 40, 40);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Gear Box", PAGE_MARGIN + 52, cursorY + 14);
  doc.setFontSize(16);
  doc.text(texts.reportTitle, PAGE_MARGIN + 52, cursorY + 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#444444");
  doc.text(`${texts.periodLabel}: ${periodLabel}`, PAGE_MARGIN, cursorY + 58);
  const emittedLabel = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(emissionDate);
  doc.text(`${texts.generatedAt}: ${emittedLabel}`, PAGE_MARGIN, cursorY + 74);
  doc.setTextColor("#000000");
  return cursorY + 90;
}

function renderPerformanceCards(doc: jsPDF, startY: number, cards: ReportCard[], title?: string) {
  let cursorY = startY;
  if (title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, PAGE_MARGIN, cursorY);
    cursorY += 16;
  }

  const cardsPerRow = 3;
  const availableWidth = doc.internal.pageSize.getWidth() - PAGE_MARGIN * 2;
  const gap = 12;
  const cardWidth = (availableWidth - gap * (cardsPerRow - 1)) / cardsPerRow;

  cards.forEach((card, index) => {
    const col = index % cardsPerRow;
    const row = Math.floor(index / cardsPerRow);
    const x = PAGE_MARGIN + col * (cardWidth + gap);
    const y = cursorY + row * (CARD_HEIGHT + gap);
    doc.setDrawColor("#e5e5e5");
    doc.setFillColor("#ffffff");
    doc.roundedRect(x, y, cardWidth, CARD_HEIGHT, 6, 6, "FD");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#666666");
    doc.text(card.label, x + CARD_PADDING, y + CARD_PADDING + 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor("#000000");
    doc.text(card.value, x + CARD_PADDING, y + CARD_PADDING + 32);
    if (card.helper) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor("#666666");
      doc.text(card.helper, x + CARD_PADDING, y + CARD_PADDING + 48);
    }
  });

  const totalRows = Math.ceil(cards.length / cardsPerRow);
  cursorY += totalRows * CARD_HEIGHT + (totalRows - 1) * gap + SECTION_SPACING;
  return cursorY;
}

function renderMechanicsComparison(
  doc: jsPDF,
  startY: number,
  cards: ReportCard[],
  title: string,
  subtitle: string
) {
  let cursorY = startY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, PAGE_MARGIN, cursorY);
  cursorY += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#666666");
  doc.text(subtitle, PAGE_MARGIN, cursorY);
  doc.setTextColor("#000000");
  cursorY += 18;

  return renderPerformanceCards(doc, cursorY, cards);
}

function renderMechanicsTable(doc: jsPDF, startY: number, mechanicRows: MechanicRow[], texts: ReportTexts) {
  let cursorY = startY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(texts.mechanicsTitle, PAGE_MARGIN, cursorY);
  cursorY += 12;

  autoTable(doc, {
    startY: cursorY,
    head: [
      [
        texts.mechanicsTableHeaders.mechanic,
        texts.mechanicsTableHeaders.budgets,
        texts.mechanicsTableHeaders.accepted,
        texts.mechanicsTableHeaders.services,
        texts.mechanicsTableHeaders.ticket,
        texts.mechanicsTableHeaders.acceptance,
        texts.mechanicsTableHeaders.cancellation,
      ],
    ],
    body: mechanicRows.map((row) => [
      row.nome,
      String(row.budgetsTotal),
      String(row.budgetsAccepted),
      String(row.servicesCompleted),
      row.ticketAverage ? formatCurrency(row.ticketAverage) : "—",
      `${row.acceptRate ?? 0}%`,
      `${row.cancelRate ?? 0}%`,
    ]),
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    headStyles: { fillColor: [238, 238, 238], textColor: 0, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    styles: { font: "helvetica", fontSize: 10 },
    tableLineColor: [229, 229, 229],
    tableLineWidth: 0.5,
  });
}

async function loadLogo(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0, 80, 80);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

// Este componente gera o PDF do painel executivo usando apenas texto e tabelas (jsPDF/autoTable), sem capturar gráficos da interface.
