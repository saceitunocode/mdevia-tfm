"use client";

import React, { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getStatusConfig } from "@/constants/status";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet with Next.js (fallback)
const fixLeafletIcon = () => {
  if (typeof window === "undefined") return;
  // @ts-expect-error - Fix for Leaflet default icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

// Helper to create custom div icons for markers
const createCustomIcon = (status: string, operationType?: string, isPublic?: boolean) => {
  let color = "bg-primary";
  
  if (isPublic) {
    // PUBLIC COLORS: Venta = Azul (primary), Alquiler = Verde (secondary)
    if (operationType === "RENT") {
      color = "bg-accent"; // Verde
    } else {
      color = "bg-primary"; // Azul
    }
  } else {
    // ADMIN COLORS
    if (status === "AVAILABLE" || status === "published") color = "bg-emerald-500";
    if (status === "SOLD") color = "bg-blue-500";
    if (status === "RENTED") color = "bg-amber-500";
  }

  // Define exact hex for triangle if needed, but border-t-[color] with replace should work if tailwind knows it.
  // Let's use a more robust way for the triangle color by checking the color token.
  const triangleColor = color.replace('bg-', 'border-t-');

  return L.divIcon({
    className: "custom-marker-container",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 ${color} rounded-full opacity-20 animate-ping"></div>
        <div class="relative w-6 h-6 ${color} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div class="absolute -bottom-1 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] ${triangleColor}"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

interface MapProperty {
  id: string;
  title: string;
  city: string;
  price_amount: string | number | null;
  price_currency?: string;
  status: string;
  operation_type?: string;
  images: { public_url: string; is_cover: boolean }[];
}

interface PropertyMapViewProps {
  properties: MapProperty[];
  center?: [number, number];
  zoom?: number;
  isPublic?: boolean;
}

// City center coordinates for positioning
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Andújar": { lat: 38.0384, lng: -4.0484 },
  "Córdoba": { lat: 37.8882, lng: -4.7794 },
  "Marmolejo": { lat: 38.0449, lng: -4.1693 },
  "Madrid": { lat: 40.4168, lng: -3.7038 }, // Fallback
};

// Custom Marker component
function PropertyMarker({ property, isPublic }: { property: MapProperty; isPublic: boolean }) {
  const statusConfig = getStatusConfig('property', property.status);
  const isForRent = property.operation_type === "RENT";
  
  const idHash = property.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Smaller offset to keep them closer to the city center but distinct
  const latOffset = (idHash % 100) / 4000 - 0.0125; 
  const lngOffset = (idHash % 120) / 4000 - 0.015;
  
  const baseCoords = CITY_COORDINATES[property.city] || CITY_COORDINATES["Madrid"];
  const lat = baseCoords.lat + latOffset;
  const lng = baseCoords.lng + lngOffset;

  const coverImage = property.images?.find(img => img.is_cover) || property.images?.[0];
  const price = typeof property.price_amount === "string" ? parseFloat(property.price_amount) : (property.price_amount || 0);

  return (
    <Marker position={[lat, lng]} icon={createCustomIcon(property.status, property.operation_type, isPublic)}>
      <Popup className="property-popup">
        <div className="w-64 overflow-hidden rounded-lg font-sans shadow-xl border-none">
          <div className="relative h-32 w-full bg-muted">
            {coverImage ? (
              <Image 
                src={coverImage.public_url} 
                alt={property.title}
                fill
                className="object-cover"
                unoptimized={coverImage.public_url.startsWith("http://")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                No Image
              </div>
            )}
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isPublic ? (isForRent ? 'bg-accent text-white border-accent' : 'bg-primary text-white border-primary') : `${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`} backdrop-blur-md`}>
              {isPublic ? (isForRent ? "Alquiler" : "Venta") : statusConfig.label}
            </div>
          </div>
          <div className="p-3 bg-card text-foreground">
            <h4 className="font-bold text-sm line-clamp-1 mb-1">{property.title}</h4>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-3">
              <MapPin size={10} className="text-primary" /> {property.city}
            </div>
            
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm font-bold">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: property.price_currency || 'EUR', maximumFractionDigits: 0 }).format(price)}
                {isPublic && isForRent && <span className="text-[10px] opacity-70"> /mes</span>}
              </span>
              <Link 
                href={isPublic ? `/propiedades/${property.id}` : `/oficina/propiedades/${property.id}`} 
                className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
              >
                Ver Detalles <ArrowUpRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// Helper component to auto-fit map bounds
function SetBounds({ properties }: { properties: MapProperty[] }) {
    const map = useMap();
    useEffect(() => {
        if (!properties || properties.length === 0) return;
        
        const points = properties.map(p => {
            const idHash = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const latOffset = (idHash % 100) / 4000 - 0.0125;
            const lngOffset = (idHash % 120) / 4000 - 0.015;
            
            const baseCoords = CITY_COORDINATES[p.city] || CITY_COORDINATES["Madrid"];
            const lat = baseCoords.lat + latOffset;
            const lng = baseCoords.lng + lngOffset;
            
            return [lat, lng] as [number, number];
        });
        
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [properties, map]);
    
    return null;
}
export default function PropertyMapView({ properties, center = [38.0384, -4.0484], zoom = 13, isPublic = false }: PropertyMapViewProps) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <div className="h-full min-h-[500px] w-full rounded-2xl border border-border overflow-hidden shadow-2xl relative z-0 text-foreground">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties?.map((property) => (
          <PropertyMarker key={property.id} property={property} isPublic={isPublic} />
        ))}
        <SetBounds properties={properties} />
      </MapContainer>
      
      {/* Floating Legend */}
      <div className="absolute bottom-6 left-6 z-1000 bg-background/80 backdrop-blur-xl p-4 rounded-xl border border-border shadow-2xl space-y-3 min-w-[140px]">
         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-2 mb-2">
           {isPublic ? "Explorar" : "Cartera"}
         </p>
         <div className="flex flex-col gap-2.5">
            {isPublic ? (
              <>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/50" />
                   <span className="text-[11px] font-semibold">En Venta</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-accent shadow-sm shadow-accent/50" />
                   <span className="text-[11px] font-semibold">En Alquiler</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                   <span className="text-[11px] font-semibold">Disponible</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                   <span className="text-[11px] font-semibold">Vendido</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                   <span className="text-[11px] font-semibold">Alquilado</span>
                </div>
              </>
            )}
         </div>
      </div>
    </div>
  );
}
