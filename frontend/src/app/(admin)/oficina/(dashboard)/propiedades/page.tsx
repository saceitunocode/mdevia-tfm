"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Plus, Building2, MapPin, Ruler, Home, 
  LayoutGrid, List as ListIcon, ArrowUpRight, 
  Bed, Bath
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import { getStatusConfig } from "@/constants/status";
import { Property } from "@/types/property";

export default function AdminPropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus] = useState<string>("ALL");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await apiRequest<Property[]>("/properties/");
        setProperties(data);
      } catch (error) {
        console.error("Error al cargar propiedades:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || prop.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <DashboardToolbar
        title="Cartera de Inmuebles"
        count={filteredProperties.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        actions={
          <Link href="/oficina/propiedades/nueva">
            <Button className="font-bold flex items-center gap-2">
              <Plus size={18} /> Nueva Propiedad
            </Button>
          </Link>
        }
      >
        <div className="hidden md:flex items-center gap-4">
          <div className="flex bg-muted p-1 rounded-lg border border-border shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-all duration-200",
                viewMode === "grid" 
                  ? "bg-background shadow-sm text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Vista Cuadrícula"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-all duration-200",
                viewMode === "list" 
                  ? "bg-background shadow-sm text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Vista Lista"
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </DashboardToolbar>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-muted rounded-xl h-24 w-full" />
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 md:py-16 px-4 bg-card rounded-xl border border-dashed border-border">
          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
            <Building2 className="h-6 w-6 md:h-8 md:w-8 opacity-50" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-foreground">No se encontraron propiedades</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-sm mx-auto mb-6">
            {searchTerm ? "Intenta con otros términos de búsqueda." : "Añade propiedades a tu catálogo para verlas aquí."}
          </p>
          {!searchTerm && (
             <Link href="/oficina/propiedades/nueva">
               <Button variant="outline" size="sm">Añadir Propiedad</Button>
             </Link>
          )}
        </div>
      ) : (
        <>
          {/* Vista Móvil (Lista de tarjetas compactas) */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredProperties.map((property) => {
              const coverImage = property.images?.find(img => img.is_cover) || property.images?.[0];
              const statusCfg = getStatusConfig('property', property.status);
              
              return (
                <Link key={property.id} href={`/oficina/propiedades/${property.id}`}>
                  <Card className="overflow-hidden hover:border-primary/50 transition-colors shadow-sm active:scale-[0.98] duration-200">
                    <CardContent className="p-0 flex h-24">
                      <div className="w-24 h-full relative bg-muted shrink-0 border-r">
                        {coverImage ? (
                          <Image 
                            src={coverImage.public_url} 
                            alt={property.title}
                            fill
                            className="object-cover"
                            unoptimized={coverImage.public_url.startsWith("http://")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                            <Home size={20} />
                          </div>
                        )}
                        <div className={cn(
                          "absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm border backdrop-blur-md",
                          statusCfg.bg,
                          statusCfg.color,
                          statusCfg.border
                        )}>
                          {statusCfg.label}
                        </div>
                      </div>
                      
                      <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-xs truncate">{property.title}</h3>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                            <MapPin size={10} className="text-primary" /> {property.city}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <p className="font-bold text-sm text-primary">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price_amount)}
                          </p>
                          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1 shrink-0"><Ruler size={10} className="text-primary" /> {property.sqm}m²</span>
                            <span className="flex items-center gap-1 shrink-0"><Bed size={10} className="text-primary" /> {property.rooms}</span>
                            <span className="flex items-center gap-1 shrink-0"><Bath size={10} className="text-primary" /> {property.baths}</span>
                            <span className="flex items-center gap-1 shrink-0"><Building2 size={10} className="text-primary" />{property.floor === 0 ? 'Baja' : property.floor || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Vista Desktop (Grid o Tabla) */}
          <div className="hidden md:block">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  const coverImage = property.images?.find(img => img.is_cover) || property.images?.[0];
                  const statusCfg = getStatusConfig('property', property.status);
                  
                  return (
                    <Card key={property.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border overflow-hidden flex flex-col h-full bg-card">
                      <Link href={`/oficina/propiedades/${property.id}`} className="block relative h-56 overflow-hidden bg-muted">
                        {coverImage ? (
                          <Image 
                            src={coverImage.public_url} 
                            alt={property.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            unoptimized={coverImage.public_url.startsWith("http://")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                            <Home size={48} />
                          </div>
                        )}
                        
                        <div className={cn(
                          "absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm border backdrop-blur-md",
                          statusCfg.bg,
                          statusCfg.color,
                          statusCfg.border
                        )}>
                          {statusCfg.label}
                        </div>

                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-background/90 backdrop-blur-md text-xs font-bold text-foreground shadow-sm">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price_amount)}
                        </div>
                      </Link>
                      
                      <CardContent className="p-4 flex-1 flex flex-col gap-3">
                        <div>
                          <Link href={`/oficina/propiedades/${property.id}`} className="hover:text-primary transition-colors">
                             <h3 className="font-bold text-base line-clamp-1">{property.title}</h3>
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                             <MapPin size={12} className="text-primary shrink-0" />
                             <span className="line-clamp-1">{property.address_line1}, {property.city}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border/50">
                           <div className="flex flex-col items-center justify-center text-center">
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Ruler size={10} /> Area</span>
                              <span className="text-sm font-semibold">{property.sqm}m²</span>
                           </div>
                           <div className="flex flex-col items-center justify-center text-center border-l border-border/50">
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Bed size={10} /> Hab.</span>
                              <span className="text-sm font-semibold">{property.rooms}</span>
                           </div>
                           <div className="flex flex-col items-center justify-center text-center border-l border-border/50">
                             <span className="text-xs text-muted-foreground flex items-center gap-1"><Bath size={10} /> Baños</span>
                             <span className="text-sm font-semibold">{property.baths}</span>
                           </div>
                        </div>

                        <Link href={`/oficina/propiedades/${property.id}`} className="mt-auto pt-2">
                          <Button variant="outline" className="w-full text-xs hover:bg-primary hover:text-primary-foreground group-hover/btn:bg-primary transition-colors h-9">
                            Ver Detalles <ArrowUpRight className="ml-2 h-3 w-3" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-xs border-b border-border">
                      <tr>
                        <th className="px-6 py-4">Propiedad</th>
                        <th className="px-6 py-4">Detalles</th>
                        <th className="px-6 py-4">Precio</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredProperties.map((prop) => {
                        const coverImage = prop.images?.find(img => img.is_cover) || prop.images?.[0];
                        const statusCfg = getStatusConfig('property', prop.status);
                        return (
                          <tr key={prop.id} className="hover:bg-muted/30 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="h-14 w-20 rounded-lg bg-muted overflow-hidden shrink-0 relative border border-border/50">
                                  {coverImage ? (
                                    <Image 
                                      src={coverImage.public_url} 
                                      alt={prop.title}
                                      fill
                                      className="object-cover"
                                      unoptimized={coverImage.public_url.startsWith("http://")}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Home size={16} /></div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{prop.title}</p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin size={10} /> {prop.city}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Ruler size={12} /> {prop.sqm}m²</span>
                                <span className="flex items-center gap-1"><Bed size={12} /> {prop.rooms}</span>
                                <span className="flex items-center gap-1"><Bath size={12} /> {prop.baths}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-foreground">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prop.price_amount)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                                statusCfg.bg,
                                statusCfg.color,
                                statusCfg.border
                              )}>
                                {statusCfg.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link href={`/oficina/propiedades/${prop.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
