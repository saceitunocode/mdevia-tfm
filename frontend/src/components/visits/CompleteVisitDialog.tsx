"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
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
      onClose();
    } catch (error) {
      console.error("Error completing visit:", error);
      form.setError("root", { message: "Error al cerrar la visita" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cerrar Visita</DialogTitle>
          <DialogDescription>
            Registra el resultado de la visita a <strong>{visit.property?.title || "la propiedad"}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          
          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Resultado</label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => form.setValue("status", "DONE")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        form.watch("status") === "DONE" 
                        ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20" 
                        : "border-muted bg-card hover:border-muted-foreground"
                    }`}
                >
                    <CheckCircle2 size={18} />
                    <span className="font-medium text-sm">Realizada</span>
                </button>
                <button
                    type="button"
                    onClick={() => form.setValue("status", "CANCELLED")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        form.watch("status") === "CANCELLED" 
                        ? "border-destructive bg-destructive/5 text-destructive" 
                        : "border-muted bg-card hover:border-muted-foreground"
                    }`}
                >
                    <XCircle size={18} />
                    <span className="font-medium text-sm">Cancelada</span>
                </button>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nota de resultado</label>
            <Textarea 
                {...form.register("note")} 
                placeholder={form.watch("status") === "DONE" 
                    ? "Ej: Le ha gustado mucho, quiere hacer una oferta..." 
                    : "Ej: El cliente no se presentó..."
                }
                className="resize-none h-32"
            />
            {form.formState.errors.note && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {form.formState.errors.note.message}
                </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
                type="submit" 
                disabled={isSubmitting}
                className={form.watch("status") === "DONE" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              {isSubmitting ? "Guardando..." : "Confirmar Resultado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
