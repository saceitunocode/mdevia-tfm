"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X, LogOut } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { ADMIN_MENU_ITEMS } from "@/config/admin-navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-8 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-1 -ml-1 text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-base md:text-xl font-bold text-foreground tracking-tight font-heading leading-tight">
              Panel de Gestión
            </h1>
            <p className="hidden md:block text-xs md:text-sm text-muted-foreground">
              Hola, {user?.full_name?.split(" ")[0] || "Agente"}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-100 flex md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[85%] max-w-xs bg-card h-full shadow-2xl flex flex-col overflow-hidden"
            >
               {/* Drawer Header */}
               <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                       <Image 
                         src="/logo.png" 
                         alt="FR Inmobiliaria Logo" 
                         fill
                         className="object-contain"
                       />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-foreground font-heading">
                      FR Inmobiliaria
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-90"
                  >
                    <X className="h-6 w-6" />
                  </button>
               </div>

               {/* Navigation Links */}
               <div className="flex-1 overflow-y-auto py-6 px-4 bg-card scrollbar-none">
                  <nav className="space-y-1.5">
                    {filteredItems.map((item, index) => {
                      const isActive = pathname.startsWith(item.href);
                      const isDashboard = item.name === "Dashboard";

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          {isDashboard && (
                             <div className="my-2 border-t border-border/50 mx-2" />
                          )}
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all active:scale-95",
                              isActive
                                ? "bg-primary/10 text-primary shadow-sm border border-primary/10"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <item.icon className={cn(
                              "mr-3 h-5 w-5 transition-colors",
                              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            {item.name}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
               </div>

               {/* Drawer Footer */}
               <div className="p-5 border-t border-border bg-muted/20 pb-safe shrink-0">
                  <div className="flex items-center w-full gap-4">
                     <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20 shadow-sm shrink-0">
                        {user?.full_name?.charAt(0) || "U"}
                     </div>
                    <div className="min-w-0 flex-1 flex flex-col">
                      <p className="text-sm font-bold text-foreground truncate">
                          {user?.full_name || "Cargando..."}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-black">
                          {user?.role?.toLowerCase() || ""}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                          setIsMobileMenuOpen(false);
                          logout();
                      }}
                      className="p-2.5 rounded-xl bg-background border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all shadow-sm shrink-0 active:scale-90"
                      title="Cerrar Sesión"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
