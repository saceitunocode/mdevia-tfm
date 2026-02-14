"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { PublicNavbar } from "@/components/navigation/PublicNavbar";
import { PublicFooter } from "@/components/navigation/PublicFooter";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí se podría integrar Sentry o cualquier otro logger
    console.error("Error capturado por ErrorBoundary global:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12 text-center">
        <div className="relative mb-8 text-destructive">
          <div className="absolute -inset-4 rounded-full bg-destructive/5 blur-2xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
        </div>
      
      <h1 className="mb-2 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        ¡Vaya! Algo salió mal
      </h1>
      
      <p className="mb-4 text-xl font-medium text-foreground">
        Error del servidor (500)
      </p>
      
      <p className="mb-10 max-w-md text-muted-foreground">
        Hemos tenido un problema técnico inesperado. Nuestro equipo ha sido notificado
        y estamos trabajando para solucionarlo lo antes posible.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button 
          onClick={() => reset()} 
          variant="primary" 
          className="w-full sm:w-auto gap-2"
        >
          <RefreshCw size={16} />
          Reintentar
        </Button>
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Home size={16} />
            Página de inicio
          </Button>
        </Link>
      </div>

      <div className="mt-16 flex items-center space-x-2 text-2xl font-heading font-bold text-primary tracking-tighter uppercase pointer-events-none opacity-20">
        FR <span className="text-foreground ml-1">Inmobiliaria</span>
      </div>
      
      {error.digest && (
        <p className="mt-8 text-xs font-mono text-muted-foreground uppercase opacity-50">
          ID de error: {error.digest}
        </p>
      )}
      </main>
      <PublicFooter />
    </div>
  );
}
