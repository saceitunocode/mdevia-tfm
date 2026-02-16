"use client";

import React, { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Trash2, User, Building2, Info, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/Dialog";
import { apiRequest } from "@/lib/api";
import { EventType, CalendarEvent, CalendarEventUpdate } from "@/types/calendar";
import { Visit } from "@/types/visit";

interface ClientListItem {
  id: string;
  full_name: string;
}

interface PropertyListItem {
  id: string;
  title: string;
}

// --- Schema Validation ---
const eventSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  type: z.nativeEnum(EventType),
  date: z.string().min(1, "La fecha es obligatoria"), // YYYY-MM-DD
  startTime: z.string().min(1, "Hora de inicio obligatoria"), // HH:MM
  description: z.string().optional(),
  client_id: z.string().optional(),
  property_id: z.string().optional(),
}).refine((data) => {
    if (data.type === EventType.VISIT) {
        return !!data.client_id && !!data.property_id;
    }
    return true;
}, {
    message: "El cliente y la propiedad son obligatorios para una visita",
    path: ["client_id"],
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EditEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: CalendarEventUpdate) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  event?: CalendarEvent | null;
}

export function EditEventDialog({ isOpen, onClose, onSubmit, onDelete, event }: EditEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      type: EventType.VISIT,
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "10:00",
      description: "",
      client_id: "",
      property_id: "",
    },
  });


  // Load event data when dialog opens
  React.useEffect(() => {
    if (isOpen && event) {
        setIsSubmitting(false);
        setIsDeleting(false);
        const start = new Date(event.starts_at);
        
        form.reset({
            title: event.title,
            type: event.type,
            date: format(start, "yyyy-MM-dd"),
            startTime: format(start, "HH:mm"),
            description: event.description || "",
            client_id: event.client_id || "",
            property_id: event.property_id || "",
        });

        const loadData = async () => {
             try {
                // 1. Load clients and properties lists if needed
                if (!hasLoadedData) {
                    const [clientsData, propsData] = await Promise.all([
                        apiRequest<ClientListItem[]>("/clients/"),
                        apiRequest<PropertyListItem[]>("/properties/"),
                    ]);
                    setClients(clientsData.map(c => ({ id: c.id, full_name: c.full_name })));
                    setProperties(propsData.map(p => ({ id: p.id, title: p.title })));
                    setHasLoadedData(true);
                }

                // 2. If it's a visit but missing client/property in event, fetch the visit details
                if (event.type === EventType.VISIT && event.visit_id && (!event.client_id || !event.property_id)) {
                    // Import Visit type here or just assume structure
                    const visit = await apiRequest<Visit>(`/visits/${event.visit_id}`);
                    if (visit) {
                         // Update form with real data from visit
                         form.setValue("client_id", visit.client_id);
                         form.setValue("property_id", visit.property_id);
                    }
                }
            } catch (error) {
                console.error("Error fetching data for edit event dialog:", error);
                toast.error("Error cargando datos del evento", {
                    description: error instanceof Error ? error.message : "Error desconocido"
                });
            }
        };

        if (event.type === EventType.VISIT) {
             loadData();
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, event, form.reset]);

  const handleSubmit = async (values: EventFormValues) => {
    if (!event) return;
    
    setIsSubmitting(true);
    try {
        const startDate = new Date(`${values.date}T${values.startTime}:00`);
        const startIso = startDate.toISOString();
        const endIso = new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();

        const updates: CalendarEventUpdate = {
            title: values.title,
            type: values.type,
            starts_at: startIso,
            ends_at: endIso,
            description: values.description,
            client_id: values.client_id || undefined,
            property_id: values.property_id || undefined,
        };

        await onSubmit(event.id, updates);
        toast.success("Evento actualizado correctamente");
        onClose();
    } catch (error) {
        toast.error("Error al actualizar el evento", {
            description: error instanceof Error ? error.message : "Error inesperado",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<EventFormValues>) => {
    const errorMessages = Object.values(errors)
      .map((err) => err?.message)
      .filter(Boolean)
      .join(". ");
    
    if (errorMessages) {
      toast.error("Error de validación", {
        description: errorMessages,
      });
    }
  };

  const handleDelete = async () => {
      if (!event || !onDelete) return;
      if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) return;

      setIsDeleting(true);
      try {
          await onDelete(event.id);
          toast.success("Evento eliminado");
          onClose();
      } catch (error) {
          // console.error("Error deleting event", error);
          toast.error("Error al eliminar el evento", {
              description: error instanceof Error ? error.message : undefined,
          });
      } finally {
          setIsDeleting(false);
      }
  }

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-primary/5 border-b border-primary/10 p-4 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold tracking-tight">Editar Evento</DialogTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Detalles de la Cita</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="flex flex-col flex-1 min-h-0">
          <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          
            <div className="space-y-3">
              {/* Title & Type - Compact Row */}
              <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground h-4">
                      <Info className="h-3.5 w-3.5 text-primary" /> Título
                    </label>
                    <div className="h-9 px-3 flex items-center bg-muted/30 border border-border rounded-lg text-xs font-bold text-foreground/70 truncate shadow-sm" title={event.title}>
                      {event.title}
                      <Lock className="ml-auto h-3 w-3 opacity-30 shrink-0" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground h-4">
                       <span className="w-3.5 h-3.5 inline-block" /> Tipo
                    </label>
                    <div className="h-9 px-2 flex items-center justify-center bg-muted/30 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider text-primary/70 truncate shadow-sm">
                      {event.type.toLowerCase()}
                    </div>
                  </div>
              </div>

              {/* Linked Data - Read Only */}
              {event.type === EventType.VISIT && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold flex items-center gap-1 text-muted-foreground uppercase tracking-wide">
                      <User className="h-3 w-3" /> Cliente
                    </label>
                    <div className="text-xs font-medium truncate pl-4 text-foreground/80">
                      {clients.find(c => c.id === form.watch("client_id"))?.full_name || "Vinculado"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold flex items-center gap-1 text-muted-foreground uppercase tracking-wide">
                      <Building2 className="h-3 w-3" /> Propiedad
                    </label>
                    <div className="text-xs font-medium truncate pl-4 text-foreground/80">
                      {properties.find(p => p.id === form.watch("property_id"))?.title || "Vinculada"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-border/50" />

            {/* Date & Time Section - EDITABLE */}
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 shadow-inner">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-2 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Reprogramar Cita
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nueva Fecha</label>
                    <div className="relative group">
                        <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary group-focus-within:scale-110 transition-transform pointer-events-none" />
                        <Input 
                            type="date" 
                            {...form.register("date")} 
                            className="pl-8 h-9 bg-background border-primary/20 shadow-sm focus:ring-primary focus:border-primary rounded-lg text-xs" 
                        />
                    </div>
                </div>
                
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Hora Inicio</label>
                    <div className="relative group">
                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary group-focus-within:scale-110 transition-transform pointer-events-none" />
                        <Input 
                            type="time" 
                            {...form.register("startTime")} 
                            className="pl-8 h-9 bg-background border-primary/20 shadow-sm focus:ring-primary focus:border-primary rounded-lg text-xs font-bold" 
                        />
                    </div>
                </div>
              </div>
            </div>

            {/* Description - EDITABLE */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                 Notas e Instrucciones
              </label>
              <Textarea 
                  {...form.register("description")} 
                  placeholder="Detalles adicionales..." 
                  className="resize-none h-20 bg-background border-input focus:ring-primary shadow-sm rounded-lg p-3 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/20 border-t border-border/50 gap-2 sm:gap-0 shrink-0">
            {onDelete && (
                <div className="flex-1 mr-auto">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={handleDelete} 
                        disabled={isDeleting || isSubmitting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 md:h-9 px-2 text-xs md:text-sm"
                    >
                        <Trash2 className="w-3.5 h-3.5 md:mr-2" />
                        <span className="hidden md:inline">Eliminar</span>
                    </Button>
                </div>
            )}
            
            <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose} 
                  disabled={isSubmitting}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[150px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold rounded-xl"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
