"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Plus, Briefcase, ArrowRight, Building2, Filter } from "lucide-react";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import { operationService } from "@/services/operationService";
import { Operation, OperationStatus, OperationType } from "@/types/operation";
import { cn } from "@/lib/utils";

// Helper for status styles
const getStatusBadge = (status: OperationStatus) => {
  const styles = {
    [OperationStatus.INTEREST]: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 -border-blue-800",
    [OperationStatus.NEGOTIATION]: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    [OperationStatus.RESERVED]: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    [OperationStatus.CLOSED]: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    [OperationStatus.CANCELLED]: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };
  
  const labels = {
    [OperationStatus.INTEREST]: "Interés",
    [OperationStatus.NEGOTIATION]: "Negociación",
    [OperationStatus.RESERVED]: "Reservado",
    [OperationStatus.CLOSED]: "Cerrado",
    [OperationStatus.CANCELLED]: "Cancelado",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      styles[status] || "bg-gray-100 text-gray-800 border-gray-200"
    )}>
      {labels[status] || status}
    </span>
  );
};

export default function AdminOperacionesPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

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

  const filteredOperations = operations.filter(op => {
    const matchesSearch = 
      op.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      op.property?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.agent?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || op.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">Seguimiento de ventas y alquileres en curso.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Link href="/oficina/operaciones/nueva" className="w-full sm:w-auto">
             <Button className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
               <Plus className="mr-2 h-4 w-4" /> Nueva Operación
             </Button>
           </Link>
        </div>
      </div>



      <DashboardToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar por propiedad, cliente o agente..."
      >
        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select 
            className="pl-9 pr-8 py-2 border border-input rounded-lg bg-background text-sm focus:ring-primary focus:border-primary appearance-none shadow-sm cursor-pointer hover:bg-muted/50 transition-colors w-full sm:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Todos los estados</option>
            <option value={OperationStatus.INTEREST}>Interés</option>
            <option value={OperationStatus.NEGOTIATION}>Negociación</option>
            <option value={OperationStatus.RESERVED}>Reservado</option>
            <option value={OperationStatus.CLOSED}>Cerrado</option>
            <option value={OperationStatus.CANCELLED}>Cancelado</option>
          </select>
        </div>
      </DashboardToolbar>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden space-y-0">
        {isLoading ? (
          <div className="p-8 space-y-4">
             {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 animate-pulse">
                   <div className="h-10 w-10 rounded-lg bg-muted" />
                   <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-1/3 bg-muted rounded" />
                      <div className="h-3 w-1/4 bg-muted rounded" />
                   </div>
                </div>
             ))}
          </div>
        ) : operations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <Briefcase className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No hay operaciones activas</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              Gestiona el ciclo de vida de tus ventas y alquileres desde aquí.
            </p>
            <Link href="/oficina/operaciones/nueva">
              <Button variant="outline" className="mt-4">Crear Operación</Button>
            </Link>
          </div>
        ) : (
          /* List View (Table + Mobile Cards) */
          <>
            {/* Mobile Card View (Visible on small screens) */}
            <div className="md:hidden divide-y divide-border">
              {filteredOperations.map((op) => (
                <div key={op.id} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                       <Building2 className="h-4 w-4 text-primary" />
                       <span className="font-bold text-sm truncate max-w-[150px]">
                         {op.property?.title || "Propiedad sin título"}
                       </span>
                    </div>
                    {getStatusBadge(op.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Tipo</span>
                      <span className={cn(
                        "font-medium",
                         op.type === OperationType.SALE ? "text-blue-600" : "text-purple-600"
                      )}>
                        {op.type === OperationType.SALE ? "Venta" : "Alquiler"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Cliente</span>
                      <span className="truncate">{op.client?.full_name || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Fecha</span>
                      <span>{format(new Date(op.created_at), "d MMM yyyy", { locale: es })}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-[10px] text-muted-foreground italic">
                      {format(new Date(op.created_at), "d MMM yyyy", { locale: es })}
                    </span>
                    <Link href={`/oficina/operaciones/${op.id}`}>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1">
                        Ver Detalles <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-xs border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Propiedad</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Agente</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredOperations.map((op) => (
                    <tr key={op.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                             <Building2 className="h-5 w-5" />
                          </div>
                          <div className="overflow-hidden">
                             <p className="font-medium truncate max-w-[180px]" title={op.property?.title || op.property_id}>
                               {op.property?.title || "Propiedad sin título"}
                             </p>
                             <p className="text-xs text-muted-foreground truncate" title={op.property?.city}>
                               {op.property?.city || "Ubicación desconocida"}
                             </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border", 
                          op.type === OperationType.SALE 
                            ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30" 
                            : "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30"
                        )}>
                          {op.type === OperationType.SALE ? "Venta" : "Alquiler"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {(op.client?.full_name || "C").charAt(0).toUpperCase()}
                           </div>
                           <span className="font-medium truncate max-w-[120px]" title={op.client?.full_name}>
                              {op.client?.full_name || "Cliente desconocido"}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(op.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-400">
                              {(op.agent?.full_name || "A").charAt(0).toUpperCase()}
                           </div>
                           <span className="text-muted-foreground text-xs truncate max-w-[100px]">
                              {op.agent?.full_name || "Sin agente"}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                        {format(new Date(op.created_at), "d MMM yyyy", { locale: es })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/oficina/operaciones/${op.id}`}>
                           <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full">
                              <ArrowRight className="h-4 w-4" />
                           </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
