"use client";

import React, { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
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
import { Select } from "@/components/ui/Select";
import { apiRequest } from "@/lib/api";
import { EventType, CalendarEventCreate } from "@/types/calendar";

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
    // Basic check ensuring end time is after start time
    // More robust check would parse dates
    return data.endTime > data.startTime;
}, {
    message: "La hora de fin debe ser posterior a la de inicio",
    path: ["endTime"],
});

type EventFormValues = z.infer<typeof eventSchema>;

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CalendarEventCreate) => Promise<void>;
  defaultDate?: Date;
}

export function CreateEventDialog({ isOpen, onClose, onSubmit, defaultDate }: CreateEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      type: EventType.VISIT,
      date: defaultDate ? format(defaultDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      startTime: "10:00",
      endTime: "11:00",
      description: "",
      client_id: "",
      property_id: "",
    },
  });

  const selectedType = form.watch("type");

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
        setIsSubmitting(false);
        form.reset({
            title: "",
            type: EventType.VISIT,
            date: defaultDate ? format(defaultDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
            startTime: "10:00",
            endTime: "11:00",
            description: "",
            client_id: "",
            property_id: "",
        });

        if (!hasLoadedData) {
            const fetchData = async () => {
                try {
                    const [clientsData, propsData] = await Promise.all([
                        apiRequest<ClientListItem[]>("/clients/"),
                        apiRequest<PropertyListItem[]>("/properties/"),
                    ]);
                    setClients(clientsData.map(c => ({ id: c.id, full_name: c.full_name })));
                    setProperties(propsData.map(p => ({ id: p.id, title: p.title })));
                    setHasLoadedData(true);
                } catch (error) {
                    console.error("Error fetching data for event dialog:", error);
                    toast.error("Error cargando datos del evento", {
                        description: error instanceof Error ? error.message : "Error desconocido"
                    });
                }
            };
            fetchData();
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultDate, form.reset]); // Removed 'form' to avoid re-runs, added 'form.reset' which is stable

  const handleSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true);
    try {
        const startIso = new Date(`${values.date}T${values.startTime}:00`).toISOString();
        const endIso = new Date(`${values.date}T${values.endTime}:00`).toISOString();

        const eventData: CalendarEventCreate = {
            title: values.title,
            type: values.type,
            starts_at: startIso,
            ends_at: endIso,
            description: values.description,
            client_id: values.client_id || undefined,
            property_id: values.property_id || undefined,
        };

        await onSubmit(eventData);
        toast.success("Evento creado correctamente");
        onClose();
    } catch (error) {
        toast.error("Error al crear el evento", {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="space-y-4 py-4">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input 
                {...form.register("title")} 
                placeholder="Ej: Visita Calle Mayor" 
            />
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
                            id={`type-${type}`}
                            {...form.register("type")}
                            className="text-primary focus:ring-primary"
                        />
                        <label htmlFor={`type-${type}`} className="text-sm cursor-pointer capitalize">
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
                <Select {...form.register("client_id")}>
                  <option value="">Seleccionar...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Propiedad</label>
                <Select {...form.register("property_id")}>
                  <option value="">Seleccionar...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
