"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getAuthData, logout } from "@/lib/auth";
import {
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  ClipboardList,
  LogOut,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const authData = getAuthData();

  const menuItems = [
    { name: "Dashboard", href: "/oficina/panel", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "Propiedades", href: "/oficina/propiedades", icon: Home, roles: ["ADMIN", "AGENT"] },
    { name: "Clientes", href: "/oficina/clientes", icon: Users, roles: ["ADMIN", "AGENT"] },
    { name: "Agenda", href: "/oficina/agenda", icon: Calendar, roles: ["ADMIN", "AGENT"] },
    { name: "Operaciones", href: "/oficina/operaciones", icon: ClipboardList, roles: ["ADMIN", "AGENT"] },
  ].filter(item => !item.roles || (authData && item.roles.includes(authData.role)));

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="text-xl font-heading font-bold text-primary tracking-tighter uppercase">
          FR <span className="text-foreground">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-destructive transition-all group"
        >
          <LogOut className="h-5 w-5 group-hover:text-destructive" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
