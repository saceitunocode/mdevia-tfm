"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loader2, ArrowLeft, Edit, MapPin, Ruler, BedDouble, Tag, User } from "lucide-react";
import Link from "next/link";
import { PropertyGallery } from "@/components/public/PropertyGallery";

interface PropertyImage {
  id: string;
  public_url: string;
  is_cover: boolean;
  caption?: string;
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
  public_description?: string;
  internal_notes?: string;
  owner_client_id: string;
  images?: PropertyImage[];
  created_at: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const data = await apiRequest<Property>(`/properties/${id}`);
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("No se pudo cargar la propiedad");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive font-medium">{error || "Propiedad no encontrada"}</p>
        <Link href="/oficina/propiedades">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
          </Button>
        </Link>
      </div>
    );
  }



  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Link href="/oficina/propiedades" className="hover:text-primary transition-colors flex items-center gap-1 text-sm">
                <ArrowLeft className="h-3 w-3" /> Propiedades
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{property.title}</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">{property.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{property.address_line1}, {property.city}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Badge variant={property.status === 'AVAILABLE' ? 'default' : 'secondary'} className="text-sm px-3 py-1 uppercase tracking-wide">
                {property.status}
            </Badge>
            <Link href={`/oficina/propiedades/${property.id}/editar`}>
                <Button>
                    <Edit className="mr-2 h-4 w-4" /> Editar Propiedad
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Gallery & Description */}
        <div className="lg:col-span-2 space-y-6">
            <PropertyGallery images={property.images || []} />

            {/* Description */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-heading">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {property.public_description || "Sin descripción pública disponible."}
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Key Details & Notes */}
        <div className="space-y-6">
            {/* Price & Specs */}
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm sticky top-6">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-baseline justify-between border-b pb-4">
                        <span className="text-muted-foreground font-medium">Precio</span>
                        <span className="text-3xl font-bold text-primary flex items-center gap-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(property.price_amount)}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/40 text-center">
                            <div className="flex items-center justify-center text-primary mb-1">
                                <Ruler className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold">{property.sqm}</span>
                            <span className="text-xs text-muted-foreground uppercase font-medium">Metros ²</span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/40 text-center">
                            <div className="flex items-center justify-center text-primary mb-1">
                                <BedDouble className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold">{property.rooms}</span>
                            <span className="text-xs text-muted-foreground uppercase font-medium">Habitaciones</span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                         <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <Tag className="h-4 w-4" /> Referencia
                            </span>
                            <span className="font-mono text-xs">{property.id.substring(0, 8)}</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" /> Captador
                            </span>
                            <span className="font-medium">Admin (Tú)</span>
                         </div>
                    </div>
                </CardContent>
            </Card>

            {/* Internal Notes */}
            <Card className="border-dashed border-2 bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/40">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-2">
                        <Edit className="h-4 w-4" /> Notas Internas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-yellow-800/80 dark:text-yellow-200/80 italic leading-relaxed">
                        {property.internal_notes || "Sin notas internas registradas para esta propiedad."}
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
