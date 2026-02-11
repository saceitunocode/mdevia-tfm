"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";

export default function AccesoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // OAuth2PasswordRequestForm espera application/x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append("username", email);
      body.append("password", password);

      const response = await fetch("http://localhost:8000/api/v1/login/access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al iniciar sesión");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      
      router.push("/oficina/panel");
    } catch (error) {
      console.error("Login error:", error);
      alert(error instanceof Error ? error.message : "Credenciales inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Lock size={24} />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-heading font-bold uppercase tracking-tight">Acceso Oficina</CardTitle>
            <p className="text-sm text-muted-foreground font-sans">Introduce tus credenciales para gestionar el sistema.</p>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none font-sans">Email</label>
              <Input 
                name="email"
                type="email" 
                placeholder="agente@frinmobiliarias.es" 
                required 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none font-sans">Contraseña</label>
              <Input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required 
                disabled={isLoading}
              />
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-input bg-background accent-primary cursor-pointer" 
                  />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-sans select-none">
                    Recordar sesión
                  </span>
                </label>
                <Link href="#" className="text-xs text-primary hover:underline font-sans">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full mt-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4 border-t border-border mt-4 pt-6">
          <p className="text-xs text-center text-muted-foreground font-sans uppercase tracking-widest">
            Solo personal autorizado de FR Inmobiliaria.
          </p>
          <Link href="/" className="text-xs text-primary text-center hover:underline font-sans">
            Volver al escaparate público
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
