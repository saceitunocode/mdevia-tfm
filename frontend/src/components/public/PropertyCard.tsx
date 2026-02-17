"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";

export interface PropertyCardData {
  id: string;
  title: string;
  city: string;
  price_amount: string | number | null;
  price_currency: string;
  sqm: number;
  rooms: number;
  baths: number;
  status: string;
  operation_type: string;
  is_published: boolean;
  images: { id: string; public_url: string; is_cover: boolean; alt_text?: string }[];
  agent?: { name: string; avatar_url?: string }; // Added for agent info
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

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const coverImage = property.images.find((img) => img.is_cover) ?? property.images[0];
  const isForRent = property.operation_type === "RENT";

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 flex flex-col h-full">
      {/* Absolute Link overlay for the whole card */}
      <Link 
        href={`/propiedades/${property.id}`} 
        className="absolute inset-0 z-10" 
        aria-label={`Ver detalles de ${property.title}`}
      />

      {/* Image Container */}
      <div className="relative h-48 md:h-60 overflow-hidden bg-muted">
        {coverImage ? (
          <Image
            src={coverImage.public_url}
            alt={coverImage.alt_text || property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
             Sin imagen
           </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
          <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold uppercase rounded-md shadow-sm tracking-wide text-white ${isForRent ? 'bg-accent' : 'bg-primary'}`}>
            {isForRent ? "Alquiler" : "Venta"}
          </span>
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3 md:p-4 pt-8 md:pt-12 z-20">
           <span className="text-white font-bold text-xl md:text-2xl shadow-sm text-shadow">
             {formatPrice(property.price_amount, property.price_currency)}
             {isForRent && <span className="text-xs md:text-sm font-bold opacity-100 text-white"> /mes</span>}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <h3 className="text-base md:text-lg font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate">{property.city}</span>
        </div>

        {/* Specs Grid */}
        <div className="flex items-center justify-between py-3 border-t border-border/50">
           <div className="flex items-center gap-1.5" title="Superficie">
              <Maximize className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium"><b className="text-foreground">{property.sqm}</b> m²</span>
           </div>
           <div className="w-px h-8 bg-border/50" />
           <div className="flex items-center gap-1.5" title="Habitaciones">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium"><b className="text-foreground">{property.rooms}</b> Hab.</span>
           </div>
           <div className="w-px h-8 bg-border/50" />
           <div className="flex items-center gap-1.5" title="Baños">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium"><b className="text-foreground">{property.baths}</b> Baños</span>
           </div>
        </div>

        {/* Footer: CTA */}
        <div className="mt-auto pt-4 border-t border-border/50">
           <div className="z-20 w-full px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm group-hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
             Ver Detalles
             <span className="group-hover:translate-x-1 transition-transform">→</span>
           </div>
        </div>
      </div>
    </Card>
  );
}
