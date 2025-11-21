import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "@/locales/ptBR.json";
import enUS from "@/locales/enUS.json";

const STORAGE_KEY = "gearbox_locale";
const fallbackLng = "pt-BR";

const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
const browserLng = typeof navigator !== "undefined" ? navigator.language : fallbackLng;
const initialLng = stored || (browserLng.startsWith("en") ? "en-US" : fallbackLng);

i18n
  .use(initReactI18next)
  .init({
    lng: initialLng,
    fallbackLng,
    resources: {
      "pt-BR": { translation: ptBR },
      "en-US": { translation: enUS },
    },
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

export function setLanguage(lng: string) {
  i18n.changeLanguage(lng);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lng);
  }
}

export function getLanguage() {
  return i18n.language || fallbackLng;
}

export default i18n;
