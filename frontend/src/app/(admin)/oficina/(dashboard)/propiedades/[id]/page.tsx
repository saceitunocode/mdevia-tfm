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
    ArrowUpRight, ArrowDownRight, TrendingUp, Clock,
    ChevronRight, Bath, Layers, ArrowUp, Mail, Shield
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/oficina/propiedades">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold">Propiedades</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-foreground truncate max-w-[200px]">{property.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-heading font-bold">{property.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant={property.status === PropertyStatus.AVAILABLE ? 'default' : 'secondary'} className="text-sm px-3 py-1 uppercase tracking-wide">
                    {property.status}
                </Badge>
                {property.is_featured && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs font-bold uppercase tracking-wider">
                        Destacado
                    </Badge>
                )}
                {property.is_published ? (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs font-bold uppercase tracking-wider">
                        Publicado
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 text-xs font-bold uppercase tracking-wider">
                        Borrador
                    </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                    {property.address_line1}
                    {property.address_line2 ? `, ${property.address_line2}` : ''}
                    {property.postal_code ? ` (${property.postal_code})` : ''}, {property.city}
                </span>
                <span className="mx-1">•</span>
                <span className="font-medium text-foreground/80">{property.property_type === 'APARTMENT' ? 'Piso' : property.property_type === 'HOUSE' ? 'Casa' : property.property_type === 'OFFICE' ? 'Oficina' : 'Terreno'} en {property.operation_type === 'SALE' ? 'Venta' : 'Alquiler'}</span>
            </div>
          </div>
        </div>
        <Link href={`/oficina/propiedades/${property.id}/editar`}>
            <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Editar Propiedad
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column: Gallery, Price/Specs, Description */}
        <div className="lg:col-span-8 space-y-6">
            <PropertyGallery images={property.images || []} />

            {/* Price & Specs Block - MOVED HERE with ORIGINAL STYLE */}
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-baseline justify-between border-b pb-4">
                        <span className="text-muted-foreground font-medium">Precio</span>
                        <span className="text-3xl font-bold text-primary flex items-center gap-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(property.price_amount)}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/40 text-center transition-all hover:bg-muted/60">
                            <div className="flex items-center justify-center text-primary mb-1">
                                <Ruler className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold">{property.sqm}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Metros ²</span>
                        </div>
                        <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/40 text-center transition-all hover:bg-muted/60">
                            <div className="flex items-center justify-center text-primary mb-1">
                                <BedDouble className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold">{property.rooms}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Habitaciones</span>
                        </div>
                        <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/40 text-center transition-all hover:bg-muted/60">
                            <div className="flex items-center justify-center text-primary mb-1">
                                <Bath className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold">{property.baths}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Baños</span>
                        </div>
                        <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/40 text-center transition-all hover:bg-muted/60 relative overflow-hidden">
                            <div className="flex items-center justify-center text-primary mb-1">
                                <Layers className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold">{property.floor !== null ? `${property.floor}ª` : 'Bajo'}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Planta</span>
                            
                            {property.has_elevator ? (
                                <div className="mt-1 py-0.5 px-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-full inline-flex items-center justify-center gap-1 mx-auto">
                                    <ArrowUp className="h-2.5 w-2.5" /> Ascensor
                                </div>
                            ) : (
                                <div className="mt-1 py-0.5 px-2 bg-slate-200 text-slate-500 text-[9px] font-bold uppercase rounded-full inline-flex items-center justify-center mx-auto">
                                    Sin Ascensor
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-heading">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                        {property.public_description || "Sin descripción pública disponible."}
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Sidebar: Management Blocks with ORIGINAL STYLES */}
        <div className="lg:col-span-4 space-y-6">
            {/* Owner Section - Original Green Style */}
            <Card className="border-l-4 border-l-green-500 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 bg-green-50/50">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-green-600" /> Propietario
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-0">
                    {property.owner_client ? (
                        <Link href={`/oficina/clientes/${property.owner_client.id}`} className="block hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between p-4 group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                                        <UserIcon size={20} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-sm group-hover:text-primary transition-colors">{property.owner_client.full_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {property.owner_client.email || "Sin email"} • {property.owner_client.phone || "Sin teléfono"}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground text-sm italic">
                            Sin propietario asignado.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Visits Section - Original Primary Style */}
            <Card className="border-l-4 border-l-primary shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" /> Visitas Programadas
                    </CardTitle>
                    <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => setIsVisitDialogOpen(true)}>
                        <Plus className="h-4 w-4" /> Nueva Visita
                    </Button>
                </CardHeader>
                <CardContent className="pt-4">
                    <VisitList visits={property.visits || []} isLoading={false} onUpdate={handleUpdateVisit} />
                </CardContent>
            </Card>

            {/* Operations Section - Original Blue Style */}
            <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 bg-blue-50/50">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" /> Operaciones Asociadas
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-0">
                    {(!property.operations || property.operations.length === 0) ? (
                        <div className="text-center py-8 text-muted-foreground text-sm italic">
                            No hay operaciones asociadas a esta propiedad.
                        </div>
                    ) : (
                        <OperationList operations={property.operations || []} isLoading={false} />
                    )}
                </CardContent>
            </Card>

            {/* Change History - Original Orange Style */}
            <Card className="border-l-4 border-l-orange-500 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 bg-orange-50/50">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-600" /> Historial de Evolución
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-4">
                    <div className="space-y-4">
                        {(property.status_history?.length || 0) === 0 ? (
                            <p className="text-sm text-muted-foreground italic text-center py-4">No hay cambios registrados todavía.</p>
                        ) : (
                            <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-linear-to-b before:from-orange-500/20 before:to-transparent">
                                {property.status_history?.slice().reverse().map((change) => (
                                    <div key={change.id} className="relative flex items-start gap-4 pl-10">
                                        <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary/20 shadow-sm z-10">
                                            {change.from_price && change.to_price && change.to_price > change.from_price ? (
                                                <ArrowUpRight className="h-4 w-4 text-destructive" />
                                            ) : change.from_price && change.to_price && change.to_price < change.from_price ? (
                                                <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-bold">
                                                    {change.from_status !== change.to_status ? (
                                                        <>Estado: <span className="text-muted-foreground line-through decoration-1">{change.from_status}</span> &rarr; <Badge variant="outline" className="bg-primary/5 ml-1">{change.to_status}</Badge></>
                                                    ) : (
                                                        <>Actualización de precio</>
                                                    )}
                                                </div>
                                                <time className="text-[10px] font-mono text-muted-foreground">
                                                    {new Date(change.changed_at).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                </time>
                                            </div>
                                            {change.from_price && change.to_price && change.from_price !== change.to_price && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-muted-foreground line-through decoration-1">
                                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(change.from_price)}
                                                    </span>
                                                    <span className="font-bold text-primary">
                                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(change.to_price)}
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

            {/* Captor Agent Section - Original Purple Style */}
            <Card className="border-l-4 border-l-purple-500 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 bg-purple-50/50">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" /> Agente Captador
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 p-4">
                    {property.captor_agent ? (
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                                <UserIcon size={20} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-sm">{property.captor_agent.full_name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    {property.captor_agent.email}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">No se ha asignado un agente captador.</p>
                    )}
                </CardContent>
            </Card>

            {/* Notes Section - Original Style */}
            <div className="space-y-4">
                <Card className="border-none shadow-sm h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <StickyNote className="h-5 w-5 text-primary" /> Notas de Seguimiento
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Añadir nota de seguimiento..."
                                className="flex-1 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            />
                            <Button
                                onClick={handleAddNote}
                                disabled={isSendingNote || !newNote.trim()}
                                size="icon"
                                className="self-end shrink-0"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {(property.notes?.length || 0) === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-4 italic">No hay notas de seguimiento.</p>
                            ) : (
                                property.notes?.map((note) => (
                                    <div key={note.id} className="border-l-2 border-primary/20 pl-3 py-1">
                                        <p className="text-sm">{note.text}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
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
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-2">
                                <Edit className="h-4 w-4" /> Notas de la ficha (Legacy)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-yellow-800/80 dark:text-yellow-200/80 italic leading-relaxed">
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
