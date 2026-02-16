"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { MapPin, Plus, Filter, Calendar, Building2, Check } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { RegisterVisitDialog } from "@/components/visits/RegisterVisitDialog";
import { CompleteVisitDialog } from "@/components/visits/CompleteVisitDialog";
import { Visit, VisitCreate, VisitUpdate } from "@/types/visit";
import { visitService } from "@/services/visitService";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getStatusConfig } from "@/constants/status";
import { cn } from "@/lib/utils";

export default function VisitasPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  
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

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = 
      visit.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.agent?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || visit.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig('visit', status);
    const Icon = config.icon;
    return (
      <span className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.bg,
        config.color,
        config.border
      )}>
        <Icon className="h-3 w-3" /> {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Gestión de Visitas</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">Control global de todas las citas y visitas a propiedades.</p>
        </div>
        <Button 
          onClick={() => setIsVisitDialogOpen(true)} 
          className="w-full md:w-auto font-bold h-10 md:h-11 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Visita
        </Button>
      </div>

      <DashboardToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar por cliente, propiedad o agente..."
      >
        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select 
            className="pl-9 pr-8 py-2 border border-input rounded-lg bg-background text-xs md:text-sm focus:ring-primary focus:border-primary appearance-none shadow-sm cursor-pointer hover:bg-muted/50 transition-colors w-full sm:w-48 h-9 md:h-10"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="DONE">Realizada</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>
      </DashboardToolbar>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-muted rounded-xl h-24 w-full" />
          ))}
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="text-center py-12 md:py-16 px-4 bg-card rounded-xl border border-dashed border-border shadow-sm">
          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
            <Calendar className="h-6 w-6 md:h-8 md:w-8 opacity-50" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-foreground">No hay visitas programadas</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-sm mx-auto mb-6">
            Gestiona tus citas y visitas desde aquí.
          </p>
          <Button onClick={() => setIsVisitDialogOpen(true)} variant="outline" size="sm" className="h-9">
            Agendar Visita
          </Button>
        </div>
      ) : (
        <>
          {/* Vista Móvil (Tarjetas compactas) */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredVisits.map((visit) => {
              return (
                <Card key={visit.id} className="overflow-hidden hover:border-primary/50 transition-colors shadow-sm active:scale-[0.98] duration-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                          <Calendar size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs">
                            {format(new Date(visit.scheduled_at), "d 'de' MMMM", { locale: es })}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {format(new Date(visit.scheduled_at), "HH:mm 'hs'", { locale: es })}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(visit.status)}
                    </div>

                    <div className="space-y-2 mb-4 pt-1">
                      <div className="flex items-start gap-2">
                        <Building2 size={14} className="text-primary shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate leading-tight">{visit.property?.title || "Propiedad sin título"}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {visit.property?.city && `${visit.property.city}, `}{visit.property?.address_line1 || "Dirección no disponible"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary shrink-0 border border-primary/20">
                          {(visit.client?.full_name || "C").charAt(0).toUpperCase()}
                        </div>
                        <p className="text-xs font-medium truncate">{visit.client?.full_name || "Cliente desconocido"}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <p className="text-[10px] text-muted-foreground truncate italic max-w-[100px]">
                        Agente: {visit.agent?.full_name || "No asignado"}
                      </p>
                      <div className="flex gap-2">
                        {visit.status === 'PENDING' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-2.5 text-[10px] gap-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100"
                            onClick={() => handleOpenComplete(visit)}
                          >
                            <Check size={12} /> Realizada
                          </Button>
                        )}
                        <Link href={`/oficina/agenda?visitId=${visit.id}`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-[10px] gap-1">
                            <Calendar size={12} /> Ver agenda
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Vista Desktop (Tabla) */}
          <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
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
                              <p className="text-xs text-muted-foreground truncate flex items-center gap-1" title={`${visit.property?.city ? `${visit.property.city}, ` : ''}${visit.property?.address_line1}`}>
                                <MapPin className="h-3 w-3" /> {visit.property?.city && `${visit.property.city}, `}{visit.property?.address_line1 || "Dirección desconocida"}
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
                            <Link href={`/oficina/agenda?visitId=${visit.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full">
                                  <Calendar className="h-4 w-4" />
                              </Button>
                            </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
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
