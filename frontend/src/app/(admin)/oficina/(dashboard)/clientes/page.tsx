"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Users, Mail, Phone, Search, Filter, FileEdit, Eye } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  type: "BUYER" | "TENANT" | "OWNER";
  is_active: boolean;
}

export default function AdminClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await apiRequest("/clients/");
        if (Array.isArray(data)) {
            setClients(data);
        } else {
            console.error("API returned non-array:", data);
            setClients([]);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "BUYER": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">Comprador</span>;
      case "OWNER": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">Propietario</span>;
      case "TENANT": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">Inquilino</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">{type}</span>;
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || client.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra tu base de datos de compradores, vendedores e inquilinos.</p>
        </div>
        <Link href="/oficina/clientes/nuevo">
          <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="block w-full pl-10 pr-3 py-2 border border-input rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <select 
               className="pl-9 pr-8 py-2 border border-input rounded-lg bg-background text-sm focus:ring-primary focus:border-primary appearance-none shadow-sm cursor-pointer hover:bg-muted/50 transition-colors w-full"
               value={filterType}
               onChange={(e) => setFilterType(e.target.value)}
             >
               <option value="ALL">Todos los tipos</option>
               <option value="BUYER">Compradores</option>
               <option value="OWNER">Propietarios</option>
               <option value="TENANT">Inquilinos</option>
             </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
           <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2 py-1">
                       <div className="h-4 w-1/3 bg-muted rounded" />
                       <div className="h-3 w-1/4 bg-muted rounded" />
                    </div>
                 </div>
              ))}
           </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <Users className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No se encontraron clientes</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              {searchTerm || filterType !== "ALL" 
                ? "Intenta ajustar tus filtros de búsqueda." 
                : "Comienza añadiendo tu primer cliente."}
            </p>
            {(searchTerm || filterType !== "ALL") && (
               <Button 
                 variant="outline" 
                 className="mt-4"
                 onClick={() => { setSearchTerm(""); setFilterType("ALL"); }}
               >
                 Limpiar filtros
               </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-xs border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Contacto</th>
                  <th className="px-6 py-4 font-medium">Tipo</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 uppercase">
                             {client.full_name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-medium text-foreground">{client.full_name}</p>
                             <p className="text-xs text-muted-foreground">ID: {client.id.substring(0,6)}...</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                              <Mail className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[180px]">{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {getTypeBadge(client.type)}
                    </td>
                    <td className="px-6 py-4">
                       <span className={cn(
                          "inline-flex items-center w-2 h-2 rounded-full mr-2",
                          client.is_active ? "bg-emerald-500" : "bg-gray-300"
                       )} />
                       <span className="text-muted-foreground font-medium">
                          {client.is_active ? "Activo" : "Inactivo"}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Link href={`/oficina/clientes/${client.id}`}>
                             <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                                <Eye className="h-4 w-4" />
                             </Button>
                          </Link>
                          <Link href={`/oficina/clientes/${client.id}/editar`}>
                             <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-500">
                                <FileEdit className="h-4 w-4" />
                             </Button>
                          </Link>
                       </div>
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
