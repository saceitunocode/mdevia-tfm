"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Building2, MapPin, Ruler, Home } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface PropertyImage {
  id: string;
  public_url: string;
  is_cover: boolean;
}

interface Property {
  id: string;
  title: string;
  address_line1: string;
  city: string;
  sqm: number;
  rooms: number;
  price_amount: number;
  status: string;
  images: PropertyImage[];
}

export default function AdminPropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await apiRequest("/properties/") as Property[];
        setProperties(data);
      } catch (error) {
        console.error("Error al cargar propiedades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Gestión de Propiedades</h1>
          <p className="text-muted-foreground font-medium">Aquí podrás dar de alta, editar y borrar propiedades del catálogo.</p>
        </div>
        <Link href="/oficina/propiedades/nueva">
          <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Nueva Propiedad
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-muted h-64 border-none" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card className="border-2 border-dashed border-muted text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Building2 size={24} />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg">No hay propiedades registradas</p>
              <p className="text-sm text-muted-foreground">Empieza por añadir la primera propiedad al sistema.</p>
            </div>
            <Link href="/oficina/propiedades/nueva">
              <Button variant="outline" size="sm">Añadir Propiedad</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const coverImage = property.images?.find(img => img.is_cover) || property.images?.[0];
            
            return (
              <Card key={property.id} className="group hover:shadow-xl transition-all duration-500 border-none bg-card overflow-hidden flex flex-col">
                <div className="h-48 relative overflow-hidden bg-muted font-heading">
                  {coverImage ? (
                    <Image 
                      src={coverImage.public_url} 
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized={coverImage.public_url.startsWith("http://localhost") || coverImage.public_url.startsWith("http://127.0.0.1")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <Home size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {property.status}
                  </div>
                </div>
                <CardContent className="p-4 space-y-3 flex-1">
                  <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary" />
                      <span className="line-clamp-1">{property.address_line1}, {property.city}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Ruler size={14} />
                        {property.sqm} m²
                      </div>
                      <div className="font-bold text-foreground">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(property.price_amount)}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Link href={`/oficina/propiedades/${property.id}`} className="block">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
