import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { setLanguage, getLanguage } from "@/shared/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  collapsed?: boolean;
}

export function LanguageSwitcher({ collapsed }: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const current = getLanguage();

  const handleChange = (value: string) => {
    setLanguage(value);
  };

  const FLAGS: Record<string, string> = {
    "pt-BR": "🇧🇷",
    "en-US": "🇺🇸",
  };

  const LABELS: Record<string, string> = {
    "pt-BR": t("language.portuguese"),
    "en-US": t("language.english"),
  };

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "w-full transition-all duration-200 border border-[var(--sidebar-border-color)] bg-transparent hover:bg-[var(--sidebar-hover-bg)]",
          collapsed
            ? "justify-center px-0 border-none h-10 w-10 mx-auto [&>svg]:hidden"
            : "justify-between px-3"
        )}
        style={{
          color: "var(--sidebar-text)",
        }}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="text-base leading-none shrink-0 grayscale-[0.2] hover:grayscale-0 transition-all">
            {FLAGS[current] || "🌐"}
          </span>
          {!collapsed && (
            <span className="truncate text-sm font-medium opacity-90">
              {LABELS[current]}
            </span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="border-[var(--sidebar-border-color)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)]">
        <SelectItem
          value="pt-BR"
          className="focus:bg-[var(--sidebar-hover-bg)] focus:text-[var(--sidebar-text)]"
        >
          <span className="flex items-center gap-2">
            <span>🇧🇷</span> {t("language.portuguese")}
          </span>
        </SelectItem>
        <SelectItem
          value="en-US"
          className="focus:bg-[var(--sidebar-hover-bg)] focus:text-[var(--sidebar-text)]"
        >
          <span className="flex items-center gap-2">
            <span>🇺🇸</span> {t("language.english")}
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
