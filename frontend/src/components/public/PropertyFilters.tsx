"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SlidersHorizontal, RotateCcw, MapPin } from "lucide-react";

const PROPERTY_TYPES = [
  { id: "HOUSE", label: "Casa" },
  { id: "APARTMENT", label: "Piso" },
  { id: "OFFICE", label: "Oficina" },
  { id: "LAND", label: "Terreno" },
];

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Local states
  const [propertyTypes, setPropertyTypes] = useState<string[]>(() => searchParams.getAll("property_type"));
  const [operationType, setOperationType] = useState<string>(() => searchParams.get("operation_type") || "");
  const [rooms, setRooms] = useState<string>(() => searchParams.get("rooms") || "");
  const [baths, setBaths] = useState<string>(() => searchParams.get("baths") || "");
  const [hasElevator, setHasElevator] = useState<boolean | null>(() => {
    const val = searchParams.get("has_elevator");
    return val === "true" ? true : val === "false" ? false : null;
  });
  const [city, setCity] = useState(() => searchParams.get("city") || "");
  const [priceMin, setPriceMin] = useState(() => searchParams.get("price_min") || "");
  const [priceMax, setPriceMax] = useState(() => searchParams.get("price_max") || "");

  const isInitialMount = useRef(true);

  // 2. Ref-based sync to eliminate double-calls and stale closures
  const paramsRef = useRef("");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    // Collect values from CURRENT state
    if (city) params.set("city", city);
    if (priceMin) params.set("price_min", priceMin);
    if (priceMax) params.set("price_max", priceMax);
    if (operationType) params.set("operation_type", operationType);
    if (rooms) params.set("rooms", rooms);
    if (baths) params.set("baths", baths);
    if (hasElevator !== null) params.set("has_elevator", hasElevator.toString());
    propertyTypes.forEach(t => params.append("property_type", t));

    const newQuery = params.toString();
    
    // Check if what we have in state actually differs from the URL
    // This is the most robust way to prevent double-firing
    if (newQuery !== searchParams.toString() && newQuery !== paramsRef.current) {
      paramsRef.current = newQuery;
      router.replace(`/propiedades?${newQuery}`, { scroll: false });
    }
  }, [router, searchParams, city, priceMin, priceMax, operationType, propertyTypes, rooms, baths, hasElevator]);

  // Immediate updates for toggles and text
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    const timer = setTimeout(() => {
        applyFilters();
    }, 100); // Small buffer to batch updates
    
    return () => clearTimeout(timer);
  }, [applyFilters]);

  // 3. Sync state WITH the URL (Back/Forward navigation)
  useEffect(() => {
    const pCity = searchParams.get("city") || "";
    if (pCity !== city) setCity(pCity);

    const pOp = searchParams.get("operation_type") || "";
    if (pOp !== operationType) setOperationType(pOp);

    const pTypes = searchParams.getAll("property_type");
    if (JSON.stringify(pTypes.sort()) !== JSON.stringify([...propertyTypes].sort())) {
      setPropertyTypes(pTypes);
    }

    const pMin = searchParams.get("price_min") || "";
    if (pMin !== priceMin) setPriceMin(pMin);

    const pMax = searchParams.get("price_max") || "";
    if (pMax !== priceMax) setPriceMax(pMax);

    const pRooms = searchParams.get("rooms") || "";
    if (pRooms !== rooms) setRooms(pRooms);

    const pBaths = searchParams.get("baths") || "";
    if (pBaths !== baths) setBaths(pBaths);

    const pElevator = searchParams.get("has_elevator");
    const elevatorVal = pElevator === "true" ? true : pElevator === "false" ? false : null;
    if (elevatorVal !== hasElevator) setHasElevator(elevatorVal);
    
    // Update ref to current URL to prevent immediate re-sync
    paramsRef.current = searchParams.toString();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const clearFilters = () => {
    paramsRef.current = "";
    setPropertyTypes([]);
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

      <div className="p-5 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* Location Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Ubicación</Label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => setCity("")}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${city === "" ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
            >
              <span className="font-bold uppercase tracking-tighter text-sm">Todas las zonas</span>
              <RotateCcw className={`h-4 w-4 transition-transform ${city === "" ? 'rotate-0' : '-rotate-45 opacity-50'}`} />
            </button>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => setCity("Andújar")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${city === "Andújar" ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
                >
                    <MapPin className="h-5 w-5" />
                    <span className="font-bold uppercase tracking-tighter text-xs">Andújar</span>
                </button>
                <button
                    onClick={() => setCity("Córdoba")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${city === "Córdoba" ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
                >
                    <MapPin className="h-5 w-5" />
                    <span className="font-bold uppercase tracking-tighter text-xs">Córdoba</span>
                </button>
            </div>
          </div>
        </div>

        {/* Operation Type */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Operación</Label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-muted/30 rounded-xl border border-border/50">
            <button
              onClick={() => setOperationType("")}
              className={`text-xs py-2 rounded-lg font-bold uppercase ${operationType === "" ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setOperationType("SALE")}
              className={`text-xs py-2 rounded-lg font-bold uppercase ${operationType === "SALE" ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Venta
            </button>
            <button
              onClick={() => setOperationType("RENT")}
              className={`text-xs py-2 rounded-lg font-bold uppercase ${operationType === "RENT" ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Alquiler
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Tipo de Propiedad</Label>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_TYPES.map((type) => (
              <button 
                key={type.id} 
                onClick={() => toggleType(type.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1.5 ${propertyTypes.includes(type.id) ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
              >
                <span className="text-[10px] uppercase font-black tracking-tighter">{type.label}</span>
                {propertyTypes.includes(type.id) && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Precio Máximo (€)</Label>
          <Input 
            type="number" 
            placeholder="Ej: 150000" 
            className="bg-muted/30 border-transparent focus:border-primary transition-all rounded-xl h-11"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>

        {/* Rooms & Baths */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
             <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Hab.</Label>
             <select 
               value={rooms} 
               onChange={(e) => setRooms(e.target.value)}
               className="w-full bg-muted/30 rounded-xl px-3 py-2 text-sm border-transparent focus:ring-1 focus:ring-primary outline-none"
             >
                <option value="">Todas</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
             </select>
          </div>
          <div className="space-y-2">
             <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Baños</Label>
             <select 
               value={baths} 
               onChange={(e) => setBaths(e.target.value)}
               className="w-full bg-muted/30 rounded-xl px-3 py-2 text-sm border-transparent focus:ring-1 focus:ring-primary outline-none"
             >
                <option value="">Todos</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
             </select>
          </div>
        </div>

        {/* Elevator Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-tighter">Ascensor</span>
                <span className="text-[10px] text-muted-foreground uppercase">Requisito clave</span>
            </div>
            <button
                type="button"
                onClick={() => setHasElevator(prev => prev === true ? null : true)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${hasElevator === true ? 'bg-primary' : 'bg-zinc-400'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasElevator === true ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
      </div>
    </div>
  );
}
