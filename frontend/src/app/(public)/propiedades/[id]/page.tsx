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
  Maximize, 
  CheckCircle2, 
  Info
} from "lucide-react";

interface PropertyDetail {
  id: string;
  title: string;
  city: string;
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
      <section className="relative h-[60vh] min-h-[500px] w-full bg-muted">
        <PropertyGallery images={property.images} />
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-border/50 pb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={property.status === "SALE" ? "default" : "secondary"} className="uppercase tracking-wider">
                    {property.status === "SALE" ? "En Venta" : "Alquiler"}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.city}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  {property.title}
                </h1>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary flex items-baseline gap-1">
                  {formatPrice(property.price_amount, property.price_currency)}
                  {property.operation_type === "RENT" && (
                    <span className="text-lg font-bold"> /mes</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {property.sqm > 0 ? formatPrice(parseInt(property.price_amount) / property.sqm, property.price_currency).replace(",00", "") + "/m²" : ""}
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-border/50">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-primary/10 rounded-xl text-primary">
                   <BedDouble className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Habitaciones</p>
                   <p className="font-bold text-lg">{property.rooms}</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    {/* Lucide doesn't have a bathtub icon exactly like Material, sticking to BedDouble style or generic */}
                   <span className="text-xl font-bold">🛁</span> 
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Baños</p>
                   <p className="font-bold text-lg">{property.baths}</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-primary/10 rounded-xl text-primary">
                   <Maximize className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Superficie</p>
                   <p className="font-bold text-lg">{property.sqm} m²</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-primary/10 rounded-xl text-primary">
                   <div className="h-6 w-6 flex items-center justify-center font-bold text-lg">P</div>
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Planta</p>
                   <p className="font-bold text-lg">{property.floor !== null && property.floor !== undefined ? (property.floor === 0 ? "Baja" : property.floor) : "N/A"}</p>
                 </div>
               </div>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold font-heading mb-4">Descripción de la propiedad</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.public_description || "Sin descripción detallada."}
              </p>
            </div>

            {/* Detailed Features */}
            <div>
              <h3 className="text-xl font-bold font-heading mb-6">Características detalladas</h3>
              <div className="bg-muted/30 rounded-xl p-6 border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Tipo de inmueble</span>
                    <span className="font-medium">
                      {property.type === "HOUSE" ? "Casa" : 
                       property.type === "APARTMENT" ? "Piso" : 
                       property.type === "OFFICE" ? "Oficina" : 
                       property.type === "LAND" ? "Terreno" : property.type}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Certificado Energético</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">A - Eficiente</Badge>
                  </div>
                   <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Año de construcción</span>
                    <span className="font-medium">2019</span>
                  </div>
                   <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Estado</span>
                    <span className="font-medium">Excelente</span>
                  </div>
                </div>

                <h4 className="font-bold mt-6 mb-4">Extras y Equipamiento</h4>
                <div className="flex flex-wrap gap-2">
                  {property.has_elevator && (
                     <Badge variant="secondary" className="px-3 py-1">Ascensor</Badge>
                  )}
                  <Badge variant="secondary" className="px-3 py-1">Aire Acondicionado</Badge>
                  <Badge variant="secondary" className="px-3 py-1">Calefacción</Badge>
                  <Badge variant="secondary" className="px-3 py-1">Terraza</Badge>
                </div>
              </div>
            </div>
            
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
             <div className="sticky top-24 space-y-6">
                <Card className="overflow-hidden border-border shadow-lg">
                   <div className="p-6 bg-linear-to-r from-primary to-primary/80 text-primary-foreground">
                      <div className="flex items-center gap-4">
                         <div className="h-16 w-16 rounded-full bg-white/20 border-2 border-white/30" />
                         <div>
                            <p className="text-xs uppercase tracking-wider text-primary-foreground/80 font-bold">Tu Asesor</p>
                            <h3 className="font-bold text-lg">{property.captor_agent?.full_name || "Agente FR"}</h3>
                            <div className="flex items-center text-xs mt-1">
                               <CheckCircle2 className="h-3 w-3 mr-1" />
                               {property.captor_agent?.email || "Agente Certificado"}
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="p-6 space-y-4">
                      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Tu nombre" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="tu@email.com" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Teléfono</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="+34 600 000 000" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Mensaje</label>
                            <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" rows={3} defaultValue={`Hola, estoy interesado en ${property.title}.`} />
                         </div>
                         
                         <Button className="w-full font-bold text-md h-12" size="lg">SOLICITAR VISITA</Button>
                      </form>

                      <div className="pt-4 border-t border-border flex justify-center gap-4">
                         <Button variant="outline" className="flex-1 gap-2">
                            Llamar
                         </Button>
                         <Button variant="outline" className="flex-1 gap-2">
                            WhatsApp
                         </Button>
                      </div>
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
                 <p className="max-w-xl text-primary-foreground/90">Calcula tu cuota hipotecaria y descubre las mejores condiciones con nuestros partners financieros.</p>
              </div>
              <Button size="lg" variant="secondary" className="font-bold whitespace-nowrap text-primary">
                 Calcular Hipoteca
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

