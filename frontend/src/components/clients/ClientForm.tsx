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
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Editar Cliente" : "Datos del Cliente"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                placeholder="Ej: Juan Pérez"
                {...register("full_name")}
                className={errors.full_name ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Cliente *</Label>
              <Select
                id="type"
                {...register("type")}
                className={errors.type ? "border-destructive" : ""}
              >
                <option value="BUYER">Comprador (Busca comprar)</option>
                <option value="TENANT">Inquilino (Busca alquilar)</option>
                <option value="OWNER">Propietario (Vende/Alquila)</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                placeholder="+34 600..."
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
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
              <Label htmlFor="is_active" className="cursor-pointer font-normal">Cliente Activo</Label>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
