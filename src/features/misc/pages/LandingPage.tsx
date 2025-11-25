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

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";

const LandingPage = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="page-container py-10 space-y-6">
        <PageHeader
          eyebrow={t("owner.header.eyebrow")}
          title={t("dashboardGeneral.title")}
          subtitle={t("dashboardGeneral.subtitle")}
        />
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/ordens" className="text-primary hover:underline">
            {t("navigation.orders")}
          </Link>
          <Link to="/orcamentos" className="text-primary hover:underline">
            {t("navigation.budgets")}
          </Link>
          <Link to="/clientes" className="text-primary hover:underline">
            {t("navigation.clients")}
          </Link>
          <Link to="/veiculos" className="text-primary hover:underline">
            {t("navigation.vehicles")}
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;
