"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { PropertyGallery } from "@/components/public/PropertyGallery";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  MapPin, 
  BedDouble, 
  Maximize, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft,
  Share2,
  Info
} from "lucide-react";

interface PropertyDetail {
  id: string;
  title: string;
  city: string;
  sqm: number;
  rooms: number;
  floor?: number;
  has_elevator: boolean;
  status: string;
  price_amount: string;
  price_currency: string;
  public_description: string;
  images: { id: string; public_url: string; is_cover: boolean; alt_text?: string }[];
  created_at: string;
  updated_at: string;
}

function DetailSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4 space-y-8 animate-pulse">
      <Skeleton className="h-6 w-32" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function formatPrice(amount: string | number | null, currency: string): string {
  if (!amount) return "Consultar";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num);
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await apiRequest<PropertyDetail>(`/properties/public/${resolvedParams.id}`);
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cargar la propiedad");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [resolvedParams.id]);

  if (loading) return <DetailSkeleton />;

  if (error || !property) {
    return (
      <div className="container mx-auto py-20 px-4 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <Info className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Inmueble no encontrado</h1>
        <p className="text-muted-foreground mx-auto max-w-md">
          Es posible que la propiedad ya no esté disponible o que el enlace sea incorrecto.
        </p>
        <Link href="/propiedades">
          <Button variant="outline">Volver al catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link 
          href="/propiedades" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a resultados
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Gallery + Description */}
        <div className="lg:col-span-2 space-y-10">
          <PropertyGallery images={property.images} />

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">Venta</Badge>
                <div className="flex items-center text-muted-foreground text-sm font-medium ml-2">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  {property.city}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-foreground leading-tight">
                {property.title}
              </h1>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.price_amount, property.price_currency)}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-border">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg text-center">
                <BedDouble className="h-6 w-6 text-primary mb-2" />
                <span className="text-xl font-bold leading-none">{property.rooms}</span>
                <span className="text-xs text-muted-foreground uppercase mt-1">Habitaciones</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg text-center">
                <Maximize className="h-6 w-6 text-primary mb-2" />
                <span className="text-xl font-bold leading-none">{property.sqm}</span>
                <span className="text-xs text-muted-foreground uppercase mt-1">m² Superficie</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg text-center">
                <div className="h-6 flex items-baseline justify-center mb-2">
                  <span className="text-xl font-bold leading-none">{property.floor || "—"}</span>
                </div>
                <span className="text-xs text-muted-foreground uppercase">Planta</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg text-center">
                <CheckCircle2 className={cn("h-6 w-6 mb-2", property.has_elevator ? "text-primary" : "text-muted-foreground/30")} />
                <span className="text-sm font-bold leading-none">{property.has_elevator ? "SÍ" : "NO"}</span>
                <span className="text-xs text-muted-foreground uppercase mt-1">Ascensor</span>
              </div>
            </div>

            {/* Public Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-heading uppercase tracking-wide">Descripción</h2>
              <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line font-sans">
                {property.public_description || "No hay descripción pública disponible para esta propiedad."}
              </div>
            </div>

            {/* Extra Info */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Detalles del anuncio</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Publicado: {new Date(property.created_at).toLocaleDateString("es-ES")}
                </div>
                <div>ID: {property.id.split("-")[0].toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Contact / Summary sticky */}
        <aside className="space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            <Card className="p-6 border-primary/20 bg-primary/5 shadow-xl">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold font-heading uppercase">¿Te interesa estainmueble?</h3>
                  <p className="text-sm text-muted-foreground">
                    Envíanos tus datos y un agente de FR Inmobiliaria se pondrá en contacto contigo lo antes posible.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full text-lg h-12" size="lg">Contactar ahora</Button>
                  <Button variant="outline" className="w-full h-12">Solicitar visita</Button>
                </div>

                <div className="pt-4 border-t border-primary/10 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-primary font-bold">
                    <span>957 000 000</span>
                  </div>
                  <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none">
                    Llamada gratuita FR Córdoba
                  </p>
                </div>
              </div>
            </Card>

            <div className="rounded-xl border border-border p-6 space-y-4 bg-muted/20">
              <h4 className="font-bold text-sm uppercase tracking-wider">Ubica tu propiedad</h4>
              <div className="aspect-square relative rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center text-center p-10 cursor-not-allowed">
                  <div className="space-y-2">
                    <MapPin className="h-8 w-8 mx-auto text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Vista de Mapa</p>
                    <p className="text-[10px] text-muted-foreground italic">Disponible próximamente</p>
                  </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Info className="h-3 w-3" />
                La ubicación exacta se proporcionará en la visita.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

