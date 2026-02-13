"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, Briefcase, ChevronRight, Activity, Calendar, User, Home } from "lucide-react";
import { operationService } from "@/services/operationService";
import { Operation, OperationStatus, OperationType } from "@/types/operation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminOperacionesPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const data = await operationService.getOperations();
        setOperations(data);
      } catch (error) {
        console.error("Error al cargar operaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperations();
  }, []);

  const getStatusBadge = (status: OperationStatus) => {
    switch (status) {
      case OperationStatus.INTEREST: 
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-none">Interés</Badge>;
      case OperationStatus.NEGOTIATION: 
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none">Negociación</Badge>;
      case OperationStatus.RESERVED: 
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-none">Reservado</Badge>;
      case OperationStatus.CLOSED: 
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-none">Cerrado</Badge>;
      case OperationStatus.CANCELLED: 
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-none">Cancelado</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: OperationType) => {
    return type === OperationType.SALE ? (
      <Badge className="bg-indigo-600 text-white border-none">Venta</Badge>
    ) : (
      <Badge className="bg-teal-600 text-white border-none">Alquiler</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Módulo de Operaciones</h1>
          <p className="text-muted-foreground font-medium">Seguimiento de ventas y alquileres en curso.</p>
        </div>
        <Link href="/oficina/operaciones/nueva">
          <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Nueva Operación
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-muted h-24 border-none" />
          ))}
        </div>
      ) : operations.length === 0 ? (
        <Card className="border-2 border-dashed border-muted text-center py-12">
          <CardContent className="space-y-4 pt-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Briefcase size={24} />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg">No hay operaciones activas</p>
              <p className="text-sm text-muted-foreground">Las operaciones permiten gestionar el cierre de ventas y alquileres.</p>
            </div>
            <Link href="/oficina/operaciones/nueva">
              <Button variant="outline" size="sm">Crear Operación</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {operations.map((op) => (
            <Link href={`/oficina/operaciones/${op.id}`} key={op.id}>
              <Card className="hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                    <div className="flex-1 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
                        <Activity size={20} />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-lg truncate max-w-[200px] md:max-w-xs">
                             Op: {op.type === OperationType.SALE ? "Venta" : "Alquiler"}
                          </span>
                          {getTypeBadge(op.type)}
                          {getStatusBadge(op.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(op.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-primary/80">
                            <Briefcase size={12} />
                            ID: {op.id.substring(0, 8)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 md:border-l pl-0 md:pl-6 border-muted mt-2 md:mt-0">
                       <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User size={14} className="shrink-0" />
                            <span className="truncate max-w-[120px]">Cliente {op.client_id.substring(0, 5)}...</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Home size={14} className="shrink-0" />
                            <span className="truncate max-w-[120px]">Propiedad {op.property_id.substring(0, 5)}...</span>
                          </div>
                       </div>
                       <ChevronRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
