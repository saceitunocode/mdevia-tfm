"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { ArrowLeft, Save, ShieldCheck, UserCog, Power, KeyRound, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "AGENT";
  is_active: boolean;
}

export default function DetalleUsuarioPage() {
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
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
          role: data.role,
          is_active: data.is_active,
        });
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        setMessage({ type: 'error', text: "No se pudo cargar la información del usuario" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await apiRequest(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      setMessage({ type: 'success', text: "Información de usuario actualizada correctamente" });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar la información";
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: "Las contraseñas no coinciden" });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: "La contraseña debe tener al menos 8 caracteres" });
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ password: passwordData.newPassword }),
      });
      setMessage({ type: 'success', text: "Contraseña actualizada correctamente" });
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar la contraseña";
      setMessage({ type: 'error', text: errorMsg });
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
      setMessage({ type: 'success', text: `Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente` });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al cambiar el estado";
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-6"><div className="h-10 w-48 bg-muted rounded" /><div className="h-64 bg-muted rounded" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/oficina/usuarios">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-heading font-bold">Configuración de Usuario</h1>
        </div>
        <Button 
          variant={formData.is_active ? "destructive" : "default"}
          onClick={toggleStatus}
          disabled={isSaving}
          className="gap-2"
        >
          <Power className="h-4 w-4" />
          {formData.is_active ? "Desactivar" : "Activar"} Acceso
        </Button>
      </div>

      {message && (
        <div className={`${message.type === 'success' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-destructive/10 text-destructive border-destructive/20'} border px-4 py-3 rounded-md flex items-center gap-3 text-sm animate-in fade-in`}>
          {message.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <UserCog className="h-5 w-5" />
                <CardTitle>Información General</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  <Input 
                    id="full_name" 
                    value={formData.full_name} 
                    onChange={(e) => setFormData(p => ({...p, full_name: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => setFormData(p => ({...p, email: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol en el Sistema</Label>
                  <Select 
                    id="role"
                    value={formData.role} 
                    onChange={(e) => setFormData(p => ({...p, role: e.target.value as "ADMIN" | "AGENT"}))}
                  >
                    <option value="AGENT">Agente Inmobiliario</option>
                    <option value="ADMIN">Administrador</option>
                  </Select>
                </div>
                <div className="pt-4">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-600">
                <KeyRound className="h-5 w-5" />
                <CardTitle>Seguridad / Cambio de Contraseña</CardTitle>
              </div>
              <CardDescription>
                Deja estos campos vacíos si no deseas cambiar la contraseña del usuario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(p => ({...p, newPassword: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(p => ({...p, confirmPassword: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit" variant="outline" disabled={isSaving}>
                    Actualizar Contraseña
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Estado del Usuario</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6 text-center">
              <div className={`h-20 w-20 rounded-full flex items-center justify-center font-bold text-3xl mb-4 ${formData.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                {formData.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-xl">{formData.full_name}</p>
                <div className="flex justify-center">
                  {formData.is_active ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">ACTIVO</Badge>
                  ) : (
                    <Badge variant="destructive">INACTIVO</Badge>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 pt-6 text-xs text-center text-muted-foreground">
              ID: {userId}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
