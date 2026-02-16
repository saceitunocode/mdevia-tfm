"use client";

import React, { useState } from "react";
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
import { cn } from "@/lib/utils";

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

const TYPE_STYLES = {
  [EventType.VISIT]: "border-blue-500 bg-blue-50 text-blue-700 shadow-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-500",
  [EventType.NOTE]: "border-amber-500 bg-amber-50 text-amber-700 shadow-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-500",
  [EventType.CAPTATION]: "border-purple-500 bg-purple-50 text-purple-700 shadow-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-500",
  [EventType.REMINDER]: "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-500",
};

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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-primary/5 border-b border-primary/10 p-4 md:p-5 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <CalendarIcon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <DialogTitle className="text-lg md:text-xl font-bold tracking-tight">Nuevo Evento</DialogTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Agenda de Oficina</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="flex flex-col flex-1 min-h-0">
          <div className="p-4 md:p-6 space-y-4 md:space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs md:text-sm font-semibold flex items-center gap-2 text-foreground">
                <Info className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> Título del Evento
              </label>
              <Input 
                  {...form.register("title")} 
                  placeholder="Ej: Visita Calle Mayor..." 
                  className="h-9 md:h-10 bg-background border-input focus:ring-primary shadow-sm text-sm"
              />
            </div>

            {/* Type Selector (Custom styled) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs md:text-sm font-semibold text-foreground">Tipo de Evento</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2">
                  {Object.values(EventType).map((type) => (
                    <label 
                      key={type}
                      className={cn(
                        "flex items-center justify-center gap-2 px-2 py-2 rounded-lg border text-[10px] md:text-xs font-bold cursor-pointer transition-all shadow-sm",
                        z.string().parse(form.watch("type")) === type
                          ? cn("border-2", TYPE_STYLES[type])
                          : "border-border bg-background text-muted-foreground font-medium hover:border-primary/30 hover:bg-primary/5"
                      )}
                    >
                      <input
                          type="radio"
                          value={type}
                          {...form.register("type")}
                          className="sr-only"
                      />
                      <span className="capitalize truncate">{type.toLowerCase()}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="bg-muted/30 p-3 md:p-4 rounded-lg md:rounded-xl border border-border/50">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Fecha</label>
                  <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input 
                          type="date" 
                          {...form.register("date")} 
                          className="pl-9 h-9 md:h-10 bg-background border-input shadow-sm focus:ring-primary w-full text-xs md:text-sm" 
                      />
                  </div>
              </div>
              
              <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Hora Inicio</label>
                  <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input 
                          type="time" 
                          {...form.register("startTime")} 
                          className="pl-9 h-9 md:h-10 bg-background border-input shadow-sm focus:ring-primary w-full text-xs md:text-sm" 
                      />
                  </div>
              </div>
            </div>
          </div>

          {/* Visit specific fields with Combobox */}
          {selectedType === EventType.VISIT && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-semibold flex items-center gap-2 text-foreground">
                  <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> Cliente
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
                      searchPlaceholder="Nombre..."
                      emptyMessage="No encontrado."
                    />
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Building2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> Propiedad
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
                      searchPlaceholder="Título..."
                      emptyMessage="No encontrada."
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs md:text-sm font-semibold text-foreground">Notas / Descripción</label>
            <Textarea 
                {...form.register("description")} 
                placeholder="Detalles adicionales..." 
                className="resize-none h-20 bg-background border-input focus:ring-primary shadow-sm text-sm"
            />
          </div>
        </div>

        <DialogFooter className="p-4 md:p-6 bg-muted/20 border-t border-border/50 gap-2 sm:gap-0 shrink-0">
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
              className="min-w-[130px] h-9 md:h-10 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold"
            >
              {isSubmitting ? "Guardando..." : "Guardar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
