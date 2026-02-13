"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
    Loader2, ArrowLeft, Edit, MapPin, Ruler, BedDouble, 
    Tag, User, Plus, Calendar, Briefcase, Activity, 
    ArrowUpRight, ArrowDownRight, TrendingUp, Clock,
    ChevronRight
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
            <Badge variant={property.status === PropertyStatus.AVAILABLE ? 'default' : 'secondary'} className="text-sm px-3 py-1 uppercase tracking-wide">
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

            {/* Visits Section */}
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

            {/* Operations Section */}
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
                        <OperationList operations={property.operations} isLoading={false} />
                    )}
                </CardContent>
            </Card>

            {/* Change History (Prices & Status) */}
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
                                                <p className="text-sm font-bold">
                                                    {change.from_status !== change.to_status ? (
                                                        <>Estado: <span className="text-muted-foreground line-through decoration-1">{change.from_status}</span> &rarr; <Badge variant="outline" className="bg-primary/5 ml-1">{change.to_status}</Badge></>
                                                    ) : (
                                                        <>Actualización de precio</>
                                                    )}
                                                </p>
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
                                            {change.note && (
                                                <p className="text-xs text-muted-foreground italic bg-muted/20 p-2 rounded">
                                                    {change.note}
                                                </p>
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
                                <Clock className="h-4 w-4" /> Captador
                            </span>
                            <span className="font-medium">Admin (Tú)</span>
                         </div>
                    </div>
                </CardContent>
            </Card>

            {/* Owner Section */}
            <Card className="border-l-4 border-l-green-500 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 bg-green-50/50">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <User className="h-5 w-5 text-green-600" /> Propietario
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-0">
                    {property.owner_client ? (
                        <Link href={`/oficina/clientes/${property.owner_client.id}`} className="block hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between p-4 group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                                        <User size={20} />
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

            {/* Internal & Dynamic Notes */}
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
