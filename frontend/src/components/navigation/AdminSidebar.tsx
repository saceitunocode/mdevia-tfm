"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { ADMIN_MENU_ITEMS } from "@/config/admin-navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Filter items based on user role
  const filteredItems = ADMIN_MENU_ITEMS.filter(item => {
    if (!user) return false;
    const userRole = user.role?.toUpperCase() || "";
    return !item.roles || item.roles.includes(userRole);
  });

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 transition-colors duration-300 z-20">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/oficina" className="flex items-center gap-3">
          <div className="relative w-8 h-8">
             <Image 
               src="/logo.png" 
               alt="FR Inmobiliaria Logo" 
               fill
               className="object-contain"
               priority
             />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground font-heading">
            FR Inmobiliaria
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const isDashboard = item.name === "Dashboard";
            
            return (
              <React.Fragment key={item.href}>
                {isDashboard && (
                   <div className="my-2 border-t border-border mx-2" />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
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

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center w-full">
           <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm">
              {user?.full_name?.charAt(0) || "U"}
           </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
                {user?.full_name || "Cargando..."}
            </p>
            <p className="text-xs text-muted-foreground truncate">
                {user?.role || ""}
            </p>
          </div>
          <button 
            onClick={() => logout()}
            className="ml-2 p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
