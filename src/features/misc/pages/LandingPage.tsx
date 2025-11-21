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
