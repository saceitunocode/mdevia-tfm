"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Briefcase } from "lucide-react";
import { operationService } from "@/services/operationService";
import { Operation } from "@/types/operation";
import { OperationList } from "@/components/operations/OperationList";

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
        <OperationList operations={operations} />
      )}
    </div>
  );
}
