"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Bell, Search, Menu, X, LogOut, Building2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ADMIN_MENU_ITEMS } from "@/config/admin-navigation";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Filter items for mobile menu
  const filteredItems = ADMIN_MENU_ITEMS.filter(item => {
    if (!user) return false;
    const userRole = user.role?.toUpperCase() || "";
    return !item.roles || item.roles.includes(userRole);
  });

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-8 py-3 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-1 -ml-1 text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight font-heading">
              Panel de Gestión
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
              Hola, {user?.full_name?.split(" ")[0] || "Agente"}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Bar (Visual Only) */}
          <div className="relative w-64 hidden lg:block group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              readOnly
              className="block w-full pl-10 pr-3 py-2 border border-input rounded-lg leading-5 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm sm:text-sm transition-all cursor-default"
              placeholder="Buscar (Próximamente)..."
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
          </button>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative w-4/5 max-w-xs bg-card h-full shadow-xl animate-in slide-in-from-left duration-200 flex flex-col">
             {/* Drawer Header */}
             <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary text-primary-foreground p-0.5 overflow-hidden flex items-center justify-center shadow-sm">
                     <Building2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-foreground font-heading">
                    FR Inmobiliaria
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
             </div>

             {/* Navigation Links */}
             <div className="flex-1 overflow-y-auto py-6 px-4 bg-card">
                <nav className="space-y-1">
                  {filteredItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const isDashboard = item.name === "Dashboard";

                    return (
                      <React.Fragment key={item.href}>
                        {isDashboard && (
                           <div className="my-2 border-t border-border" />
                        )}
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all",
                            isActive
                              ? "bg-primary/10 text-primary shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className={cn(
                            "mr-3 h-5 w-5 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          )} />
                          {item.name}
                        </Link>
                      </React.Fragment>
                    );
                  })}
                </nav>
             </div>

             {/* Drawer Footer */}
             <div className="p-4 border-t border-border bg-muted/20 pb-safe">
                <div className="flex items-center w-full gap-3">
                   <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm shrink-0">
                      {user?.full_name?.charAt(0) || "U"}
                   </div>
                  <div className="min-w-0 flex-1 flex flex-col">
                    <p className="text-sm font-semibold text-foreground truncate">
                        {user?.full_name || "Cargando..."}
                    </p>
                    <p className="text-xs text-muted-foreground truncate capitalize">
                        {user?.role?.toLowerCase() || ""}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                    }}
                    className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all shadow-sm shrink-0"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
}
