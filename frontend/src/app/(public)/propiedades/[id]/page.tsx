"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { PropertyGallery } from "@/components/public/PropertyGallery";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  MapPin, 
  BedDouble, 
  Info,
  Bath,
  Layers,
  Ruler,
  ArrowUp,
  TrendingUp
} from "lucide-react";

interface PropertyDetail {
  id: string;
  title: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  postal_code?: string | null;
  sqm: number;
  rooms: number;
  baths: number;
  floor?: number | null;
  has_elevator: boolean;
  status: string;
  price_amount: string;
  price_currency: string;
  public_description: string;
  images: { id: string; public_url: string; is_cover: boolean; alt_text?: string }[];
  type: string;
  operation_type: string;
  created_at: string;
  updated_at: string;
  captor_agent?: {
    id: string;
    full_name: string;
    email: string;
    phone_number?: string;
  };
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
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Gallery */}
      <section className="relative h-[35vh] md:h-[60vh] min-h-[300px] md:min-h-[500px] w-full bg-muted">
        <PropertyGallery 
          images={property.images} 
          className="h-[35vh] md:h-[60vh] min-h-[300px] md:min-h-[500px]" 
        />
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border/50 pb-10">
              <div className="space-y-4 flex-1">
                <Badge 
                  variant={property.operation_type === "SALE" ? "default" : "accent"} 
                  className="uppercase tracking-widest text-[10px] font-black h-6 px-3"
                >
                  {property.operation_type === "SALE" ? "En Venta" : "Alquiler"}
                </Badge>

                <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-[1.1] tracking-tight">
                  {property.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-3 gap-x-4">
                  <div className="flex items-center gap-2.5 bg-primary/5 dark:bg-primary/10 px-3.5 py-2 rounded-xl border border-primary/10 shadow-sm transition-all hover:bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-bold text-foreground/90">
                      {property.address_line1}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-muted-foreground pl-1">
                    <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1.5 rounded-lg border border-border/40">
                      <span className="text-[11px] font-black uppercase tracking-tighter opacity-40">CP</span>
                      <span className="text-sm font-bold text-foreground/70">{property.postal_code || "---"}</span>
                    </div>
                    
                    <span className="h-1 w-1 rounded-full bg-primary/30" />
                    
                    <span className="text-sm font-black uppercase tracking-[0.15em] text-muted-foreground/80">
                      {property.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-1 shrink-0 bg-primary/5 md:bg-transparent p-4 md:p-0 rounded-2xl w-full md:w-auto border border-primary/10 md:border-none shadow-sm md:shadow-none">
                <div className="text-3xl md:text-5xl font-black text-primary flex items-baseline gap-1 tracking-tighter">
                  {formatPrice(property.price_amount, property.price_currency)}
                  {property.operation_type === "RENT" && (
                    <span className="text-xl md:text-2xl font-bold opacity-80">/mes</span>
                  )}
                </div>
                <div className="flex items-center gap-2 md:justify-end w-full">
                  <p className="text-xs md:text-sm font-bold text-muted-foreground/80 uppercase tracking-widest">
                    {property.sqm > 0 ? formatPrice(parseInt(property.price_amount) / property.sqm, property.price_currency).replace(",00", "") + "/m²" : ""}
                  </p>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Horizontal Key Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:overflow-x-auto sm:pb-4 sm:scrollbar-hide lg:overflow-visible lg:pb-0">
               {/* SQM Card */}
               <Card className="flex items-center gap-4 p-4 min-w-[160px] flex-1 border-border/50 shadow-sm">
                 <div className="text-primary">
                   <Ruler className="h-6 w-6" />
                 </div>
                 <div className="flex items-baseline gap-1.5">
                   <span className="text-2xl font-bold text-foreground">{property.sqm}</span>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Metros ²</span>
                 </div>
               </Card>

               {/* Rooms Card */}
               <Card className="flex items-center gap-4 p-4 min-w-[170px] flex-1 border-border/50 shadow-sm">
                 <div className="text-primary">
                   <BedDouble className="h-6 w-6" />
                 </div>
                 <div className="flex items-baseline gap-1.5">
                   <span className="text-2xl font-bold text-foreground">{property.rooms}</span>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Habitaciones</span>
                 </div>
               </Card>

               {/* Baths Card */}
               <Card className="flex items-center gap-4 p-4 min-w-[150px] flex-1 border-border/50 shadow-sm">
                 <div className="text-primary">
                   <Bath className="h-6 w-6" />
                 </div>
                 <div className="flex items-baseline gap-1.5">
                   <span className="text-2xl font-bold text-foreground">{property.baths}</span>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Baños</span>
                 </div>
               </Card>

               {/* Floor Card with Elevator Badge */}
               <Card className="flex items-start sm:items-center justify-between p-4 min-w-[200px] flex-1 border-border/50 shadow-sm relative overflow-hidden">
                 <div className="flex items-center gap-4">
                    <div className="text-primary mt-0.5 sm:mt-0">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-foreground">
                        {property.floor !== null && property.floor !== undefined ? `${property.floor}ª` : "N/D"}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Planta</span>
                    </div>
                 </div>
                 
                 {property.has_elevator && (
                   <div className="bg-emerald-500 text-white px-2 py-0.5 rounded-t-md flex items-center gap-1 shadow-sm transition-transform hover:scale-105 md:static md:rounded-full md:px-2.5 md:py-1.5 absolute bottom-0 left-[56px] md:left-auto">
                     <ArrowUp className="h-2.5 w-2.5 stroke-3" />
                     <span className="text-[8px] font-black uppercase tracking-tighter">Ascensor</span>
                   </div>
                 )}
               </Card>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold font-heading mb-4">Descripción de la propiedad</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.public_description || "Sin descripción detallada."}
              </p>
            </div>
            
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
             <div className="sticky top-24 space-y-6">
                <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
                    <div className="p-8 text-center bg-linear-to-b from-primary/5 to-transparent border-b border-border/50">
                       <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center font-bold text-3xl text-primary mb-4 border-2 border-primary/20 shadow-inner">
                          {property.captor_agent?.full_name?.charAt(0).toUpperCase() || "A"}
                       </div>
                       <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black mb-1">Agente Responsable</p>
                       <h3 className="font-heading font-bold text-2xl text-foreground mb-1">
                          {property.captor_agent?.full_name || "Asesor Inmobiliario"}
                       </h3>
                       <p className="text-sm text-muted-foreground">
                          {property.captor_agent?.email || "info@mdevia.com"}
                       </p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                       <div className="text-center space-y-2">
                          <p className="text-sm font-medium text-foreground px-4">
                             Contacta directamente con el agente para coordinar una visita o resolver tus dudas.
                          </p>
                       </div>

                       <div className="grid grid-cols-1 gap-3">
                          <Button 
                             className="w-full h-14 font-black text-lg gap-3 shadow-lg shadow-primary/20" 
                             size="lg"
                             onClick={() => window.location.href = `tel:${property.captor_agent?.phone_number || ""}`}
                          >
                             <span className="text-xl">📞</span> LLAMAR AHORA
                          </Button>
                          <Button 
                             variant="outline" 
                             className="w-full h-14 font-black text-lg gap-3 border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-500/40 transition-all" 
                             size="lg"
                             onClick={() => window.open(`https://wa.me/${property.captor_agent?.phone_number?.replace(/\s+/g, '') || ""}`, '_blank')}
                          >
                             <span className="text-xl">💬</span> WHATSAPP
                          </Button>
                       </div>

                       <p className="text-center text-[10px] text-muted-foreground pt-2">
                          Disponibilidad inmediata para atenderte
                       </p>
                    </div>
                </Card>

             </div>
          </div>
        </div>

        {/* Mortgage CTA */}
        <div className="mt-16 bg-primary rounded-2xl p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-primary-foreground">
                 <h3 className="text-2xl font-bold font-heading mb-2">¿Necesitas financiación?</h3>
                 <p className="max-w-xl text-primary-foreground/90 font-medium">Contamos con los mejores asesores financieros para conseguirte las condiciones que mejor se adaptan a ti.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
