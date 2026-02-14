"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { propertyService } from "@/services/propertyService";
import { PropertyCard, type PropertyCardData } from "@/components/public/PropertyCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import Autoplay from "embla-carousel-autoplay";

export function FeaturedProperties() {
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await propertyService.getPublicProperties({ 
          is_featured: true, 
          limit: 10 // Get more properties for the carousel
        });
        setProperties(data.items);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto text-center">
          <p className="text-muted-foreground animate-pulse">Cargando propiedades destacadas...</p>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null; 
  }

  return (
    <section className="py-24 bg-background overflow-hidden">
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
          <div className="flex items-center gap-4">
            <Link href="/propiedades">
              <Button variant="outline" className="group">
                Ver Todo el Catálogo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {properties.map((property) => (
              <CarouselItem key={property.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                <PropertyCard property={property} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Navigation Controls */}
          <div className="flex justify-end gap-2 mt-8 md:hidden">
            <CarouselPrevious className="relative left-0 translate-y-0" />
            <CarouselNext className="relative right-0 translate-y-0" />
          </div>
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
