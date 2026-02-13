"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapPin, Plus, Search, Filter } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { VisitList } from "@/components/visits/VisitList";
import { RegisterVisitDialog } from "@/components/visits/RegisterVisitDialog";
import { Visit, VisitCreate, VisitUpdate } from "@/types/visit";
import { visitService } from "@/services/visitService";
import { Input } from "@/components/ui/Input";

export default function VisitasPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredVisits = visits.filter(visit => 
    visit.client?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.property?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Gestión de Visitas</h1>
          <p className="text-muted-foreground font-medium">Control global de todas las citas y visitas a propiedades.</p>
        </div>
        <Button onClick={() => setIsVisitDialogOpen(true)} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" /> Nueva Visita
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por cliente o propiedad..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> 
            Lista Maestra de Visitas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <VisitList 
            visits={filteredVisits} 
            isLoading={isLoading} 
            onUpdate={handleUpdateVisit}
          />
        </CardContent>
      </Card>

      <RegisterVisitDialog
        isOpen={isVisitDialogOpen}
        onClose={() => setIsVisitDialogOpen(false)}
        onSubmit={handleRegisterVisit}
      />
    </div>
  );
}
