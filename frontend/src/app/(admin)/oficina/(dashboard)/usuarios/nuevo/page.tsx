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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/oficina/usuarios">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-heading font-bold">Alta de Nuevo Agente</h1>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 text-primary mb-2">
            <UserPlus className="h-6 w-6" />
            <CardTitle>Credenciales de Acceso</CardTitle>
          </div>
          <CardDescription>
            Los agentes creados tendrán permisos estándar para gestionar clientes y propiedades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo</Label>
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

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
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

            <div className="pt-6 flex gap-3">
              <Button 
                type="submit" 
                className="flex-1 shadow-lg hover:shadow-primary/20 transition-all font-bold"
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
              <Link href="/oficina/usuarios" className="flex-1">
                <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
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
