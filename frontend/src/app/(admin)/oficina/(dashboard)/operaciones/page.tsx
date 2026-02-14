"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Plus, Briefcase, ArrowRight, User, Building2, MapPin, LayoutGrid, List as ListIcon } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

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
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">Seguimiento de ventas y alquileres en curso.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border mr-2">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-all duration-200",
                  viewMode === "grid" 
                    ? "bg-background shadow-sm text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Vista Cuadrícula"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-all duration-200",
                  viewMode === "list" 
                    ? "bg-background shadow-sm text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Vista Lista"
              >
                <ListIcon size={18} />
              </button>
           </div>
           <Link href="/oficina/operaciones/nueva">
             <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
               <Plus className="mr-2 h-4 w-4" /> Nueva Operación
             </Button>
           </Link>
        </div>
      </div>

      {/* Content */}
      <div className={cn("space-y-6", viewMode === "list" && "bg-card rounded-xl border border-border shadow-sm overflow-hidden")}>
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
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {operations.map((op) => (
              <div key={op.id} className="group bg-card hover:shadow-lg transition-all duration-300 rounded-xl border border-border overflow-hidden flex flex-col">
                {/* Card Header (Image/Icon placeholder) */}
                <div className="relative h-40 bg-muted/30 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                   <Building2 className="h-12 w-12 text-muted-foreground/30" />
                   
                   <div className="absolute top-3 right-3 z-20">
                      {getStatusBadge(op.status)}
                   </div>
                   <div className="absolute bottom-3 left-3 z-20 text-white">
                      <p className="font-bold text-lg truncate w-[250px]">{op.property?.title || "Propiedad sin título"}</p>
                      <p className="text-xs text-gray-200 flex items-center gap-1">
                         <MapPin className="h-3 w-3" /> {op.property?.city || "Ubicación desconocida"}
                      </p>
                   </div>
                </div>
                
                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col gap-4">
                   <div className="flex justify-between items-start">
                      <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border", 
                          op.type === OperationType.SALE 
                            ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30" 
                            : "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30"
                      )}>
                          {op.type === OperationType.SALE ? "Venta" : "Alquiler"}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {format(new Date(op.created_at), "d MMM yyyy", { locale: es })}
                      </span>
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                         <User className="h-4 w-4 text-muted-foreground" />
                         <span className="truncate">{op.client?.full_name || "Cliente desconocido"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <div className="h-4 w-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[8px] font-bold text-indigo-700 dark:text-indigo-400">
                            {(op.agent?.full_name || "A").charAt(0).toUpperCase()}
                         </div>
                         <span className="truncate">{op.agent?.full_name || "Sin agente"}</span>
                      </div>
                   </div>

                   <div className="mt-auto pt-4 border-t border-border flex justify-end">
                      <Link href={`/oficina/operaciones/${op.id}`} className="w-full">
                         <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground group-hover:border-primary/50 transition-colors">
                            Ver Detalles <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                         </Button>
                      </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View (Table) */
          <div className="overflow-x-auto">
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
                 {operations.map((op) => (
                   <tr key={op.id} className="hover:bg-muted/30 transition-colors group">
                     {/* ... (Existing table rows) ... */}
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
        )}
      </div>
    </div>
  );
}
