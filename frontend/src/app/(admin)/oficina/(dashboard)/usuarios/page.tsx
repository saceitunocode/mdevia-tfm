"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, UserCog, Mail, Shield } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "AGENT";
  is_active: boolean;
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiRequest<User[]>("/users/");
        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground font-medium">Administra el equipo de agentes y sus permisos.</p>
        </div>
        <Link href="/oficina/usuarios/nuevo">
          <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Agente
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-muted h-20 border-none" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="border-2 border-dashed border-muted text-center py-12">
          <CardContent className="space-y-4 pt-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <UserCog size={24} />
            </div>
            <p className="font-semibold text-lg text-muted-foreground">No hay usuarios registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-all duration-300 overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-bold",
                      user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'
                    )}>
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{user.full_name}</span>
                        {user.role === "ADMIN" && (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none text-[10px] h-4">
                            ADMIN
                          </Badge>
                        )}
                        {!user.is_active && (
                          <Badge variant="destructive" className="text-[10px] h-4">INACTIVO</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {user.role === "ADMIN" ? "Administrador" : "Agente Inmobiliario"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/oficina/usuarios/${user.id}`}>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
