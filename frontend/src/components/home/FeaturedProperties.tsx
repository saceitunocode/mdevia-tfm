"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Bed, Bath, LayoutTemplate, MapPin } from "lucide-react";

// Mock data for preview - replace with real fetch later
const FEATURED_PROPERTIES = [
  {
    id: "1",
    title: "Ático de Lujo en Centro",
    price: 450000,
    location: "Córdoba, Centro",
    beds: 3,
    baths: 2,
    sqft: 180,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
    tag: "Exclusivo"
  },
  {
    id: "2",
    title: "Chalet Moderno con Piscina",
    price: 680000,
    location: "El Brillante",
    beds: 5,
    baths: 4,
    sqft: 350,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000",
    tag: "Oportunidad"
  },
  {
    id: "3",
    title: "Apartamento Reformado",
    price: 185000,
    location: "Ciudad Jardín",
    beds: 2,
    baths: 1,
    sqft: 85,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000",
    tag: "Nuevo"
  }
];

export function FeaturedProperties() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-heading font-bold tracking-tight text-foreground">
              Propiedades Destacadas
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl font-light">
              Descubre nuestra selección exclusiva de inmuebles. Calidad, ubicación y diseño en cada opción.
            </p>
          </div>
          <Link href="/propiedades">
            <Button variant="outline" className="group">
              Ver Todo el Catálogo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PROPERTIES.map((property) => (
            <div 
              key={property.id}
              className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image 
                  src={property.image} 
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 bg-background/90 backdrop-blur text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                     {property.tag}
                   </span>
                </div>
                <div className="absolute bottom-4 right-4">
                   <span className="px-4 py-2 bg-primary text-primary-foreground font-bold text-lg rounded-lg shadow-lg">
                     {property.price.toLocaleString('es-ES')} €
                   </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                   <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {property.location}
                   </div>
                   <h3 className="text-xl font-bold font-heading truncate group-hover:text-primary transition-colors">
                     {property.title}
                   </h3>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-border/50">
                   <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/30">
                      <Bed className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-sm font-bold">{property.beds}</span>
                      <span className="text-[10px] uppercase text-muted-foreground">Dorm.</span>
                   </div>
                   <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/30">
                      <Bath className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-sm font-bold">{property.baths}</span>
                      <span className="text-[10px] uppercase text-muted-foreground">Baños</span>
                   </div>
                   <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/30">
                      <LayoutTemplate className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-sm font-bold">{property.sqft}</span>
                      <span className="text-[10px] uppercase text-muted-foreground">m²</span>
                   </div>
                </div>

                <Link href={`/propiedades/${property.id}`} className="block">
                  <Button className="w-full bg-primary/5 text-primary hover:bg-primary hover:text-white border-none">
                    Ver Detalles
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
