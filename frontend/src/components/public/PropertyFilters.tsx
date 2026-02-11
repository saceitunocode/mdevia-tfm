"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Search, SlidersHorizontal, X } from "lucide-react";

const CITIES = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Málaga", "Córdoba", "Andújar"];

export interface FilterValues {
  city?: string;
  price_min?: string;
  price_max?: string;
  sqm_min?: string;
  sqm_max?: string;
  rooms?: string;
}

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters: FilterValues = {
    city: searchParams.get("city") || "",
    price_min: searchParams.get("price_min") || "",
    price_max: searchParams.get("price_max") || "",
    sqm_min: searchParams.get("sqm_min") || "",
    sqm_max: searchParams.get("sqm_max") || "",
    rooms: searchParams.get("rooms") || "",
  };

  const hasActiveFilters = Object.values(currentFilters).some((v) => v !== "");

  const applyFilters = useCallback(
    (filters: FilterValues) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      router.push(`/propiedades?${params.toString()}`);
    },
    [router]
  );

  const clearFilters = useCallback(() => {
    router.push("/propiedades");
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters: FilterValues = {
      city: formData.get("city") as string,
      price_min: formData.get("price_min") as string,
      price_max: formData.get("price_max") as string,
      sqm_min: formData.get("sqm_min") as string,
      sqm_max: formData.get("sqm_max") as string,
      rooms: formData.get("rooms") as string,
    };
    applyFilters(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-5 space-y-5 shadow-sm"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <Label htmlFor="filter-city">Ciudad</Label>
        <Select id="filter-city" name="city" defaultValue={currentFilters.city}>
          <option value="">Todas</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      {/* Price range */}
      <div className="space-y-1.5">
        <Label>Precio (€)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            name="price_min"
            type="number"
            placeholder="Desde"
            min={0}
            defaultValue={currentFilters.price_min}
          />
          <Input
            name="price_max"
            type="number"
            placeholder="Hasta"
            min={0}
            defaultValue={currentFilters.price_max}
          />
        </div>
      </div>

      {/* SQM range */}
      <div className="space-y-1.5">
        <Label>Superficie (m²)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            name="sqm_min"
            type="number"
            placeholder="Desde"
            min={0}
            defaultValue={currentFilters.sqm_min}
          />
          <Input
            name="sqm_max"
            type="number"
            placeholder="Hasta"
            min={0}
            defaultValue={currentFilters.sqm_max}
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="space-y-1.5">
        <Label htmlFor="filter-rooms">Habitaciones</Label>
        <Input
          id="filter-rooms"
          name="rooms"
          type="number"
          placeholder="Nº habitaciones"
          min={1}
          defaultValue={currentFilters.rooms}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <Button type="submit" className="w-full gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            className="w-full gap-2 text-muted-foreground"
            onClick={clearFilters}
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </form>
  );
}
