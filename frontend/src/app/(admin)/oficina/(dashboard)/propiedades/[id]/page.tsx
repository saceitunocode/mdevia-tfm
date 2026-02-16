"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
    Loader2, ArrowLeft, Edit, MapPin, Ruler, BedDouble, 
    User as UserIcon, Plus, Calendar, Briefcase, Activity, 
    ArrowUpRight, ArrowDownRight, Clock,
    ChevronRight, Bath, Layers, ArrowUp
} from "lucide-react";
import Link from "next/link";
import { PropertyGallery } from "@/components/public/PropertyGallery";
import { VisitList } from "@/components/visits/VisitList";
import { RegisterVisitDialog } from "@/components/visits/RegisterVisitDialog";
import { visitService } from "@/services/visitService";
import { VisitCreate, VisitUpdate } from "@/types/visit";
import { StickyNote, Send } from "lucide-react";
import { toast } from "sonner";
import { Property, PropertyNote, PropertyStatus } from "@/types/property";
import { OperationList } from "@/components/operations/OperationList";
import { AgentCard } from "@/components/users/AgentCard";


export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isSendingNote, setIsSendingNote] = useState(false);
  
  // Dialogs state
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);

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

  const handleRegisterVisit = async (data: VisitCreate) => {
    try {
        await visitService.createVisit(data);
        // Refresh property (which includes visits)
        const updatedData = await apiRequest<Property>(`/properties/${id}`);
        setProperty(updatedData);
        toast.success("Visita registrada correctamente");
    } catch (err) {
        console.error("Error registering visit:", err);
        throw err;
    }
  };

  const handleUpdateVisit = async (visitId: string, data: VisitUpdate) => {
    try {
        await visitService.updateVisit(visitId, data);
        // Refresh property
        const updatedData = await apiRequest<Property>(`/properties/${id}`);
        setProperty(updatedData);
    } catch (err) {
        console.error("Error updating visit:", err);
        throw err;
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsSendingNote(true);
    try {
      const response = await apiRequest(`/properties/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ text: newNote }),
      });
      
      if (property) {
        setProperty({
          ...property,
          notes: [response as PropertyNote, ...(property.notes || [])]
        });
      }
      setNewNote("");
      toast.success("Nota añadida correctamente");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Error al añadir la nota");
    } finally {
      setIsSendingNote(false);
    }
  };

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
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    );
  }



  return (
    <div className="space-y-4 md:space-y-6 pb-8 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <Link href="/oficina/propiedades">
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full shrink-0">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
          <div className="min-w-0">
            <div className="hidden md:flex items-center gap-2 text-muted-foreground mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold">Propiedades</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-foreground truncate max-w-[200px]">{property.title}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-3xl font-heading font-bold truncate">{property.title}</h1>
              <div className="flex items-center gap-1.5">
                <Badge variant={property.status === PropertyStatus.AVAILABLE ? 'default' : 'secondary'} className="text-[9px] md:text-sm px-2 md:px-3 py-0.5 md:py-1 uppercase tracking-wide">
                    {property.status === PropertyStatus.AVAILABLE ? 'Disponible' : property.status === PropertyStatus.SOLD ? 'Vendido' : 'Alquilado'}
                </Badge>
                {property.is_featured && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[8px] md:text-xs font-bold uppercase tracking-wider">
                        Destacado
                    </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] md:text-sm mt-0.5 md:mt-1 truncate">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary shrink-0" />
                <span className="truncate">
                    {property.address_line1} {property.postal_code ? `(${property.postal_code})` : ''}, {property.city}
                </span>
                <span className="mx-1">•</span>
                <span className="font-medium text-foreground/80 shrink-0">{property.operation_type === 'SALE' ? 'Venta' : 'Alquiler'}</span>
            </div>
          </div>
        </div>
        <Link href={`/oficina/propiedades/${property.id}/editar`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 font-bold">
                <Edit className="mr-2 h-4 w-4" /> Editar Propiedad
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Column 1: Visual & Technical Info */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4 md:space-y-6">
            <PropertyGallery 
                images={property.images || []} 
                className="aspect-video md:aspect-video rounded-xl shadow-sm border border-border/50" 
            />

            {/* Price & Specs Block */}
            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
                    <div className="flex items-baseline justify-between border-b border-border/40 pb-2 md:pb-3">
                        <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Precio</span>
                        <span className="text-xl md:text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price_amount)}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-muted/40 border border-border/20 shadow-sm">
                            <Ruler className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                            <div className="flex items-baseline gap-1 md:gap-1.5">
                                <span className="text-lg md:text-2xl font-bold tabular-nums leading-none">{property.sqm}</span>
                                <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-tight">m²</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-muted/40 border border-border/20 shadow-sm">
                            <BedDouble className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                            <div className="flex items-baseline gap-1 md:gap-1.5">
                                <span className="text-lg md:text-2xl font-bold tabular-nums leading-none">{property.rooms}</span>
                                <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Hab.</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-muted/40 border border-border/20 shadow-sm">
                            <Bath className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                            <div className="flex items-baseline gap-1 md:gap-1.5">
                                <span className="text-lg md:text-2xl font-bold tabular-nums leading-none">{property.baths}</span>
                                <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Baños</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-muted/40 border border-border/20 shadow-sm relative overflow-hidden">
                            <Layers className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                            <div className="flex flex-col flex-1 min-w-0 gap-1">
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-baseline gap-1 md:gap-1.5">
                                        <span className="text-lg md:text-2xl font-bold tabular-nums leading-none">{property.floor !== null ? `${property.floor}ª` : '0'}</span>
                                        <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Plt.</span>
                                    </div>
                                    
                                    {property.has_elevator && (
                                        <div className="py-0.5 px-1.5 bg-emerald-500 text-white text-[7px] md:text-[9px] font-black uppercase rounded-full inline-flex items-center gap-1 shadow-sm shrink-0">
                                            <ArrowUp className="h-2 w-2 md:h-2.5 md:w-2.5" /> Asc.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Description Card */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-muted/5 border-b md:border-none">
                    <CardTitle className="text-base md:text-xl font-heading">Descripción</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-xs md:text-sm">
                        {property.public_description || "Sin descripción pública disponible."}
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Column 2: Activity & History */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4 md:space-y-6">
            {/* Visits Section */}
            <Card className="border-l-4 border-l-primary shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 bg-muted/5 border-b md:border-none">
                    <CardTitle className="text-sm md:text-lg font-heading flex items-center gap-2">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Visitas
                    </CardTitle>
                    <Button size="sm" variant="outline" className="h-7 gap-1 text-[10px] md:text-xs" onClick={() => setIsVisitDialogOpen(true)}>
                        <Plus className="h-3 w-3 md:h-4 md:w-4" /> Nueva
                    </Button>
                </CardHeader>
                <CardContent className="p-0 md:p-6 md:pt-4">
                    <div className="p-4">
                        <VisitList visits={property.visits || []} isLoading={false} onUpdate={handleUpdateVisit} />
                    </div>
                </CardContent>
            </Card>
 
            {/* Operations Section */}
            <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-blue-50/50 border-b md:border-none">
                    <CardTitle className="text-sm md:text-lg font-heading flex items-center gap-2">
                        <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-blue-600" /> Operaciones
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {(!property.operations || property.operations.length === 0) ? (
                        <div className="text-center py-6 md:py-8 text-muted-foreground text-[10px] md:text-sm italic px-4">
                            Sin operaciones activas.
                        </div>
                    ) : (
                        <div className="p-2 md:p-0">
                             <OperationList operations={property.operations || []} isLoading={false} />
                        </div>
                    )}
                </CardContent>
            </Card>
 
            {/* Change History */}
            <Card className="border-l-4 border-l-orange-500 shadow-sm overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-orange-50/50 border-b md:border-none">
                    <CardTitle className="text-sm md:text-lg font-heading flex items-center gap-2">
                        <Activity className="h-4 w-4 md:h-5 md:w-5 text-orange-600" /> Historial
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-4 md:pt-4">
                    <div className="space-y-4">
                        {(property.status_history?.length || 0) === 0 ? (
                            <p className="text-[10px] md:text-sm text-muted-foreground italic text-center py-4">Sin cambios registrados.</p>
                        ) : (
                            <div className="relative space-y-3 before:absolute before:inset-0 before:ml-4 before:h-full before:w-0.5 before:bg-linear-to-b before:from-orange-500/20 before:to-transparent">
                                {property.status_history?.slice().reverse().map((change) => (
                                    <div key={change.id} className="relative flex items-start gap-3 pl-8">
                                        <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary/20 shadow-sm z-10">
                                            {change.from_price && change.to_price && change.to_price > change.from_price ? (
                                                <ArrowUpRight className="h-3 w-3 text-destructive" />
                                            ) : change.from_price && change.to_price && change.to_price < change.from_price ? (
                                                <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                                            ) : (
                                                <Clock className="h-3 w-3 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-0.5 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-[10px] md:text-xs font-bold truncate">
                                                    {change.from_status !== change.to_status ? (
                                                        <>{change.to_status}</>
                                                    ) : (
                                                        <>Cambio Precio</>
                                                    )}
                                                </div>
                                                <time className="text-[8px] md:text-[10px] font-mono text-muted-foreground shrink-0">
                                                    {new Date(change.changed_at).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                                </time>
                                            </div>
                                            {change.from_price && change.to_price && change.from_price !== change.to_price && (
                                                <div className="flex items-center gap-1.5 text-[9px] md:text-sm">
                                                    <span className="text-muted-foreground line-through">
                                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(change.from_price)}
                                                    </span>
                                                    <span className="font-bold text-primary">
                                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(change.to_price)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
 
        {/* Column 3: Management & Notes */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4 md:space-y-6">
            {/* Agent Section */}
            <AgentCard 
                agent={property.captor_agent} 
                title="Agente Captador" 
                emptyMessage="No asignado."
            />
 
            {/* Owner Section */}
            <Card className="border-l-4 border-l-green-500 shadow-sm overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-green-50/50 border-b md:border-none">
                    <CardTitle className="text-sm md:text-lg font-heading flex items-center gap-2">
                        <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-green-600" /> Propietario
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {property.owner_client ? (
                        <Link href={`/oficina/clientes/${property.owner_client.id}`} className="block hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between p-3 md:p-4 group">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                                        <UserIcon size={18} className="md:w-5 md:h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-xs md:text-sm group-hover:text-primary transition-colors truncate">{property.owner_client.full_name}</p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                                            {property.owner_client.phone || property.owner_client.email || "Sin contacto"}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                            </div>
                        </Link>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground text-[10px] md:text-sm italic px-4">
                            Sin propietario asignado.
                        </div>
                    )}
                </CardContent>
            </Card>
 
            {/* Notes Section */}
            <div className="space-y-4">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="p-4 pb-2 bg-muted/5 border-b md:border-none">
                        <CardTitle className="text-sm md:text-lg font-bold flex items-center gap-2">
                            <StickyNote className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Notas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex gap-2">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Escribir nota..."
                                className="flex-1 min-h-[50px] md:min-h-[80px] rounded-md border border-input bg-background/50 px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            />
                            <Button
                                onClick={handleAddNote}
                                disabled={isSendingNote || !newNote.trim()}
                                size="icon"
                                className="self-end shrink-0 h-9 w-9"
                            >
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                        </div>
 
                        <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1">
                            {(property.notes?.length || 0) === 0 ? (
                                <p className="text-[10px] md:text-xs text-muted-foreground text-center py-4 italic">No hay notas registradas.</p>
                            ) : (
                                property.notes?.map((note) => (
                                    <div key={note.id} className="border-l-2 border-primary/20 pl-3 py-1 bg-muted/20 rounded-r-lg">
                                        <p className="text-xs md:text-sm">{note.text}</p>
                                        <p className="text-[9px] md:text-[10px] text-muted-foreground mt-1 font-medium">
                                            {new Date(note.created_at).toLocaleDateString("es-ES", { 
                                                day: '2-digit', 
                                                month: '2-digit', 
                                                year: '2-digit', 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
 
                {property.internal_notes && (
                    <Card className="border-dashed border-2 bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/40">
                        <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-[9px] md:text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-2">
                                <Edit className="h-3 w-3 md:h-4 md:w-4" /> Info Interna
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <p className="text-xs text-yellow-800/80 dark:text-yellow-200/80 italic leading-relaxed">
                                {property.internal_notes}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      </div>

      <RegisterVisitDialog
        isOpen={isVisitDialogOpen}
        onClose={() => setIsVisitDialogOpen(false)}
        onSubmit={handleRegisterVisit}
        initialPropertyId={property.id}
      />
    </div>
  );
}
