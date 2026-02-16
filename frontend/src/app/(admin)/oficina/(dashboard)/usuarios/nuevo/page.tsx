"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";

const userSchema = z.object({
  full_name: z.string().min(1, "El nombre completo es obligatorio"),
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validación local con Zod
    const validation = userSchema.safeParse(formData);

    if (!validation.success) {
      const errorMessages = validation.error.flatten().fieldErrors;
      const errorList = Object.values(errorMessages).flat().join(". ");
      toast.error("Error de validación", {
        description: errorList,
      });
      setIsLoading(false);
      return;
    }

    try {
      await apiRequest("/users/", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          password: formData.password,
          is_active: true
        }),
      });
      toast.success("Usuario creado exitosamente");
      router.push("/oficina/usuarios");
      router.refresh();
    } catch (err: unknown) {
      // console.error("Error creating user:", err); // Removed to avoid console noise
      
      const errorMsg = err instanceof Error ? err.message : "Error al crear el agente";

      toast.error("Error al crear usuario", {
        description: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 md:gap-4">
        <Link href="/oficina/usuarios">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full">
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Alta de Nuevo Agente</h1>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-4 border-b md:border-none bg-muted/10 md:bg-transparent">
          <div className="flex items-center gap-2 md:gap-3 text-primary mb-1 md:mb-2">
            <UserPlus className="h-5 w-5 md:h-6 md:w-6" />
            <CardTitle className="text-lg md:text-2xl">Credenciales de Acceso</CardTitle>
          </div>
          <CardDescription className="text-xs md:text-sm">
            Los agentes creados tendrán permisos estándar para gestionar clientes y propiedades.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="full_name" className="text-xs md:text-sm font-bold md:font-medium">Nombre Completo</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Ej: Juan Pérez"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="email" className="text-xs md:text-sm font-bold md:font-medium">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan.perez@mdevia.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="phone_number" className="text-xs md:text-sm font-bold md:font-medium">Teléfono</Label>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder="+34 600 000 000"
                value={formData.phone_number}
                onChange={handleChange}
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-1 md:pt-2">
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="password" className="text-xs md:text-sm font-bold md:font-medium">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs md:text-sm font-bold md:font-medium">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="pt-4 md:pt-6 flex flex-col md:flex-row gap-3 md:gap-3">
              <Button 
                type="submit" 
                className="w-full md:flex-1 shadow-lg hover:shadow-primary/20 transition-all font-bold h-11 md:h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Registrar Agente"
                )}
              </Button>
              <Link href="/oficina/usuarios" className="w-full md:flex-1">
                <Button variant="outline" type="button" className="w-full h-11 md:h-10" disabled={isLoading}>
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
