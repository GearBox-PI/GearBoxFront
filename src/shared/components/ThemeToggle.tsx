import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "relative rounded-full border-border bg-card/90 backdrop-blur-sm text-foreground",
        "hover:bg-muted transition-colors",
        className
      )}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all",
          isDark ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all",
          isDark ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
        )}
      />
    </Button>
  );
}
