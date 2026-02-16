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
  Clock,
  FileText,
  Eye,
  CheckCircle2,
  X,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { operationService } from "@/services/operationService";
import { Operation, OperationStatus, OperationType } from "@/types/operation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AgentCard } from "@/components/users/AgentCard";

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
    <div className="space-y-4 md:space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full shrink-0" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <h1 className="text-xl md:text-3xl font-heading font-bold truncate">
                {operation.type === OperationType.SALE ? "Venta" : "Alquiler"}
              </h1>
              {getStatusBadge(operation.status)}
            </div>
            <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5 md:mt-1 truncate">
              Ref: #{operation.id.substring(0, 8)} • {format(new Date(operation.updated_at), "d MMM, HH:mm", { locale: es })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Column 1: Operation Management */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          {/* Status Update Card */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
            <CardHeader className="bg-blue-50/50 py-3 md:pb-4 px-4 md:px-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Activity className="h-4 w-4 md:h-[18px] md:w-[18px] text-blue-600" />
                Control de Estado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:pt-6 space-y-4 md:space-y-6">
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {Object.values(OperationStatus).map((status) => (
                  <Button
                    key={status}
                    variant={operation.status === status ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdating || operation.status === status}
                    onClick={() => handleStatusChange(status as OperationStatus)}
                    className="capitalize h-7 md:h-9 text-[10px] md:text-xs"
                  >
                    {status.toLowerCase()}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-sm font-medium uppercase tracking-wider text-muted-foreground">Nota de seguimiento</label>
                <Input 
                  className="h-9 md:h-10 text-sm"
                  placeholder="Ej: El cliente ha aceptado..." 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
            </CardContent>
          </Card>

          {/* History Timeline */}
          <Card className="border-none shadow-sm">
            <CardHeader className="py-3 md:pb-2 px-4 md:px-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <History className="h-4 w-4 md:h-[18px] md:w-[18px] text-primary" />
                Línea de Tiempo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:pt-4">
              <div className="relative border-l-2 border-muted ml-2 md:ml-3 space-y-6 md:space-y-8 pb-2 md:pb-4">
                {operation.status_history && [...operation.status_history].reverse().map((entry) => (
                  <div key={entry.id} className="relative pl-6 md:pl-8">
                    <div className="absolute -left-[7px] md:-left-[9px] top-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-white border-2 border-primary" />
                    <div className="space-y-0.5 md:space-y-1">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-xs md:text-sm font-bold text-muted-foreground">{entry.from_status}</span>
                        <ArrowLeft size={10} className="rotate-180 text-muted-foreground" />
                        <span className="text-xs md:text-sm font-bold text-primary">{entry.to_status}</span>
                      </div>
                      {entry.note && (
                        <p className="text-xs md:text-sm italic text-foreground">&quot;{entry.note}&quot;</p>
                      )}
                      <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        {format(new Date(entry.changed_at), "d MMM, HH:mm", { locale: es })}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="relative pl-6 md:pl-8">
                    <div className="absolute -left-[7px] md:-left-[9px] top-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-white border-2 border-green-500" />
                    <div className="space-y-0.5 md:space-y-1">
                      <div className="text-xs md:text-sm font-bold text-green-600">Creación</div>
                      <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        {format(new Date(operation.created_at), "d MMM, HH:mm", { locale: es })}
                      </div>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Participants */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          {/* Agent Card */}
          <div className="md:contents">
             <AgentCard 
               agent={operation.agent} 
               title="Agente Responsable" 
               emptyMessage="No hay agente asignado."
             />
          </div>

          {/* Client Card */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
            <CardHeader className="py-2.5 md:py-2 bg-blue-50/50 px-4 md:px-6">
                <CardTitle className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-blue-600">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <User className="h-[18px] w-[18px] md:h-5 md:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs md:text-sm truncate">{operation.client?.full_name || "Cargando..."}</p>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-tight">Expediente principal</p>
                  {operation.client?.phone && (
                    <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                      <Phone size={10} className="md:size-3" />
                      <span className="text-[10px] md:text-xs font-medium">{operation.client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <Link href={`/oficina/clientes/${operation.client_id}`}>
                <Button variant="outline" size="sm" className="w-full h-8 text-[10px] md:text-xs">Gestionar Cliente</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Property Card */}
          <Card className="border-l-4 border-l-green-500 shadow-sm overflow-hidden">
            <CardHeader className="py-2.5 md:py-2 bg-green-50/50 px-4 md:px-6">
                <CardTitle className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-green-600">Propiedad</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                  <Home className="h-[18px] w-[18px] md:h-5 md:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs md:text-sm truncate">{operation.property?.title || "Cargando..."}</p>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-tight">Ficha técnica</p>
                </div>
              </div>
              <Link href={`/oficina/propiedades/${operation.property_id}`}>
                <Button variant="outline" size="sm" className="w-full h-8 text-[10px] md:text-xs">Ver Inmueble</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Activities & Notes */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          {/* Related Visits Card */}
          <Card className="border-l-4 border-l-primary shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-3 md:pb-2 bg-muted/10 px-4 md:px-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Eye className="h-4 w-4 md:h-[18px] md:w-[18px] text-primary" />
                Visitas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:pt-4">
              {operation.visits && operation.visits.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {operation.visits.map((visit) => (
                    <div key={visit.id} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg bg-muted/20 border border-border/50">
                      <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <CalendarEventIcon status={visit.status} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-xs md:text-sm truncate">
                            {format(new Date(visit.scheduled_at), "d MMM, yyyy", { locale: es })}
                          </p>
                          <Badge variant={visit.status === 'DONE' ? 'default' : 'outline'} className="text-[8px] md:text-[10px] h-4 md:h-5 px-1 md:px-1.5 uppercase tracking-wider shrink-0">
                            {visit.status === 'DONE' ? 'Realizada' : visit.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground">
                          <Clock size={10} />
                          {format(new Date(visit.scheduled_at), "HH:mm")}
                          <span className="mx-0.5">•</span>
                          <User size={10} />
                          <span className="truncate">{visit.agent?.full_name?.split(' ')[0] || "Agente"}</span>
                        </div>
                      </div>
                      <Link href={`/oficina/agenda?visitId=${visit.id}`} className="shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8">
                          <ArrowLeft className="rotate-180 h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-10 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border px-4">
                  <p className="text-xs md:text-sm font-medium italic">Sin visitas registradas.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* General Notes Card */}
          <Card className="border-none shadow-sm">
            <CardHeader className="py-3 md:pb-2 px-4 md:px-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 md:h-[18px] md:w-[18px] text-primary" />
                Notas Internas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:pt-4 space-y-4 md:space-y-6">
              <div className="flex gap-2">
                <Input 
                  className="h-8 md:h-9 text-xs md:text-sm"
                  placeholder="Añadir nota..." 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  disabled={isAddingNote}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                />
                <Button 
                  size="sm" 
                  className="h-8 md:h-9 text-xs px-2 md:px-3"
                  onClick={handleAddNote} 
                  disabled={isAddingNote || !newNote.trim()}
                >
                  {isAddingNote ? "..." : "Añadir"}
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1 md:pr-2">
                {operation.notes && operation.notes.length > 0 ? (
                  operation.notes.map((n) => (
                    <div key={n.id} className="bg-muted/30 p-3 md:p-4 rounded-lg space-y-1.5 md:space-y-2 border border-border/50">
                      <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{n.text}</p>
                      <div className="flex justify-between items-center text-[9px] md:text-[10px] text-muted-foreground pt-1 md:pt-2 border-t border-border/20">
                        <span className="font-bold flex items-center gap-1">
                           <User className="h-2 w-2 md:h-2.5 md:w-2.5" /> {n.author?.full_name || "Agente"}
                        </span>
                        <span>{format(new Date(n.created_at), "d MMM", { locale: es })}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border px-4">
                    <p className="text-xs md:text-sm font-medium">No hay notas generales.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
