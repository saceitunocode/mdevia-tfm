"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, Users, Mail, Phone } from "lucide-react";
import { apiRequest } from "@/lib/api";

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
      case "BUYER": return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Comprador</Badge>;
      case "OWNER": return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Propietario</Badge>;
      case "TENANT": return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Inquilino</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Gestión de Clientes</h1>
          <p className="text-muted-foreground font-medium">Base de datos de compradores, vendedores e inquilinos.</p>
        </div>
        <Link href="/oficina/clientes/nuevo">
          <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="animate-pulse bg-muted h-48 border-none" />
          <Card className="animate-pulse bg-muted h-48 border-none" />
          <Card className="animate-pulse bg-muted h-48 border-none" />
        </div>
      ) : clients.length === 0 ? (
        <Card className="border-2 border-dashed border-muted text-center py-12">
          <CardContent className="space-y-4 pt-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Users size={24} />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg">No hay clientes registrados</p>
              <p className="text-sm text-muted-foreground">Empieza por añadir el primer cliente a tu cartera.</p>
            </div>
            <Link href="/oficina/clientes/nuevo">
              <Button variant="outline" size="sm">Añadir Cliente</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Link href={`/oficina/clientes/${client.id}`} key={client.id}>
              <Card className="h-full hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary overflow-hidden group">
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {client.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{client.full_name}</CardTitle>
                            <span className="text-xs text-muted-foreground block mt-1">
                                {client.is_active ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                    </div>
                    {getTypeBadge(client.type)}
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground pt-4">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
