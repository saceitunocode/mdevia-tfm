"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard, type PropertyCardData } from "@/components/public/PropertyCard";
import { PropertyFilters } from "@/components/public/PropertyFilters";
import { propertyService, type PropertyFilterParams } from "@/services/propertyService";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { AlertCircle, SearchX, ChevronLeft, ChevronRight } from "lucide-react";

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
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [total, setTotal] = useState(0); // For pagination
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const page = parseInt(searchParams.get("page") || "1");
  const offset = (page - 1) * PAGE_SIZE;

  // View Toggle State (Adding visual only for now as per design)
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
        status: searchParams.get("status") || undefined,
        type: searchParams.getAll("type"),
        amenities: searchParams.getAll("amenities"),
        limit: PAGE_SIZE,
        offset: offset,
      };

      const data = await propertyService.getPublicProperties(filters);
      // Handle potential API response formats
      if (Array.isArray(data)) {
          setProperties(data);
          setTotal(data.length); // Fallback
      } else {
          setProperties(data.items);
          setTotal(data.total);
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al cargar propiedades");
    } finally {
      setLoading(false);
    }
  }, [searchParams, offset]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Propiedades en Venta y Alquiler</h1>
          <p className="text-muted-foreground mt-1 text-lg">Descubre tu hogar ideal en nuestra selección exclusiva.</p>
        </div>
        
        {/* View Toggles */}
        <div className="flex items-center bg-muted/20 p-1 rounded-lg border border-border/50 shadow-sm">
           <button 
             onClick={() => setViewMode("grid")}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
           >
             Grid
           </button>
           <button 
             onClick={() => setViewMode("list")}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
           >
             List
           </button>
           <button 
             onClick={() => setViewMode("map")}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
           >
             Map
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-72 lg:shrink-0">
            <PropertyFilters key={searchParams.toString()} />
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="mb-6 flex justify-between items-center text-sm">
                <p className="text-muted-foreground">
                   Mostrando <span className="font-bold text-foreground">{properties.length}</span> de <span className="font-bold text-foreground">{total}</span> propiedades
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground hidden sm:inline">Ordenar por:</span>
                    <select className="bg-transparent border-none text-foreground font-medium focus:ring-0 cursor-pointer pl-0 pr-8 text-right appearance-none">
                        <option>Más recientes</option>
                        <option>Precio: Bajo a Alto</option>
                        <option>Precio: Alto a Bajo</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
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
                    <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 rounded-xl border border-dashed border-border">
                        <SearchX className="h-12 w-12 text-muted-foreground/50" />
                        <h2 className="text-xl font-semibold">Sin resultados</h2>
                        <p className="text-muted-foreground max-w-md">No encontramos propiedades que coincidan con tus filtros.</p>
                        <Button variant="outline" onClick={() => window.location.href = '/propiedades'}>Limpiar filtros</Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Pagination (Visual Placeholder based on design) */}
                        <div className="mt-12 flex justify-center">
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                <button disabled={page === 1} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                    {page}
                                </button>
                                <button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 md:inline-flex">
                                    {page + 1}
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-border focus:outline-offset-0">
                                    ...
                                </span>
                                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </>
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
