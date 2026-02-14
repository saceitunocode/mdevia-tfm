"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { MapPin, Plus, Search, Filter, Calendar, Building2, CheckCircle2, XCircle, Clock, Check, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { RegisterVisitDialog } from "@/components/visits/RegisterVisitDialog";
import { CompleteVisitDialog } from "@/components/visits/CompleteVisitDialog";
import { Visit, VisitCreate, VisitUpdate } from "@/types/visit";
import { visitService } from "@/services/visitService";
import { Input } from "@/components/ui/Input";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function VisitasPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for completing a visit
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const fetchVisits = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest<Visit[]>("/visits/");
      setVisits(data);
    } catch (error) {
      console.error("Error al cargar visitas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const handleRegisterVisit = async (data: VisitCreate) => {
    try {
      await visitService.createVisit(data);
      fetchVisits();
    } catch (err) {
      console.error("Error al registrar visita:", err);
      throw err;
    }
  };

  const handleUpdateVisit = async (id: string, data: VisitUpdate) => {
    try {
      await visitService.updateVisit(id, data);
      fetchVisits();
    } catch (err) {
      console.error("Error al actualizar visita:", err);
      throw err;
    }
  };

  const handleOpenComplete = (visit: Visit) => {
    setSelectedVisit(visit);
    setCompleteDialogOpen(true);
  };

  const filteredVisits = visits.filter(visit => 
    visit.client?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.agent?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DONE": 
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30">
            <CheckCircle2 className="h-3 w-3" /> Realizada
          </span>
        );
      case "CANCELLED": 
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
            <XCircle className="h-3 w-3" /> Cancelada
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
            <Clock className="h-3 w-3" /> Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Visitas</h1>
          <p className="text-sm text-muted-foreground mt-1">Control global de todas las citas y visitas a propiedades.</p>
        </div>
        <Button onClick={() => setIsVisitDialogOpen(true)} className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" /> Nueva Visita
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por cliente, propiedad o agente..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                 <div className="h-10 w-10 rounded-lg bg-muted" />
                 <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/3 bg-muted rounded" />
                    <div className="h-3 w-1/4 bg-muted rounded" />
                 </div>
              </div>
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <Calendar className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No hay visitas programadas</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              Gestiona tus citas y visitas desde aquí.
            </p>
            <Button onClick={() => setIsVisitDialogOpen(true)} variant="outline" className="mt-4">
              Agendar Visita
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-xs border-b border-border">
                <tr>
                  <th className="px-6 py-4">Propiedad</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Agente</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                            <Building2 className="h-5 w-5" />
                         </div>
                         <div className="overflow-hidden">
                            <p className="font-medium truncate max-w-[180px]" title={visit.property?.title || "Propiedad sin título"}>
                              {visit.property?.title || "Propiedad sin título"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1" title={visit.property?.address_line1}>
                              <MapPin className="h-3 w-3" /> {visit.property?.address_line1 || "Dirección desconocida"}
                            </p>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                             {(visit.client?.full_name || "C").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium truncate max-w-[120px]" title={visit.client?.full_name}>
                             {visit.client?.full_name || "Cliente desconocido"}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {format(new Date(visit.scheduled_at), "d MMM yyyy, HH:mm", { locale: es })}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs text-muted-foreground truncate max-w-[100px] block" title={visit.agent?.full_name}>
                          {visit.agent?.full_name || "Sin agente"}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       {getStatusBadge(visit.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {visit.status === 'PENDING' && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 text-xs gap-1 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 rounded-full"
                              onClick={() => handleOpenComplete(visit)}
                              title="Marcar como realizada"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full">
                              <ArrowRight className="h-4 w-4" />
                           </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RegisterVisitDialog
        isOpen={isVisitDialogOpen}
        onClose={() => setIsVisitDialogOpen(false)}
        onSubmit={handleRegisterVisit}
      />

      <CompleteVisitDialog
        isOpen={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        visit={selectedVisit}
        onSubmit={async (id, data) => {
          await handleUpdateVisit(id, data);
        }}
      />
    </div>
  );
}
