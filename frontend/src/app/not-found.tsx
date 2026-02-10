import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { PublicNavbar } from "@/components/navigation/PublicNavbar";
import { PublicFooter } from "@/components/navigation/PublicFooter";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="relative mb-8">
        <div className="absolute -inset-4 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Search size={48} strokeWidth={1.5} />
        </div>
      </div>
      
      <h1 className="mb-2 font-heading text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
        404
      </h1>
      
      <p className="mb-4 text-2xl font-semibold text-foreground">
        Propiedad no encontrada
      </p>
      
      <p className="mb-10 max-w-md text-muted-foreground">
        Lo sentimos, la página que estás buscando no existe o ha sido movida. 
        ¿Quizás buscas una propiedad que ya ha sido vendida?
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/">
          <Button variant="primary" className="w-full sm:w-auto">
            Volver al inicio
          </Button>
        </Link>
        <Link href="/propiedades">
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Search size={16} />
            Ver propiedades
          </Button>
        </Link>
      </div>

      <div className="mt-16 flex items-center space-x-2 text-2xl font-heading font-bold text-primary tracking-tighter uppercase pointer-events-none opacity-20">
        FR <span className="text-foreground ml-1">Inmobiliaria</span>
      </div>
      </main>
      <PublicFooter />
    </div>
  );
}
