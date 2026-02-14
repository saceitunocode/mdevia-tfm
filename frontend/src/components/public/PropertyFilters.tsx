"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export interface FilterValues {
  city?: string;
  price_min?: string;
  price_max?: string;
  sqm_min?: string;
  sqm_max?: string;
  rooms?: string;
  baths?: string;
  status?: string;
  type?: string[];
  amenities?: string[];
}

const PROPERTY_TYPES = [
  { id: "HOUSE", label: "Casa" },
  { id: "APARTMENT", label: "Piso" },
  { id: "OFFICE", label: "Oficina" },
  { id: "LAND", label: "Terreno" },
];

const AMENITIES_LIST = [
  { id: "pool", label: "Piscina" },
  { id: "gym", label: "Gimnasio" },
  { id: "parking", label: "Garaje" },
  { id: "garden", label: "Jardín" },
  { id: "elevator", label: "Ascensor" },
  { id: "terrace", label: "Terraza" },
];

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for complex inputs to avoid URL thrashing
  const [propertyTypes, setPropertyTypes] = useState<string[]>(() => searchParams.getAll("property_type"));
  const [amenities, setAmenities] = useState<string[]>(() => searchParams.getAll("amenities"));
  const [operationType, setOperationType] = useState<string>(() => searchParams.get("operation_type") || "SALE");
  const [rooms, setRooms] = useState<string>(() => searchParams.get("rooms") || "");
  const [baths, setBaths] = useState<string>(() => searchParams.get("baths") || "");
  const [hasElevator, setHasElevator] = useState<boolean | null>(() => {
    const val = searchParams.get("has_elevator");
    return val === "true" ? true : val === "false" ? false : null;
  });

  const applyFilters = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const formData = new FormData(e?.target as HTMLFormElement);
      const params = new URLSearchParams();

      // Basic inputs
      const city = formData.get("city") as string;
      const priceMin = formData.get("price_min") as string;
      const priceMax = formData.get("price_max") as string;
      const sqmMin = formData.get("sqm_min") as string;
      const sqmMax = formData.get("sqm_max") as string;
      
      if (city) params.set("city", city);
      if (priceMin) params.set("price_min", priceMin);
      if (priceMax) params.set("price_max", priceMax);
      if (sqmMin) params.set("sqm_min", sqmMin);
      if (sqmMax) params.set("sqm_max", sqmMax);
      
      // State based inputs
      if (operationType) params.set("operation_type", operationType);
      if (rooms) params.set("rooms", rooms);
      if (baths) params.set("baths", baths);
      if (hasElevator !== null) params.set("has_elevator", hasElevator.toString());
      
      propertyTypes.forEach(t => params.append("property_type", t));
      amenities.forEach(a => params.append("amenities", a));

      router.push(`/propiedades?${params.toString()}`);
    },
    [router, operationType, propertyTypes, amenities, rooms, baths, hasElevator]
  );

  const clearFilters = () => {
    setPropertyTypes([]);
    setAmenities([]);
    setOperationType("SALE");
    setRooms("");
    setBaths("");
    setHasElevator(null);
    router.push("/propiedades");
  };

  const toggleType = (id: string) => {
    setPropertyTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const toggleAmenity = (id: string) => {
    setAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20 shrink-0">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filtros
        </h2>
        <button 
          onClick={clearFilters}
          className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <form onSubmit={applyFilters} className="p-5 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            name="city" 
            placeholder="Ciudad, Zona o CP" 
            className="pl-9 bg-muted/30"
            defaultValue={searchParams.get("city") || ""} 
          />
        </div>

        {/* Operation Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Operación</Label>
          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input 
                type="radio" 
                name="operation_type" 
                value="SALE" 
                className="peer sr-only" 
                checked={operationType === "SALE"}
                onChange={() => setOperationType("SALE")}
              />
              <div className="text-center py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all hover:bg-muted/50">
                Venta
              </div>
            </label>
            <label className="cursor-pointer">
              <input 
                type="radio" 
                name="operation_type" 
                value="RENT" 
                className="peer sr-only" 
                checked={operationType === "RENT"}
                onChange={() => setOperationType("RENT")}
              />
              <div className="text-center py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground peer-checked:bg-secondary/10 peer-checked:border-secondary peer-checked:text-secondary transition-all hover:bg-muted/50">
                Alquiler
              </div>
            </label>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tipo de Propiedad</Label>
          <div className="space-y-1.5">
            {PROPERTY_TYPES.map((type) => (
              <label key={type.id} className="flex items-center space-x-3 cursor-pointer group">
                <div 
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${propertyTypes.includes(type.id) ? 'bg-primary border-primary' : 'border-input group-hover:border-primary'}`}
                  onClick={(e) => { e.preventDefault(); toggleType(type.id); }}
                >
                  {propertyTypes.includes(type.id) && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Rango de Precio (€)</Label>
          <div className="flex items-center gap-2">
            <Input 
              name="price_min" 
              type="number" 
              placeholder="Min" 
              className="bg-muted/30"
              defaultValue={searchParams.get("price_min") || ""}
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              name="price_max" 
              type="number" 
              placeholder="Max" 
              className="bg-muted/30"
              defaultValue={searchParams.get("price_max") || ""}
            />
          </div>
        </div>

        {/* Rooms & Baths */}
        <div className="space-y-4">
          <div>
             <Label className="text-xs uppercase text-muted-foreground font-bold mb-2 block">Habitaciones</Label>
             <div className="flex gap-2">
                {["Any", "1+", "2+", "3+", "4+"].map((r) => {
                   const val = r === "Any" ? "" : r.replace("+", "");
                   return (
                     <button
                       key={r}
                       type="button"
                       onClick={() => setRooms(val)}
                       className={`flex-1 py-1 rounded text-xs border transition-all ${rooms === val ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                     >
                       {r}
                     </button>
                   );
                })}
             </div>
          </div>
          <div>
             <Label className="text-xs uppercase text-muted-foreground font-bold mb-2 block">Baños</Label>
             <div className="flex gap-2">
                {["Any", "1+", "2+", "3+"].map((b) => {
                   const val = b === "Any" ? "" : b.replace("+", "");
                   return (
                     <button
                       key={b}
                       type="button"
                       onClick={() => setBaths(val)}
                       className={`flex-1 py-1 rounded text-xs border transition-all ${baths === val ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                     >
                       {b}
                     </button>
                   );
                })}
             </div>
          </div>
        </div>

        {/* Elevator Toggle */}
        <div className="flex items-center justify-between py-2">
            <Label className="text-sm font-medium">Solo con Ascensor</Label>
            <button
                type="button"
                onClick={() => setHasElevator(prev => prev === true ? null : true)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${hasElevator === true ? 'bg-primary' : 'bg-muted'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasElevator === true ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Características Extra</Label>
          <div className="space-y-1.5">
            {AMENITIES_LIST.filter(a => a.id !== 'elevator').map((amenity) => (
              <label key={amenity.id} className="flex items-center space-x-3 cursor-pointer group">
                <div 
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${amenities.includes(amenity.id) ? 'bg-primary border-primary' : 'border-input group-hover:border-primary'}`}
                  onClick={(e) => { e.preventDefault(); toggleAmenity(amenity.id); }}
                >
                   {amenities.includes(amenity.id) && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 sticky bottom-0 bg-card">
          <Button type="submit" className="w-full shadow-lg hover:shadow-xl transition-all">
            Aplicar Filtros
          </Button>
        </div>
      </form>
    </div>
  );
}
