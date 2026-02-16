"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, UserCog, Mail, Shield, Filter } from "lucide-react";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import { apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: "ADMIN" | "AGENT";
  is_active: boolean;
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

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

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra el equipo de agentes y sus permisos.</p>
        </div>
        <Link href="/oficina/usuarios/nuevo">
          <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Agente
          </Button>
        </Link>
      </div>



      <DashboardToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar por nombre o email..."
      >
        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select 
            className="pl-9 pr-8 py-2 border border-input rounded-lg bg-background text-sm focus:ring-primary focus:border-primary appearance-none shadow-sm cursor-pointer hover:bg-muted/50 transition-colors w-full sm:w-48"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="ALL">Todos los roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="AGENT">Agentes</option>
          </select>
        </div>
      </DashboardToolbar>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                 <div className="h-10 w-10 rounded-full bg-muted" />
                 <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/3 bg-muted rounded" />
                    <div className="h-3 w-1/4 bg-muted rounded" />
                 </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-4">
             <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
               <UserCog className="h-8 w-8 opacity-50" />
             </div>
             <h3 className="text-lg font-semibold text-foreground">No hay usuarios registrados</h3>
             <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
               Comienza agregando los miembros de tu equipo.
             </p>
             <Link href="/oficina/usuarios/nuevo">
               <Button variant="outline" className="mt-4">Nuevo Agente</Button>
             </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-xs border-b border-border">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Teléfono</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center font-bold shrink-0",
                          user.role === 'ADMIN' 
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
                            : "bg-primary/10 text-primary"
                        )}>
                          {(user.full_name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.full_name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-muted-foreground">{user.phone_number || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                          user.role === "ADMIN"
                             ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"
                             : "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"
                       )}>
                          <Shield className="h-3 w-3" />
                          {user.role === "ADMIN" ? "Administrador" : "Agente"}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                        user.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                          : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                      )}>
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/oficina/usuarios/${user.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                          Configurar
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
