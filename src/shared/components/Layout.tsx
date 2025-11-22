import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Users,
  Shield,
  Car,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = (t: (key: string) => string) => [
  {
    name: t("navigation.dashboard"),
    href: "/",
    icon: LayoutDashboard,
    roles: ["dono", "mecanico"],
  },
  {
    name: t("navigation.orders"),
    href: "/ordens",
    icon: Wrench,
    roles: ["dono", "mecanico"],
  },
  {
    name: t("navigation.budgets"),
    href: "/orcamentos",
    icon: FileText,
    roles: ["dono", "mecanico"],
  },
  {
    name: t("navigation.clients"),
    href: "/clientes",
    icon: Users,
    roles: ["dono", "mecanico"],
  },
  {
    name: t("navigation.vehicles"),
    href: "/veiculos",
    icon: Car,
    roles: ["dono", "mecanico"],
  },
  {
    name: t("navigation.ownerPanel"),
    href: "/owner-dashboard",
    icon: Shield,
    roles: ["dono"],
  },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const { t } = useTranslation();
  const SIDEBAR_WIDTH = {
    expanded: 260,
    collapsed: 80,
  };

  const navigation = useMemo(
    () =>
      navigationItems(t).filter((item) =>
        item.roles.includes(user?.role ?? "mecanico")
      ),
    [t, user?.role]
  );

  const roleLabel: Record<"dono" | "mecanico", string> = {
    dono: t("common.roles.owner"),
    mecanico: t("common.roles.mechanic"),
  };

  const ariaLabel = collapsed
    ? t("common.actions.expandMenu", { defaultValue: "Expandir menu" })
    : t("common.actions.collapseMenu", { defaultValue: "Recolher menu" });
  const logoutLabel = t("common.actions.logout");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sidebarPixelWidth = collapsed
    ? SIDEBAR_WIDTH.collapsed
    : SIDEBAR_WIDTH.expanded;
  const contentOffset = sidebarPixelWidth + 24;
  const appName = t("common.appName");

  return (
    <div
      className="min-h-screen bg-background transition-[padding-left] duration-300 ease-in-out relative isolate"
      style={{ paddingLeft: `${contentOffset}px` }}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent dark:from-slate-900 dark:via-slate-950 dark:to-black -z-20 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 dark:opacity-100 -z-20 pointer-events-none" />

      <aside
        className="sidebar-shell"
        style={{ width: `${sidebarPixelWidth}px` }}
        aria-label={t("navigation.dashboard")}
      >
        <div className="flex flex-col flex-1">
          <div className="sidebar-brand">
            <div className="sidebar-logo-row">
              <Logo
                size="md"
                className={cn(
                  "sidebar-logo",
                  collapsed
                    ? "sidebar-logo--collapsed"
                    : "sidebar-logo--expanded"
                )}
              />
              {!collapsed && (
                <span className="sidebar-brand-title">{appName}</span>
              )}
            </div>
          </div>

          <nav
            className="sidebar-nav flex-1 space-y-1"
            role="navigation"
            aria-label={t("navigation.dashboard")}
          >
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.href} end={item.href === "/"}>
                {({ isActive }) => (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center rounded-lg transition-all font-medium",
                          collapsed
                            ? "justify-center px-2 py-3"
                            : "justify-start gap-3 px-4 py-3",
                          isActive
                            ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-icon-active)] shadow-sm"
                            : "text-[var(--sidebar-icon-inactive)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-text)]"
                        )}
                        aria-label={item.name}
                      >
                        <item.icon
                          className={cn(
                            "w-5 h-5 transition-colors",
                            collapsed && "mx-auto",
                            isActive
                              ? "text-[var(--sidebar-icon-active)]"
                              : "text-[var(--sidebar-icon-inactive)]"
                          )}
                        />
                        {!collapsed && (
                          <span className="ml-2 text-[var(--sidebar-text)]">
                            {item.name}
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    )}
                  </Tooltip>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="mb-3">
            {!collapsed && (
              <p className="text-xs text-muted-foreground mb-1.5 px-1">
                {t("language.label")}
              </p>
            )}
            <LanguageSwitcher collapsed={collapsed} />
          </div>
          <div
            className={cn(
              "sidebar-user",
              collapsed && "sidebar-user--collapsed"
            )}
          >
            <div className="sidebar-user-avatar">
              <span className="text-sm font-semibold text-accent-foreground">
                {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="sidebar-user-name truncate">
                  {user?.name ?? t("common.empty.noData")}
                </p>
                <p className="sidebar-user-role truncate">
                  {user ? roleLabel[user.role] : t("common.roles.mechanic")}
                </p>
              </div>
            )}
          </div>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "sidebar-logout",
                  collapsed && "sidebar-logout--collapsed"
                )}
                aria-label={logoutLabel}
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 text-[var(--sidebar-logout-icon)]" />
                {!collapsed && <span>{logoutLabel}</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                {logoutLabel}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>

      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn("sidebar-toggle", "hidden md:flex")}
            style={{
              left: `${sidebarPixelWidth + 10}px`,
              top: "40px",
            }}
            aria-label={ariaLabel}
            aria-pressed={!collapsed}
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{ariaLabel}</TooltipContent>
      </Tooltip>

      <main className="min-h-screen px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
