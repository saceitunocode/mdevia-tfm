"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { MapPin, BedDouble, Bath, Maximize, Heart } from "lucide-react";

export interface PropertyCardData {
  id: string;
  title: string;
  city: string;
  price_amount: string | number | null;
  price_currency: string;
  sqm: number;
  rooms: number;
  baths?: number; // Added to match design
  status: string;
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
  const isForRent = property.status === "RENT";

  return (
    <Card className="group overflow-hidden rounded-xl border border-border/50 bg-card hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden bg-muted">
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
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md shadow-sm tracking-wide text-white ${isForRent ? 'bg-secondary' : 'bg-primary'}`}>
            {isForRent ? "Alquiler" : "Venta"}
          </span>
        </div>

        {/* Favorite Button (Mock) */}
        <button className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full text-foreground/70 hover:text-red-500 transition-colors z-10">
          <Heart className="h-5 w-5" />
        </button>

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 pt-12">
           <span className="text-white font-bold text-2xl shadow-sm text-shadow">
             {formatPrice(property.price_amount, property.price_currency)}
             {isForRent && <span className="text-sm font-normal opacity-80 text-white/90"> /mes</span>}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
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
              <span className="text-sm font-medium"><b className="text-foreground">{property.baths || 1}</b> Baños</span>
           </div>
        </div>

        {/* Footer: Agent & CTA */}
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted overflow-hidden border border-border">
                 {/* Placeholder Avatar */}
                 {property.agent?.avatar_url ? (
                    <Image src={property.agent.avatar_url} alt="Agent" width={32} height={32} />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                       AG
                    </div>
                 )}
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                 {property.agent?.name || "Agente FR"}
              </span>
           </div>
           
           <Link href={`/propiedades/${property.id}`} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center">
             Ver Detalles →
           </Link>
        </div>
      </div>
    </Card>
  );
}
