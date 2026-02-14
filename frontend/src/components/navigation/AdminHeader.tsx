"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { User, Bell } from "lucide-react";

import { useAuth } from "@/context/auth-context";

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background sticky top-0 z-40 px-8 flex items-center justify-between">
      <h2 className="text-lg font-heading font-bold text-foreground capitalize tracking-tight">
        Panel de Gestión
      </h2>

      <div className="flex items-center space-x-6">
        <ThemeToggle />
        <button className="text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full border-2 border-background" />
        </button>
        <div className="flex items-center space-x-3 pl-6 border-l border-border">
          <div className="text-right flex flex-col items-end">
            <span className="text-sm font-medium leading-none">
              {user?.full_name || "Agente"}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {user?.sub || ""}
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
