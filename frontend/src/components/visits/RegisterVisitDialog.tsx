"use client";

import React, { useState, useEffect } from "react";
import { useForm, FieldErrors, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Building2 } from "lucide-react";
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
import { VisitCreate } from "@/types/visit";

const visitSchema = z.object({
  client_id: z.string().min(1, "El cliente es obligatorio"),
  property_id: z.string().min(1, "La propiedad es obligatoria"),
  date: z.string().min(1, "La fecha es obligatoria"),
  time: z.string().min(1, "La hora es obligatoria"),
  note: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitSchema>;

interface RegisterVisitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VisitCreate) => Promise<void>;
  initialClientId?: string;
  initialPropertyId?: string;
}

interface ClientListItem {
  id: string;
  full_name: string;
}

interface PropertyListItem {
  id: string;
  title: string;
}

export function RegisterVisitDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialClientId, 
  initialPropertyId 
}: RegisterVisitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      client_id: initialClientId || "",
      property_id: initialPropertyId || "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "10:00",
      note: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        client_id: initialClientId || "",
        property_id: initialPropertyId || "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "10:00",
        note: "",
      });
      
      const fetchData = async () => {
        try {
          if (!initialClientId) {
            const clientsData = await apiRequest<ClientListItem[]>("/clients/");
            setClients(clientsData.map(c => ({ id: c.id, full_name: c.full_name })));
          }
          if (!initialPropertyId) {
            const propsData = await apiRequest<PropertyListItem[]>("/properties/");
            setProperties(propsData.map(p => ({ id: p.id, title: p.title })));
          }
        } catch (err) {
          console.error("Error fetching data for visit dialog:", err);
        }
      };
      fetchData();
    }
  }, [isOpen, initialClientId, initialPropertyId, form]);

  const handleSubmit = async (values: VisitFormValues) => {
    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(`${values.date}T${values.time}:00`).toISOString();
      
      const visitData: VisitCreate = {
        client_id: values.client_id,
        property_id: values.property_id,
        scheduled_at: scheduledAt,
        status: "PENDING",
        note: values.note
      };

      await onSubmit(visitData);
      toast.success("Visita programada correctamente");
      onClose();
    } catch (error) {
      toast.error("Error al registrar la visita", {
        description: error instanceof Error ? error.message : "Error inesperado",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<VisitFormValues>) => {
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
                <DialogTitle className="text-xl font-bold tracking-tight">Programar Nueva Visita</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Gestión de Citas</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <User className="h-4 w-4 text-primary" /> Cliente
              </label>
              {initialClientId ? (
                 <div className="h-11 px-3 flex items-center bg-muted/30 border border-input rounded-md text-sm text-muted-foreground font-medium italic">
                    Referencia seleccionada
                 </div>
              ) : (
                <Controller
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <Combobox
                      options={clients.map(c => ({ value: c.id, label: c.full_name }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Buscar cliente..."
                      searchPlaceholder="Escribe el nombre del cliente..."
                      emptyMessage="No se encontró ningún cliente."
                    />
                  )}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Building2 className="h-4 w-4 text-primary" /> Propiedad
              </label>
              {initialPropertyId ? (
                  <div className="h-11 px-3 flex items-center bg-muted/30 border border-input rounded-md text-sm text-muted-foreground font-medium italic">
                    Inmueble seleccionado
                  </div>
              ) : (
                <Controller
                  control={form.control}
                  name="property_id"
                  render={({ field }) => (
                    <Combobox
                      options={properties.map(p => ({ value: p.id, label: p.title }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Buscar propiedad..."
                      searchPlaceholder="Escribe el título o dirección..."
                      emptyMessage="No se encontró ninguna propiedad."
                    />
                  )}
                />
              )}
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Fecha</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input 
                        type="date" 
                        {...form.register("date")} 
                        className="pl-9 h-11 bg-background border-input shadow-sm focus:ring-primary"
                    />
                  </div>
              </div>
              
              <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Hora</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input 
                        type="time" 
                        {...form.register("time")} 
                        className="pl-9 h-11 bg-background border-input shadow-sm focus:ring-primary"
                    />
                  </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Notas e instrucciones</label>
            <Textarea 
                {...form.register("note")} 
                placeholder="Escribe aquí cualquier detalle relevante para el agente..." 
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
              {isSubmitting ? "Programando..." : "Programar Visita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
