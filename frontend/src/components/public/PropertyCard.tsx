"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, BedDouble, Maximize } from "lucide-react";

export interface PropertyCardData {
  id: string;
  title: string;
  city: string;
  price_amount: string | number | null;
  price_currency: string;
  sqm: number;
  rooms: number;
  status: string;
  is_published: boolean;
  images: { id: string; public_url: string; is_cover: boolean; alt_text?: string }[];
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

  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        {coverImage ? (
          <Image
            src={coverImage.public_url}
            alt={coverImage.alt_text || property.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm italic">
            Sin imagen
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="default">Venta</Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-2">
        <div className="flex items-center text-primary text-xs font-bold uppercase tracking-widest mb-1">
          <MapPin className="h-3 w-3 mr-1" />
          {property.city}
        </div>
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {property.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-2xl font-bold text-foreground mb-4 flex items-center gap-1">
          {formatPrice(property.price_amount, property.price_currency)}
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BedDouble className="h-4 w-4" />
            <span><b className="text-foreground">{property.rooms}</b> hab.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Maximize className="h-4 w-4" />
            <span><b className="text-foreground">{property.sqm}</b> m²</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/propiedades/${property.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
