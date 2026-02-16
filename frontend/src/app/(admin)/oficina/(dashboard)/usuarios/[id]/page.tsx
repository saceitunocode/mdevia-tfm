"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { ArrowLeft, Save, UserCog, Power, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: "ADMIN" | "AGENT";
  is_active: boolean;
}

export default function DetalleUsuarioPage() {
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    role: "AGENT",
    is_active: true,
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest<User>(`/users/${userId}`);
        setFormData({
          email: data.email,
          full_name: data.full_name,
          phone_number: data.phone_number || "",
          role: data.role,
          is_active: data.is_active,
        });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        toast.error("Error al cargar la información del usuario", {
          description: error instanceof Error ? error.message : "Error desconocido",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (!formData.full_name.trim()) {
        toast.error("El nombre completo es obligatorio");
        setIsSaving(false);
        return;
    }

    try {
      await apiRequest(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      toast.success("Información de usuario actualizada correctamente");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar la información";
      toast.error("Error al actualizar usuario", {
        description: errorMsg
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ password: passwordData.newPassword }),
      });
      toast.success("Contraseña actualizada correctamente");
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar la contraseña";
      toast.error("Error al actualizar contraseña", {
        description: errorMsg
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async () => {
    setIsSaving(true);
    try {
      const newStatus = !formData.is_active;
      await apiRequest(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: newStatus }),
      });
      setFormData(prev => ({ ...prev, is_active: newStatus }));
      const action = newStatus ? 'activado' : 'desactivado';
      toast.success(`Usuario ${action} correctamente`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al cambiar el estado";
      toast.error("Error al cambiar estado", {
        description: errorMsg
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-6"><div className="h-10 w-48 bg-muted rounded" /><div className="h-64 bg-muted rounded" /></div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-8 md:pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/oficina/usuarios">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 md:h-10 md:w-10">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Configuración de Usuario</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="p-4 md:p-6 pb-2 md:pb-4 border-b md:border-none bg-muted/10 md:bg-transparent">
              <div className="flex items-center gap-2 text-primary">
                <UserCog className="h-5 w-5" />
                <CardTitle className="text-lg md:text-2xl">Información General</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleInfoSubmit} className="space-y-3 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="full_name" className="text-xs md:text-sm font-bold md:font-medium">Nombre Completo</Label>
                  <Input 
                    id="full_name" 
                    value={formData.full_name} 
                    onChange={(e) => setFormData(p => ({...p, full_name: e.target.value}))}
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="email" className="text-xs md:text-sm font-bold md:font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => setFormData(p => ({...p, email: e.target.value}))}
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="phone_number" className="text-xs md:text-sm font-bold md:font-medium">Teléfono</Label>
                  <Input 
                    id="phone_number" 
                    value={formData.phone_number} 
                    onChange={(e) => setFormData(p => ({...p, phone_number: e.target.value}))}
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="role" className="text-xs md:text-sm font-bold md:font-medium">Rol en el Sistema</Label>
                  <select 
                    id="role"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.role} 
                    onChange={(e) => setFormData(p => ({...p, role: e.target.value as "ADMIN" | "AGENT"}))}
                  >
                    <option value="AGENT">Agente Inmobiliario</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div className="pt-2 md:pt-4">
                  <Button type="submit" disabled={isSaving} className="w-full md:w-auto gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="p-4 md:p-6 pb-2 md:pb-4 border-b md:border-none bg-muted/10 md:bg-transparent">
              <div className="flex items-center gap-2 text-amber-600">
                <KeyRound className="h-5 w-5" />
                <CardTitle className="text-lg md:text-2xl">Seguridad</CardTitle>
              </div>
              <CardDescription className="text-xs md:text-sm">
                Deja estos campos vacíos si no deseas cambiar la contraseña.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="newPassword" className="text-xs md:text-sm font-bold md:font-medium">Nueva Contraseña</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(p => ({...p, newPassword: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs md:text-sm font-bold md:font-medium">Confirmar Contraseña</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(p => ({...p, confirmPassword: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="pt-2 md:pt-4">
                  <Button type="submit" variant="outline" disabled={isSaving} className="w-full md:w-auto">
                    Actualizar Contraseña
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6 h-full flex flex-col">
          <Card className="border-none shadow-lg h-full flex flex-col overflow-hidden">
            <CardHeader className="p-4 md:p-6 border-b md:border-none bg-muted/10 md:bg-transparent">
              <CardTitle className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Estado del Usuario</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col p-4 md:p-6 py-6 md:py-8 text-center flex-1 h-full">
              <div className="flex flex-col items-center pt-2">
                <div className={`h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl mb-4 shadow-inner ring-4 ring-offset-2 ${formData.role === 'ADMIN' ? 'bg-amber-100 text-amber-700 ring-amber-50' : 'bg-primary/10 text-primary ring-primary/5'}`}>
                  {formData.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-lg md:text-xl">{formData.full_name}</p>
                  <div className="flex justify-center flex-col gap-2">
                      <div className="text-sm text-muted-foreground">{formData.email}</div>
                    {formData.is_active ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none w-fit mx-auto">ACTIVO</Badge>
                    ) : (
                      <Badge variant="destructive" className="w-fit mx-auto">INACTIVO</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center w-full px-2 md:px-4 mt-6">
                <div className="w-full">
                  <Button 
                    variant="outline"
                    onClick={toggleStatus}
                    disabled={isSaving}
                    className={cn(
                      "w-full gap-2 rounded-xl py-5 md:py-6 font-bold transition-all duration-300 transform hover:scale-[1.01] md:hover:scale-[1.02] active:scale-[0.98]",
                      formData.is_active 
                        ? "bg-white text-destructive border-destructive/40 hover:bg-destructive/10 hover:border-destructive/60 hover:text-destructive" 
                        : "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30"
                    )}
                  >
                    <Power className="h-4 w-4" />
                    {formData.is_active ? "Desactivar" : "Activar"} Acceso
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-3 md:mt-4 font-medium uppercase tracking-widest leading-relaxed">
                    {formData.is_active 
                      ? "Restringir el acceso de forma inmediata" 
                      : "Permitir que el usuario vuelva a operar"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 p-4 md:pt-6 text-[10px] text-center text-muted-foreground">
              ID: {userId}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
