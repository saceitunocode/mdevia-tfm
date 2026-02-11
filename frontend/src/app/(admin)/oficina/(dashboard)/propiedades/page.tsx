"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Building2, MapPin, Ruler, Home } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Property {
  id: string;
  title: string;
  address_line1: string;
  city: string;
  sqm: number;
  rooms: number;
  price_amount: number;
  status: string;
}

export default function AdminPropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const data = await apiRequest<Property[]>("/properties/");
        setProperties(data);
      } catch (error) {
        console.error("Error al cargar propiedades:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Gestión de Propiedades</h1>
          <p className="text-muted-foreground">Administra el catálogo de inmuebles activos y pausados.</p>
        </div>
        <Link href="/oficina/propiedades/nueva">
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Nueva Propiedad
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
              <p className="font-semibold">No hay propiedades registradas</p>
              <p className="text-sm text-muted-foreground">Empieza por añadir la primera propiedad al sistema.</p>
            </div>
            <Link href="/oficina/propiedades/nueva">
              <Button variant="outline" size="sm">Añadir Propiedad</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="group hover:shadow-lg transition-all duration-300 border-none bg-card overflow-hidden">
              <div className="h-40 bg-muted relative flex items-center justify-center text-muted-foreground group-hover:bg-muted/80 transition-colors">
                <Home size={48} className="opacity-20" />
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider">
                  {property.status}
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
