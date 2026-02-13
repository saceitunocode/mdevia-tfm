"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Building2 } from "lucide-react";

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
      onClose();
    } catch (error) {
      console.error("Error registering visit:", error);
      form.setError("root", { message: "Error al registrar la visita" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Programar Visita</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Cliente
            </label>
            {initialClientId ? (
               <Input value="Cliente seleccionado" disabled className="bg-muted" />
            ) : (
              <Select {...form.register("client_id")}>
                <option value="">Seleccionar cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.full_name}</option>
                ))}
              </Select>
            )}
            {form.formState.errors.client_id && (
                <p className="text-xs text-destructive">{form.formState.errors.client_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Propiedad
            </label>
            {initialPropertyId ? (
                <Input value="Propiedad seleccionada" disabled className="bg-muted" />
            ) : (
              <Select {...form.register("property_id")}>
                <option value="">Seleccionar propiedad...</option>
                {properties.map(prop => (
                  <option key={prop.id} value={prop.id}>{prop.title}</option>
                ))}
              </Select>
            )}
            {form.formState.errors.property_id && (
                <p className="text-xs text-destructive">{form.formState.errors.property_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" /> Fecha
                </label>
                <Input 
                    type="date" 
                    {...form.register("date")} 
                />
                {form.formState.errors.date && (
                    <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>
                )}
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Hora
                </label>
                <Input 
                    type="time" 
                    {...form.register("time")} 
                />
                {form.formState.errors.time && (
                    <p className="text-xs text-destructive">{form.formState.errors.time.message}</p>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nota Inicial</label>
            <Textarea 
                {...form.register("note")} 
                placeholder="Ej: Interesado en ver el salón y la terraza..." 
                className="resize-none h-20"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Programando..." : "Programar Visita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
