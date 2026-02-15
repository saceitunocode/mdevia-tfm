"use client";

import React, { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/Dialog";
import { Visit, VisitUpdate, VisitStatus } from "@/types/visit";

const completeSchema = z.object({
  status: z.enum(["DONE", "CANCELLED"]),
  note: z.string().min(1, "Escribe una nota sobre el resultado de la visita"),
});

type CompleteFormValues = z.infer<typeof completeSchema>;

interface CompleteVisitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: VisitUpdate) => Promise<void>;
  visit: Visit | null;
}

export function CompleteVisitDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  visit 
}: CompleteVisitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompleteFormValues>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      status: "DONE",
      note: "",
    },
  });

  const handleSubmit = async (values: CompleteFormValues) => {
    if (!visit) return;
    setIsSubmitting(true);
    try {
      await onSubmit(visit.id, {
        status: values.status as VisitStatus,
        note: values.note
      });
      form.reset();
      toast.success("Visita cerrada correctamente");
      onClose();
    } catch (error) {
      toast.error("Error al cerrar la visita", {
        description: error instanceof Error ? error.message : "Error inesperado",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<CompleteFormValues>) => {
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

  if (!visit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-primary/5 border-b border-primary/10 p-6">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">Finalizar Visita</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Cierre de Actividad</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="p-6 space-y-6">
          
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-sm text-center">
             Registra el resultado de la visita a: <br/>
             <span className="font-bold text-primary uppercase text-xs tracking-tight">{visit.property?.title || "Propiedad sin título"}</span>
          </div>

          {/* Status Selection */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              ¿Cuál fue el resultado final?
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => form.setValue("status", "DONE")}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 group ${
                        form.watch("status") === "DONE" 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md ring-4 ring-emerald-500/10 scale-[1.02]" 
                        : "border-muted bg-card hover:border-emerald-200 hover:bg-emerald-50/30 hover:text-emerald-600 grayscale hover:grayscale-0"
                    }`}
                >
                    <div className={`p-3 rounded-xl transition-colors ${form.watch("status") === "DONE" ? "bg-emerald-500 text-white" : "bg-muted group-hover:bg-emerald-100"}`}>
                        <CheckCircle2 size={28} />
                    </div>
                    <span className="font-bold text-sm tracking-tight uppercase">Éxito / Realizada</span>
                </button>
                <button
                    type="button"
                    onClick={() => form.setValue("status", "CANCELLED")}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 group ${
                        form.watch("status") === "CANCELLED" 
                        ? "border-destructive bg-destructive/5 text-destructive shadow-md ring-4 ring-destructive/10 scale-[1.02]" 
                        : "border-muted bg-card hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive grayscale hover:grayscale-0"
                    }`}
                >
                    <div className={`p-3 rounded-xl transition-colors ${form.watch("status") === "CANCELLED" ? "bg-destructive text-white" : "bg-muted group-hover:bg-destructive/10"}`}>
                        <XCircle size={28} />
                    </div>
                    <span className="font-bold text-sm tracking-tight uppercase">Cancelada</span>
                </button>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Notas e impresiones del cliente</label>
            <Textarea 
                {...form.register("note")} 
                placeholder={form.watch("status") === "DONE" 
                    ? "Escribe aquí el feedback del cliente..." 
                    : "Motivo de la cancelación..."
                }
                className="resize-none h-32 bg-background border-input focus:ring-primary shadow-sm rounded-xl p-4 text-sm"
            />
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="rounded-xl font-medium"
            >
              Cerrar sin guardar
            </Button>
            <Button 
                type="submit" 
                disabled={isSubmitting}
                className={`min-w-[180px] h-11 px-8 shadow-xl transition-all font-bold rounded-xl ${
                    form.watch("status") === "DONE" 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20" 
                    : "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-destructive/20"
                }`}
            >
              {isSubmitting ? "Cerrando visita..." : "Finalizar Visita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
