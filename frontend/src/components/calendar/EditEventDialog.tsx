"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Trash2 } from "lucide-react";

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
import { Select } from "@/components/ui/Select";
import { apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
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
  endTime: z.string().min(1, "Hora de fin obligatoria"), // HH:MM
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
}).refine((data) => {
    return data.endTime > data.startTime;
}, {
    message: "La hora de fin debe ser posterior a la de inicio",
    path: ["endTime"],
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
      endTime: "11:00",
      description: "",
      client_id: "",
      property_id: "",
    },
  });

  const selectedType = form.watch("type");

  // Load event data when dialog opens
  React.useEffect(() => {
    if (isOpen && event) {
        setIsSubmitting(false);
        setIsDeleting(false);
        const start = new Date(event.starts_at);
        const end = new Date(event.ends_at);
        
        form.reset({
            title: event.title,
            type: event.type,
            date: format(start, "yyyy-MM-dd"),
            startTime: format(start, "HH:mm"),
            endTime: format(end, "HH:mm"),
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
            } catch (err) {
                console.error("Error fetching data for edit event dialog:", err);
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
        const startIso = new Date(`${values.date}T${values.startTime}:00`).toISOString();
        const endIso = new Date(`${values.date}T${values.endTime}:00`).toISOString();

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
        onClose();
    } catch (error) {
        console.error("Error updating event", error);
        form.setError("root", { 
            type: "manual",
            message: "No se pudo actualizar el evento. Inténtalo de nuevo."
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
      if (!event || !onDelete) return;
      if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) return;

      setIsDeleting(true);
      try {
          await onDelete(event.id);
          onClose();
      } catch (error) {
          console.error("Error deleting event", error);
           form.setError("root", { 
            type: "manual",
            message: "Error al eliminar el evento."
        });
      } finally {
          setIsDeleting(false);
      }
  }

  if (!event) return null;

  const isLinkedVisit = !!event.visit_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input 
                {...form.register("title")} 
                placeholder="Ej: Visita Calle Mayor" 
            />
            {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Evento</label>
            <div className="grid grid-cols-2 gap-2">
                {Object.values(EventType).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value={type}
                            id={`edit-type-${type}`}
                            {...form.register("type")}
                            className="text-primary focus:ring-primary"
                        />
                        <label htmlFor={`edit-type-${type}`} className="text-sm cursor-pointer capitalize">
                            {type.toLowerCase()}
                        </label>
                    </div>
                ))}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Fecha</label>
                <div className="relative">
                    <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="date" 
                        {...form.register("date")} 
                        className="pl-9" 
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Inicio</label>
                    <div className="relative">
                        <Clock className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                        <Input 
                            type="time" 
                            {...form.register("startTime")} 
                            className="pl-7" 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fin</label>
                    <div className="relative">
                         <Clock className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                        <Input 
                            type="time" 
                            {...form.register("endTime")} 
                            className="pl-7" 
                        />
                    </div>
                </div>
            </div>
          </div>
          {form.formState.errors.endTime && (
             <p className="text-xs text-destructive">{form.formState.errors.endTime.message}</p>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notas / Descripción</label>
            <Textarea 
                {...form.register("description")} 
                placeholder="Detalles adicionales..." 
                className="resize-none h-20"
            />
          </div>

          {/* Visit specific fields */}
          {selectedType === EventType.VISIT && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cliente</label>
                <Select 
                  {...form.register("client_id")}
                  className={cn(isLinkedVisit && "pointer-events-none opacity-50 bg-muted/50")}
                  tabIndex={isLinkedVisit ? -1 : undefined}
                  aria-disabled={isLinkedVisit}
                >
                  <option value="">Seleccionar...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </Select>
                {form.formState.errors.client_id && (
                  <p className="text-xs text-destructive">{form.formState.errors.client_id.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Propiedad</label>
                <Select 
                  {...form.register("property_id")}
                  className={cn(isLinkedVisit && "pointer-events-none opacity-50 bg-muted/50")}
                  tabIndex={isLinkedVisit ? -1 : undefined}
                  aria-disabled={isLinkedVisit}
                >
                  <option value="">Seleccionar...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </Select>
                {form.formState.errors.property_id && (
                  <p className="text-xs text-destructive">{form.formState.errors.property_id.message}</p>
                )}
                {isLinkedVisit && (
                   <p className="text-[10px] text-muted-foreground mt-1">
                     No se puede cambiar el cliente o propiedad de una visita creada.
                   </p>
                )}
              </div>
            </div>
          )}

          {form.formState.errors.root && (
            <div className="p-3 rounded bg-destructive/10 text-destructive text-sm font-medium">
                {form.formState.errors.root.message}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {onDelete && (
                <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete} 
                    disabled={isDeleting || isSubmitting}
                    className="mr-auto"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                </Button>
            )}
            
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
