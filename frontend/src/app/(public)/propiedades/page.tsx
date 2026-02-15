"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyCard, type PropertyCardData } from "@/components/public/PropertyCard";
import { PropertyFilters } from "@/components/public/PropertyFilters";
import { propertyService, type PropertyFilterParams } from "@/services/propertyService";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { AlertCircle, SearchX, ChevronLeft, ChevronRight, MapPin, Ruler, BedDouble, Bath, LayoutGrid, List as ListIcon, Map as MapIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Dynamic import for Map to avoid SSR issues with Leaflet
const PropertyMapView = dynamic(
  () => import("@/components/properties/PropertyMapView"),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground font-medium">Cargando Mapa...</div>
  }
);

const PAGE_SIZE = 12;

function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden h-full">
      <Skeleton className="h-60 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex justify-between pt-4 border-t border-border">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

function ShowcaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [total, setTotal] = useState(0); // For pagination
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const page = parseInt(searchParams.get("page") || "1");
  const offset = (page - 1) * PAGE_SIZE;

  // View Toggle State
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: PropertyFilterParams = {
        city: searchParams.get("city") || undefined,
        price_min: searchParams.get("price_min") ? Number(searchParams.get("price_min")) : undefined,
        price_max: searchParams.get("price_max") ? Number(searchParams.get("price_max")) : undefined,
        sqm_min: searchParams.get("sqm_min") ? Number(searchParams.get("sqm_min")) : undefined,
        sqm_max: searchParams.get("sqm_max") ? Number(searchParams.get("sqm_max")) : undefined,
        rooms: searchParams.get("rooms") ? Number(searchParams.get("rooms")) : undefined,
        baths: searchParams.get("baths") ? Number(searchParams.get("baths")) : undefined,
        status: searchParams.get("status") || undefined,
        property_type: searchParams.getAll("property_type"),
        operation_type: searchParams.get("operation_type") || undefined,
        has_elevator: searchParams.get("has_elevator") === "true" ? true : searchParams.get("has_elevator") === "false" ? false : undefined,
        amenities: searchParams.getAll("amenities"),
        sort: searchParams.get("sort") || undefined,
        limit: viewMode === "map" ? 100 : PAGE_SIZE, // Load more for map
        offset: viewMode === "map" ? 0 : offset,
      };

      const data = await propertyService.getPublicProperties(filters);
      setProperties(data.items);
      setTotal(data.total);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al cargar propiedades");
    } finally {
      setLoading(false);
    }
  }, [searchParams, offset, viewMode]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("sort", e.target.value);
    } else {
      params.delete("sort");
    }
    params.set("page", "1"); // Reset context
    router.push(`/propiedades?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/propiedades?${params.toString()}`);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-72 lg:shrink-0">
            <PropertyFilters />
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Viviendas Disponibles</h1>
                <p className="text-muted-foreground mt-1 text-base">Encuentra tu próximo hogar entre nuestras mejores ofertas.</p>
              </div>
              
              {/* View Toggles */}
              <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border/50 shadow-inner shrink-0 scale-95 origin-right">
                 <button 
                   onClick={() => setViewMode("grid")}
                   className={cn(
                     "p-2.5 rounded-lg transition-all duration-200",
                     viewMode === 'grid' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'
                   )}
                   title="Vista Cuadrícula"
                 >
                   <LayoutGrid size={20} />
                 </button>
                 <button 
                   onClick={() => setViewMode("list")}
                   className={cn(
                     "p-2.5 rounded-lg transition-all duration-200",
                     viewMode === 'list' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'
                   )}
                   title="Vista Lista"
                 >
                   <ListIcon size={20} />
                 </button>
                 <button 
                   onClick={() => setViewMode("map")}
                   className={cn(
                     "p-2.5 rounded-lg transition-all duration-200",
                     viewMode === 'map' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'
                   )}
                   title="Vista Mapa"
                 >
                   <MapIcon size={20} />
                 </button>
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6 flex justify-between items-center text-sm border-b border-border shadow-sm bg-card p-4 rounded-xl">
                <p className="text-muted-foreground font-medium">
                   Mostrando <span className="font-bold text-primary">{properties.length}</span> de <span className="font-bold text-foreground">{total}</span> propiedades
                </p>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground hidden sm:inline font-medium">Ordenar por:</span>
                    <select 
                      value={searchParams.get("sort") || "newest"}
                      onChange={handleSortChange}
                      className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-foreground font-semibold focus:ring-2 focus:ring-primary cursor-pointer appearance-none transition-all"
                    >
                        <option value="newest">Más recientes</option>
                        <option value="price_asc">Precio: Bajo a Alto</option>
                        <option value="price_desc">Precio: Alto a Bajo</option>
                    </select>
                </div>
            </div>

            {/* Content Switcher */}
            <div className="min-h-[600px]">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PropertyCardSkeleton key={i} />
                    ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 rounded-xl border border-dashed border-destructive/20 bg-destructive/5">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <h2 className="text-xl font-semibold text-destructive">Error al cargar datos</h2>
                        <p className="text-muted-foreground">{error}</p>
                        <Button onClick={fetchProperties}>Reintentar</Button>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 rounded-xl border border-dashed border-border bg-card">
                        <SearchX className="h-12 w-12 text-muted-foreground/50" />
                        <h2 className="text-xl font-semibold">Sin resultados</h2>
                        <p className="text-muted-foreground max-w-md">No encontramos propiedades que coincidan con tus filtros.</p>
                        <Button variant="outline" onClick={() => window.location.href = '/propiedades'}>Limpiar filtros</Button>
                    </div>
                ) : viewMode === "grid" ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm border border-border overflow-hidden bg-card">
                                <button 
                                  disabled={page === 1} 
                                  onClick={() => handlePageChange(page - 1)}
                                  className="relative inline-flex items-center px-3 py-2 text-muted-foreground hover:bg-muted focus:z-20 focus:outline-offset-0 disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => {
                                  const p = i + 1;
                                  return (
                                    <button
                                      key={p}
                                      onClick={() => handlePageChange(p)}
                                      className={cn(
                                        "relative inline-flex items-center px-4 py-2 text-sm font-bold focus:z-20 transition-colors",
                                        p === page ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted cursor-pointer"
                                      )}
                                    >
                                      {p}
                                    </button>
                                  );
                                })}
                                <button 
                                  disabled={page === totalPages}
                                  onClick={() => handlePageChange(page + 1)}
                                  className="relative inline-flex items-center px-3 py-2 text-muted-foreground hover:bg-muted focus:z-20 focus:outline-offset-0 disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </>
                ) : viewMode === "list" ? (
                    <div className="space-y-4">
                      {properties.map((property) => {
                        const coverImage = property.images.find(img => img.is_cover) || property.images[0];
                        const isForRent = property.operation_type === "RENT";
                        const priceNum = typeof property.price_amount === "string" ? parseFloat(property.price_amount) : (property.price_amount || 0);

                        return (
                          <div key={property.id} className="group relative bg-card rounded-2xl border border-border/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row h-full md:h-48">
                            <Link href={`/propiedades/${property.id}`} className="absolute inset-0 z-10" />
                            
                            <div className="relative w-full md:w-64 h-48 md:h-full shrink-0">
                               {coverImage ? (
                                 <Image src={coverImage.public_url} alt={property.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                               ) : (
                                 <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">Sin Imagen</div>
                               )}
                               <div className={cn(
                                 "absolute top-4 left-4 z-20 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white border shadow-sm",
                                 isForRent ? "bg-accent border-accent/50" : "bg-primary border-primary/50"
                               )}>
                                 {isForRent ? "Alquiler" : "Venta"}
                               </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1 justify-between">
                               <div>
                                  <div className="flex justify-between items-start mb-2">
                                     <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{property.title}</h3>
                                     <span className="text-xl font-bold text-foreground shrink-0">
                                       {new Intl.NumberFormat('es-ES', { style: 'currency', currency: property.price_currency || 'EUR', maximumFractionDigits: 0 }).format(priceNum)}
                                       {isForRent && <span className="text-xs opacity-60"> /mes</span>}
                                     </span>
                                  </div>
                                  <div className="flex items-center text-muted-foreground text-sm gap-1 mb-4">
                                     <MapPin size={14} className="text-primary" /> {property.city}
                                  </div>
                                </div>

                               <div className="flex items-center gap-6 py-3 border-t border-border/40">
                                  <div className="flex items-center gap-2"><Ruler size={16} className="text-primary/70" /> <span className="text-sm font-semibold">{property.sqm}m²</span></div>
                                  <div className="flex items-center gap-2"><BedDouble size={16} className="text-primary/70" /> <span className="text-sm font-semibold">{property.rooms} hab.</span></div>
                                  <div className="flex items-center gap-2"><Bath size={16} className="text-primary/70" /> <span className="text-sm font-semibold">{property.baths} baños</span></div>
                               </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-700 h-[600px]">
                       <PropertyMapView isPublic={true} properties={properties} />
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={
        <div className="container mx-auto py-10 px-4">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                ))}
             </div>
        </div>
    }>
      <ShowcaseContent />
    </Suspense>
  );
}
