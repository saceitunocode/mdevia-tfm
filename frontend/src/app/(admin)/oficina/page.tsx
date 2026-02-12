"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthData } from "@/lib/auth";

/**
 * Punto de entrada /oficina
 * Redirige al usuario según su estado de autenticación y rol.
 */
export default function OficinaPage() {
  const router = useRouter();

  useEffect(() => {
    const authData = getAuthData();

    if (!authData) {
      // 1. No está logueado -> Al login
      router.replace("/oficina/acceso");
      return;
    }

    // 2. Logueado -> Todos a la Agenda (Centro del sistema)
    router.replace("/oficina/agenda");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-muted-foreground font-sans uppercase tracking-widest text-xs">Cargando oficina...</p>
      </div>
    </div>
  );
}
