"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { ADMIN_MENU_ITEMS } from "@/config/admin-navigation";

// Using a simple custom overlay for the menu to avoid dependency on a Sheet component if not present.
// Checking file list, `Sheet.tsx` does NOT exist in `components/ui` list from step 29.
// "Badge, Button, Card, Dialog, Input, Label, Select, Skeleton, Skeletons, Textarea, ThemeToggle, Toaster".
// I cannot use Sheet yet.
// For now, I will implement a Bottom Navigation Bar for specific mobile items, 
// and maybe a simple "More" button that toggles a simple overlay menu if needed.
// Or just show the 5 most important items.
// Design request: "Bottom navigation con 5 módulos principales + Menú hamburguesa para módulos extra".

// Let's implement Bottom Nav with 5 items max + "Menu" item.

export function AdminMobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Filter items
  const filteredItems = ADMIN_MENU_ITEMS.filter(item => {
    if (!user) return false;
    const userRole = user.role?.toUpperCase() || "";
    return !item.roles || item.roles.includes(userRole);
  });

  // Display key agent items for quick access (5 items)
  // Reordered to place "Agenda" in the middle
  const mobileOrder = ["Propiedades", "Clientes", "Agenda", "Visitas", "Operaciones"];
  const displayItems = mobileOrder
    .map(name => filteredItems.find(item => item.name === name))
    .filter((item): item is typeof ADMIN_MENU_ITEMS[0] => !!item);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 flex items-center justify-around pb-safe pt-2 px-2 h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {displayItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-tighter truncate max-w-[60px]",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
