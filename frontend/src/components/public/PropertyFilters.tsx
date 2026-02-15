"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

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
  
  // States that trigger immediate update
  const [propertyTypes, setPropertyTypes] = useState<string[]>(() => searchParams.getAll("property_type"));
  const [amenities, setAmenities] = useState<string[]>(() => searchParams.getAll("amenities"));
  const [operationType, setOperationType] = useState<string>(() => searchParams.get("operation_type") || "");
  const [rooms, setRooms] = useState<string>(() => searchParams.get("rooms") || "");
  const [baths, setBaths] = useState<string>(() => searchParams.get("baths") || "");
  const [hasElevator, setHasElevator] = useState<boolean | null>(() => {
    const val = searchParams.get("has_elevator");
    return val === "true" ? true : val === "false" ? false : null;
  });

  // States for text inputs (debounced)
  const [city, setCity] = useState(() => searchParams.get("city") || "");
  const [priceMin, setPriceMin] = useState(() => searchParams.get("price_min") || "");
  const [priceMax, setPriceMax] = useState(() => searchParams.get("price_max") || "");

  const cityInputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (priceMin) params.set("price_min", priceMin);
    if (priceMax) params.set("price_max", priceMax);
    
    if (operationType) params.set("operation_type", operationType);
    if (rooms) params.set("rooms", rooms);
    if (baths) params.set("baths", baths);
    if (hasElevator !== null) params.set("has_elevator", hasElevator.toString());
    
    propertyTypes.forEach(t => params.append("property_type", t));
    amenities.forEach(a => params.append("amenities", a));

    // Using replace instead of push for filter updates often helps with focus/history
    router.replace(`/propiedades?${params.toString()}`, { scroll: false });
  }, [router, city, priceMin, priceMax, operationType, propertyTypes, amenities, rooms, baths, hasElevator]);

  // Effect for immediate updates (toggles, radios, buttons)
  useEffect(() => {
    if (!isInitialMount.current) {
      applyFilters();
    }
  }, [operationType, propertyTypes, amenities, rooms, baths, hasElevator, applyFilters]);

  // Effect for debounced updates (text inputs)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialMount.current) {
        applyFilters();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [city, priceMin, priceMax, applyFilters]);

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // Sync state with URL when searchParams change externally (e.g. back/forward navigation)
  useEffect(() => {
    const paramsCity = searchParams.get("city") || "";
    if (paramsCity !== city) setCity(paramsCity);

    const paramsOp = searchParams.get("operation_type") || "";
    if (paramsOp !== operationType) setOperationType(paramsOp);

    const paramsTypes = searchParams.getAll("property_type");
    if (JSON.stringify(paramsTypes) !== JSON.stringify(propertyTypes)) setPropertyTypes(paramsTypes);

    const paramsPriceMin = searchParams.get("price_min") || "";
    if (paramsPriceMin !== priceMin) setPriceMin(paramsPriceMin);

    const paramsPriceMax = searchParams.get("price_max") || "";
    if (paramsPriceMax !== priceMax) setPriceMax(paramsPriceMax);

    const paramsRooms = searchParams.get("rooms") || "";
    if (paramsRooms !== rooms) setRooms(paramsRooms);

    const paramsBaths = searchParams.get("baths") || "";
    if (paramsBaths !== baths) setBaths(paramsBaths);

    const paramsElevator = searchParams.get("has_elevator");
    const elevatorVal = paramsElevator === "true" ? true : paramsElevator === "false" ? false : null;
    if (elevatorVal !== hasElevator) setHasElevator(elevatorVal);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const clearFilters = () => {
    setPropertyTypes([]);
    setAmenities([]);
    setOperationType("");
    setRooms("");
    setBaths("");
    setHasElevator(null);
    setCity("");
    setPriceMin("");
    setPriceMax("");
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

      <div className="p-5 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            ref={cityInputRef}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ciudad o Código Postal" 
            className="pl-9 bg-muted/30"
          />
        </div>

        {/* Operation Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Operación</Label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/30 rounded-lg border border-border/50">
            <button
              onClick={() => setOperationType("")}
              className={`text-xs py-1.5 rounded-md font-medium transition-all ${operationType === "" ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setOperationType("SALE")}
              className={`text-xs py-1.5 rounded-md font-medium transition-all ${operationType === "SALE" ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Venta
            </button>
            <button
              onClick={() => setOperationType("RENT")}
              className={`text-xs py-1.5 rounded-md font-medium transition-all ${operationType === "RENT" ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Alquiler
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tipo de Propiedad</Label>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {PROPERTY_TYPES.map((type) => (
              <div 
                key={type.id} 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => toggleType(type.id)}
              >
                <div 
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${propertyTypes.includes(type.id) ? 'bg-primary border-primary' : 'border-input group-hover:border-primary'}`}
                >
                  {propertyTypes.includes(type.id) && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Rango de Precio (€)</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Min" 
              className="bg-muted/30"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              type="number" 
              placeholder="Max" 
              className="bg-muted/30"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </div>

        {/* Rooms & Baths */}
        <div className="space-y-4">
          <div className="space-y-2">
             <Label className="text-sm font-medium">Habitaciones</Label>
             <div className="grid grid-cols-5 gap-1 p-1 bg-muted/30 rounded-lg border border-border/50">
                {["Any", "1+", "2+", "3+", "4+"].map((r) => {
                   const val = r === "Any" ? "" : r.replace("+", "");
                   const isSelected = rooms === val;
                   return (
                     <button
                       key={r}
                       type="button"
                       onClick={() => setRooms(val)}
                       className={`py-1.5 rounded-md text-xs font-medium transition-all ${isSelected ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                     >
                       {r === "Any" ? "Todas" : r}
                     </button>
                   );
                })}
             </div>
          </div>
          <div className="space-y-2">
             <Label className="text-sm font-medium">Baños</Label>
             <div className="grid grid-cols-4 gap-1 p-1 bg-muted/30 rounded-lg border border-border/50">
                {["Any", "1+", "2+", "3+"].map((b) => {
                   const val = b === "Any" ? "" : b.replace("+", "");
                   const isSelected = baths === val;
                   return (
                     <button
                       key={b}
                       type="button"
                       onClick={() => setBaths(val)}
                       className={`py-1.5 rounded-md text-xs font-medium transition-all ${isSelected ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                     >
                       {b === "Any" ? "Todos" : b}
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
        <div className="space-y-2 pb-2">
          <Label className="text-sm font-medium">Características Extra</Label>
          <div className="space-y-1.5">
            {AMENITIES_LIST.filter(a => a.id !== 'elevator').map((amenity) => (
              <div 
                key={amenity.id} 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => toggleAmenity(amenity.id)}
              >
                <div 
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${amenities.includes(amenity.id) ? 'bg-primary border-primary' : 'border-input group-hover:border-primary'}`}
                >
                   {amenities.includes(amenity.id) && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
