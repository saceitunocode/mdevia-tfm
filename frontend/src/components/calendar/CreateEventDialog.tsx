"use client";

import React, { useState, useEffect } from "react";
import { useForm, FieldErrors, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Building2, Info } from "lucide-react";
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
import { Combobox } from "@/components/ui/Combobox";
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
        const startDate = new Date(`${values.date}T${values.startTime}:00`);
        const startIso = startDate.toISOString();
        const endIso = new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();

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
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-primary/5 border-b border-primary/10 p-6">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">Nuevo Evento</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Agenda de Oficina</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Info className="h-4 w-4 text-primary" /> Título del Evento
              </label>
              <Input 
                  {...form.register("title")} 
                  placeholder="Ej: Visita Calle Mayor, Reunión de equipo..." 
                  className="h-11 bg-background border-input focus:ring-primary shadow-sm"
              />
            </div>

            {/* Type Selector (Custom styled) */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-foreground">Tipo de Evento</label>
              <div className="flex flex-wrap gap-2">
                  {Object.values(EventType).map((type) => (
                    <label 
                      key={type}
                      className={z.string().parse(form.watch("type")) === type 
                        ? "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-primary bg-primary/5 text-primary text-sm font-bold cursor-pointer transition-all"
                        : "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-border bg-background text-muted-foreground text-sm font-medium cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all"
                      }
                    >
                      <input
                          type="radio"
                          value={type}
                          {...form.register("type")}
                          className="sr-only"
                      />
                      <span className="capitalize">{type.toLowerCase()}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Fecha</label>
                  <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input 
                          type="date" 
                          {...form.register("date")} 
                          className="pl-9 h-11 bg-background border-input shadow-sm focus:ring-primary w-full" 
                      />
                  </div>
              </div>
              
              <div className="space-y-2 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Hora Inicio</label>
                  <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input 
                          type="time" 
                          {...form.register("startTime")} 
                          className="pl-9 h-11 bg-background border-input shadow-sm focus:ring-primary w-full" 
                      />
                  </div>
              </div>
            </div>
          </div>

          {/* Visit specific fields with Combobox */}
          {selectedType === EventType.VISIT && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-primary" /> Cliente
                </label>
                <Controller
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <Combobox
                      options={clients.map(c => ({ value: c.id, label: c.full_name }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Buscar cliente..."
                      searchPlaceholder="Escribe el nombre..."
                      emptyMessage="No se encontró el cliente."
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Building2 className="h-4 w-4 text-primary" /> Propiedad
                </label>
                <Controller
                  control={form.control}
                  name="property_id"
                  render={({ field }) => (
                    <Combobox
                      options={properties.map(p => ({ value: p.id, label: p.title }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Buscar propiedad..."
                      searchPlaceholder="Escribe el título..."
                      emptyMessage="No se encontró la propiedad."
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Notas / Descripción</label>
            <Textarea 
                {...form.register("description")} 
                placeholder="Detalles adicionales, instrucciones para el agente..." 
                className="resize-none h-24 bg-background border-input focus:ring-primary shadow-sm"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[140px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold"
            >
              {isSubmitting ? "Guardando..." : "Guardar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
