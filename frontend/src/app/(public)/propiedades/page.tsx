"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard, type PropertyCardData } from "@/components/public/PropertyCard";
import { PropertyFilters } from "@/components/public/PropertyFilters";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Building2, AlertCircle, SearchX } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const PAGE_SIZE = 12;

function PropertyCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-7 w-1/3" />
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="px-6 pb-6">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

function ShowcaseContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const buildApiUrl = useCallback(
    (currentOffset: number) => {
      const params = new URLSearchParams();
      const city = searchParams.get("city");
      const priceMin = searchParams.get("price_min");
      const priceMax = searchParams.get("price_max");
      const sqmMin = searchParams.get("sqm_min");
      const sqmMax = searchParams.get("sqm_max");
      const rooms = searchParams.get("rooms");

      if (city) params.set("city", city);
      if (priceMin) params.set("price_min", priceMin);
      if (priceMax) params.set("price_max", priceMax);
      if (sqmMin) params.set("sqm_min", sqmMin);
      if (sqmMax) params.set("sqm_max", sqmMax);
      if (rooms) params.set("rooms", rooms);
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(currentOffset));

      return `${API_BASE}/properties/public?${params.toString()}`;
    },
    [searchParams]
  );

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOffset(0);
    try {
      const res = await fetch(buildApiUrl(0));
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: PropertyCardData[] = await res.json();
      setProperties(data);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar propiedades");
    } finally {
      setLoading(false);
    }
  }, [buildApiUrl]);

  const loadMore = async () => {
    const nextOffset = offset + PAGE_SIZE;
    setLoadingMore(true);
    try {
      const res = await fetch(buildApiUrl(nextOffset));
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: PropertyCardData[] = await res.json();
      setProperties((prev) => [...prev, ...data]);
      setOffset(nextOffset);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar más propiedades");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Active filters count
  const activeCount = [
    searchParams.get("city"),
    searchParams.get("price_min"),
    searchParams.get("price_max"),
    searchParams.get("sqm_min"),
    searchParams.get("sqm_max"),
    searchParams.get("rooms"),
  ].filter(Boolean).length;

  return (
    <div className="container mx-auto py-10 px-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-heading font-bold tracking-tight">
            Propiedades
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Encuentra tu próxima propiedad en nuestro catálogo exclusivo.
          {activeCount > 0 && (
            <span className="ml-2 text-sm text-primary font-medium">
              ({activeCount} {activeCount === 1 ? "filtro activo" : "filtros activos"})
            </span>
          )}
        </p>
      </div>

      {/* Layout: sidebar + grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-72 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <PropertyFilters />
          </div>
        </aside>

        {/* Property grid */}
        <section className="flex-1 min-w-0">
          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h2 className="text-xl font-semibold">Error al cargar</h2>
              <p className="text-muted-foreground max-w-md">{error}</p>
              <Button onClick={fetchProperties}>Reintentar</Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
              <SearchX className="h-12 w-12 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold">No se encontraron propiedades</h2>
              <p className="text-muted-foreground max-w-md">
                Prueba a modificar los filtros de búsqueda para encontrar más resultados.
              </p>
            </div>
          )}

          {/* Results grid */}
          {!loading && !error && properties.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={loadMore}
                    isLoading={loadingMore}
                  >
                    Ver más propiedades
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-10 px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-5 w-96 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ShowcaseContent />
    </Suspense>
  );
}
