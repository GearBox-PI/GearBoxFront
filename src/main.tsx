import { createRoot } from "react-dom/client";
import App from "@/app/App";
import "@/shared/styles/global.css";
import { ThemeProvider } from "@/components/theme-provider";
import "@/shared/i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "@/shared/i18n";

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </I18nextProvider>
);
