import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Home, MapPin, Key } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-primary px-4">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="container relative z-20 text-center text-white space-y-6">
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter uppercase whitespace-pre-line">
            Encuentra tu hogar{"\n"}en Córdoba & Andújar
          </h1>
          <p className="text-xl md:text-2xl font-sans max-w-2xl mx-auto text-white/90">
            Más de 20 años conectando familias con sus sueños. Confianza total en cada gestión.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/propiedades">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none shadow-xl w-full sm:w-auto">
                Ver Propiedades
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto">
              Contactar
            </Button>
          </div>
        </div>
      </section>

      {/* Categories / Quick Search */}
      <section className="container mx-auto px-4 -mt-16 relative z-30">
        <Card className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-border shadow-2xl">
          <div className="p-8 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Key size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold uppercase text-sm">Alquiler</h3>
              <p className="text-muted-foreground text-xs font-sans">Busca el piso perfecto para ti.</p>
            </div>
          </div>
          <div className="p-8 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Home size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold uppercase text-sm">Venta</h3>
              <p className="text-muted-foreground text-xs font-sans">Casas, chalets y terrenos.</p>
            </div>
          </div>
          <div className="p-8 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold uppercase text-sm">Suelos</h3>
              <p className="text-muted-foreground text-xs font-sans">Oportunidades de inversión.</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Design System Reference (Moved to bottom or kept as showcase) */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold tracking-tight uppercase">Base Tecnológica</h2>
          <p className="text-muted-foreground font-sans">Fundaciones visuales de la plataforma.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipografía Corporativa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground font-bold">Outfit (Headings)</p>
                <p className="text-2xl font-heading font-bold text-primary">FR Inmobiliaria</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground font-bold">Inter (Body)</p>
                <p className="text-sm font-sans text-foreground leading-relaxed">
                  Sistema optimizado para legibilidad extrema y rendimiento.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Colores Oficiales</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <div className="h-12 w-12 bg-primary rounded shadow-sm border border-black/5" title="FR Blue" />
              <div className="h-12 w-12 bg-accent rounded shadow-sm border border-black/5" title="FR Green" />
              <div className="h-12 w-12 bg-background rounded shadow-sm border border-border" title="Pure White" />
              <div className="h-12 w-12 bg-foreground rounded shadow-sm border border-black/5" title="Pure Black" />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
