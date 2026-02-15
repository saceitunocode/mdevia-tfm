"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { 
  ArrowLeft, 
  Activity, 
  User, 
  Home, 
  History, 
  Briefcase,
  Clock,
  FileText,
  Eye,
  CheckCircle2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { operationService } from "@/services/operationService";
import { Operation, OperationStatus, OperationType } from "@/types/operation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CalendarEventIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'DONE': return <CheckCircle2 className="h-5 w-5" />;
    case 'CANCELLED': return <X className="h-5 w-5" />;
    default: return <Clock className="h-5 w-5" />;
  }
};

export default function OperationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [operation, setOperation] = useState<Operation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    const fetchOperation = async () => {
      try {
        const data = await operationService.getOperation(id as string);
        setOperation(data);
      } catch (error) {
        console.error("Error al cargar operación:", error);
        toast.error("Error al cargar operación", {
          description: error instanceof Error ? error.message : "Error desconocido",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperation();
  }, [id]);

  const handleStatusChange = async (newStatus: OperationStatus) => {
    if (!operation) return;
    
    setIsUpdating(true);
    try {
      const updated = await operationService.updateStatus(operation.id, {
        status: newStatus,
        note: note || `Cambio de estado a ${newStatus}`
      });
      setOperation(updated);
      setNote("");
      toast.success("Estado actualizado");
    } catch (error) {
      // console.error("Error al actualizar estado:", error);
      toast.error("Error al actualizar estado", {
        description: error instanceof Error ? error.message : "Error inesperado",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!operation || !newNote.trim()) return;
    
    setIsAddingNote(true);
    try {
      await operationService.addNote(operation.id, newNote);
      // Refresh operation to show the new note
      const updated = await operationService.getOperation(operation.id);
      setOperation(updated);
      setNewNote("");
      toast.success("Nota añadida");
    } catch (error) {
      // console.error("Error al añadir nota:", error);
      toast.error("Error al añadir nota", {
        description: error instanceof Error ? error.message : "Error inesperado",
      });
    } finally {
      setIsAddingNote(false);
    }
  };

  const getStatusBadge = (status: OperationStatus) => {
    switch (status) {
      case OperationStatus.INTEREST: 
        return <Badge className="bg-blue-100 text-blue-800 border-none">Interés</Badge>;
      case OperationStatus.NEGOTIATION: 
        return <Badge className="bg-yellow-100 text-yellow-800 border-none">Negociación</Badge>;
      case OperationStatus.RESERVED: 
        return <Badge className="bg-orange-100 text-orange-800 border-none">Reservado</Badge>;
      case OperationStatus.CLOSED: 
        return <Badge className="bg-green-100 text-green-800 border-none">Cerrado</Badge>;
      case OperationStatus.CANCELLED: 
        return <Badge className="bg-red-100 text-red-800 border-none">Cancelado</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Cargando detalles de la operación...</div>;
  if (!operation) return <div className="p-8 text-red-500">Operación no encontrada</div>;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-heading font-bold">
                Operación: {operation.type === OperationType.SALE ? "Venta" : "Alquiler"}
              </h1>
              {getStatusBadge(operation.status)}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Referencia: #{operation.id.substring(0, 8)} • Actualizado el {format(new Date(operation.updated_at), "d MMM, HH:mm", { locale: es })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status Update Card */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
            <CardHeader className="bg-blue-50/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                Control de Estado
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {Object.values(OperationStatus).map((status) => (
                  <Button
                    key={status}
                    variant={operation.status === status ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdating || operation.status === status}
                    onClick={() => handleStatusChange(status as OperationStatus)}
                    className="capitalize"
                  >
                    {status.toLowerCase()}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nota de seguimiento (opcional)</label>
                <Input 
                  placeholder="Ej: El cliente ha aceptado la contraoferta..." 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* History Timeline */}
            <Card className="border-none shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History size={18} className="text-primary" />
                  Línea de Tiempo
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
                  {operation.status_history && [...operation.status_history].reverse().map((entry) => (
                    <div key={entry.id} className="relative pl-8">
                      <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-primary" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-muted-foreground">{entry.from_status}</span>
                          <ArrowLeft size={12} className="rotate-180 text-muted-foreground" />
                          <span className="text-sm font-bold text-primary">{entry.to_status}</span>
                        </div>
                        {entry.note && (
                          <p className="text-sm italic text-foreground">&quot;{entry.note}&quot;</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {format(new Date(entry.changed_at), "d MMMM yyyy, HH:mm", { locale: es })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="relative pl-8">
                      <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-green-500" />
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-green-600">Creación</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {format(new Date(operation.created_at), "d MMMM yyyy, HH:mm", { locale: es })}
                        </div>
                      </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Notes Card */}
            <Card className="border-none shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  Notas Internas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nota rápida..." 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    disabled={isAddingNote}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAddNote} 
                    disabled={isAddingNote || !newNote.trim()}
                  >
                    {isAddingNote ? "..." : "Añadir"}
                  </Button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {operation.notes && operation.notes.length > 0 ? (
                    operation.notes.map((n) => (
                      <div key={n.id} className="bg-muted/30 p-4 rounded-lg space-y-2 border border-border/50">
                        <p className="text-sm whitespace-pre-wrap">{n.text}</p>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/20">
                          <span className="font-bold flex items-center gap-1">
                             <User size={10} /> {n.author?.full_name || "Agente"}
                          </span>
                          <span>{format(new Date(n.created_at), "d MMM yyyy", { locale: es })}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                      <p className="text-sm font-medium">No hay notas generales.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Visits Card */}
          <Card className="border-l-4 border-l-primary shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye size={18} className="text-primary" />
                Visitas Asociadas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {operation.visits && operation.visits.length > 0 ? (
                <div className="space-y-4">
                  {operation.visits.map((visit) => (
                    <div key={visit.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <CalendarEventIcon status={visit.status} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm">
                            {format(new Date(visit.scheduled_at), "d 'de' MMMM, yyyy", { locale: es })}
                          </p>
                          <Badge variant={visit.status === 'DONE' ? 'default' : 'outline'} className="text-[10px] h-5 px-1.5 uppercase tracking-wider">
                            {visit.status === 'DONE' ? 'Realizada' : visit.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {format(new Date(visit.scheduled_at), "HH:mm")}
                          <span className="mx-1">•</span>
                          <User size={12} />
                          {visit.agent?.full_name || "Agente"}
                        </div>
                        {visit.notes && visit.notes.length > 0 && (
                          <div className="mt-2 text-sm text-foreground/80 bg-background/50 p-2 rounded border border-border/30 italic">
                            &quot;{visit.notes[0].text}&quot;
                          </div>
                        )}
                      </div>
                      <Link href={`/oficina/agenda?visitId=${visit.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Ver en Agenda
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
                  <p className="text-sm font-medium">No se han registrado visitas para este cliente en esta propiedad.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>


        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Client Card */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-blue-50/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-600">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm truncate">{operation.client?.full_name || "Cargando..."}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Expediente principal</p>
                </div>
              </div>
              <Link href={`/oficina/clientes/${operation.client_id}`}>
                <Button variant="outline" size="sm" className="w-full h-8 text-xs">Gestionar Cliente</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Property Card */}
          <Card className="border-l-4 border-l-green-500 shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-green-50/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-green-600">Propiedad</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                  <Home size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm truncate max-w-[150px]">{operation.property?.title || "Cargando..."}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Ficha técnica</p>
                </div>
              </div>
              <Link href={`/oficina/propiedades/${operation.property_id}`}>
                <Button variant="outline" size="sm" className="w-full h-8 text-xs">Ver Inmueble</Button>
              </Link>
            </CardContent>
          </Card>

           {/* Agent Card */}
           <Card className="border-primary/10 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Agente Asignado</p>
                  <p className="font-bold">{operation.agent?.full_name || "Cargando..."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
