import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: t("login.successTitle"),
        description: t("login.successDesc"),
      });
      navigate("/");
    } catch (error) {
      toast({
        title: t("login.errorTitle"),
        description:
          error instanceof Error ? error.message : t("login.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f4f6fa] dark:bg-slate-950 transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent dark:from-slate-900 dark:via-slate-950 dark:to-black" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 dark:opacity-100" />

      {/* Language Selector */}
      <div className="absolute top-4 right-20 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-200/50 dark:hover:bg-accent/50 gap-2 transition-colors"
              aria-label={t("language.label", { defaultValue: "Selecionar idioma" })}
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-medium text-xs tracking-wide">
                {i18n.language?.split("-")[0] || "PT"}
              </span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px]">
            <DropdownMenuItem
              onClick={() => changeLanguage("pt-BR")}
              className="cursor-pointer"
            >
              Português (BR)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("en-US")}
              className="cursor-pointer"
            >
              English (US)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md mx-4">
        <div className="transform hover:scale-105 transition-transform duration-500">
          <Logo className="h-52 w-auto" />
        </div>

        {/* Login Card */}
        <Card className="w-full border border-gray-200/60 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl dark:shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-2 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t("login.title")}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-slate-400 text-base">
              {t("login.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-900 dark:text-slate-300 font-medium"
                >
                  {t("login.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("login.placeholderEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-gray-100 dark:bg-slate-950/50 border-gray-300 dark:border-slate-800 focus:border-primary focus:ring-primary/20 h-11 transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-900 dark:text-slate-300 font-medium"
                >
                  {t("login.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("login.placeholderPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-gray-100 dark:bg-slate-950/50 border-gray-300 dark:border-slate-800 focus:border-primary focus:ring-primary/20 h-11 transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-600"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] transition-all duration-300 rounded-lg mt-2 text-primary-foreground bg-primary hover:bg-yellow-500 dark:hover:bg-primary/90"
                disabled={loading}
                aria-label={
                  loading
                    ? t("login.buttonLoading", { defaultValue: "Entrando..." })
                    : t("login.button", { defaultValue: "Entrar" })
                }
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("login.buttonLoading")}
                  </div>
                ) : (
                  t("login.button")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
