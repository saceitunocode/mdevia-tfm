"use client";

import React from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const clientSchema = z.object({
  full_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.union([z.literal(""), z.string().email("Email inválido")]).optional(),
  phone: z.string()
    .min(5, "El teléfono es obligatorio")
    .regex(/^[\d\s\+\-\(\)]*$/, "El teléfono solo puede contener números y símbolos (+, -, espacio)"),
  type: z.enum(["BUYER", "TENANT", "OWNER"], {
    message: "Selecciona un tipo de cliente"
  }),
  is_active: z.boolean().default(true),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  initialValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export function ClientForm({ initialValues, onSubmit, isLoading, isEditMode = false }: ClientFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClientFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(clientSchema) as any,
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      type: "BUYER",
      is_active: true,
      ...initialValues,
    },
  });

  const onError = (formErrors: FieldErrors<ClientFormValues>) => {
    const errorMessages = Object.values(formErrors)
      .map((error) => error?.message)
      .filter((msg): msg is string => typeof msg === "string")
      .join("\n");
    
    toast.error("Por favor revisa el formulario", {
      description: errorMessages || "Hay campos inválidos",
    });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any, onError)}>
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-4 border-b md:border-none bg-muted/10 md:bg-transparent">
          <CardTitle className="text-lg md:text-2xl">{isEditMode ? "Editar Cliente" : "Datos del Cliente"}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="full_name" className="text-xs md:text-sm font-bold md:font-medium">Nombre Completo *</Label>
              <Input
                id="full_name"
                placeholder="Ej: Juan Pérez"
                {...register("full_name")}
                className={cn("bg-background/50", errors.full_name ? "border-destructive" : "")}
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="type" className="text-xs md:text-sm font-bold md:font-medium">Tipo de Cliente *</Label>
              <Select
                id="type"
                {...register("type")}
                className={cn("bg-background/50", errors.type ? "border-destructive" : "")}
              >
                <option value="BUYER">Comprador</option>
                <option value="TENANT">Inquilino</option>
                <option value="OWNER">Propietario</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="email" className="text-xs md:text-sm font-bold md:font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register("email")}
                className={cn("bg-background/50", errors.email ? "border-destructive" : "")}
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="phone" className="text-xs md:text-sm font-bold md:font-medium">Teléfono *</Label>
              <Input
                id="phone"
                placeholder="+34 600..."
                {...register("phone")}
                className={cn("bg-background/50", errors.phone ? "border-destructive" : "")}
              />
            </div>
          </div>

          {isEditMode && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              />
              <Label htmlFor="is_active" className="cursor-pointer text-xs md:text-sm font-normal">Cliente Activo</Label>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex flex-col md:flex-row gap-3 md:gap-3 border-t p-4 md:p-6 bg-muted/20">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:flex-1 shadow-lg hover:shadow-primary/20 transition-all font-bold h-11 md:h-10 order-1 md:order-2"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => router.back()}
            className="w-full md:flex-1 h-11 md:h-10 order-2 md:order-1"
          >
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
