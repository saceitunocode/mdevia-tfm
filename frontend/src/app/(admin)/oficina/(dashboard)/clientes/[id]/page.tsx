"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Edit, Mail, Phone, User, Calendar, StickyNote, Send, Plus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { VisitList } from "@/components/visits/VisitList";
import { RegisterVisitDialog } from "@/components/visits/RegisterVisitDialog";
import { VisitCreate, VisitUpdate } from "@/types/visit";
import { visitService } from "@/services/visitService";
import { ClientDetail } from "@/types/client";
import { OperationStatus, OperationType } from "@/types/operation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Briefcase, Home, Activity, ChevronRight } from "lucide-react";
import { AgentCard } from "@/components/users/AgentCard";


export default function ClienteDetallePage() {
  const params = useParams();
  const clientId = params?.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isSendingNote, setIsSendingNote] = useState(false);
  
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);

  const fetchClient = useCallback(async () => {
    try {
      const data = await apiRequest<ClientDetail>(`/clients/${clientId}`);
      setClient(data);
    } catch (error) {
      console.error("Error al cargar cliente:", error);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId, fetchClient]);

  const handleRegisterVisit = async (data: VisitCreate) => {
    try {
        await visitService.createVisit(data);
        fetchClient();
    } catch (err) {
        console.error("Error al registrar visita:", err);
        throw err;
    }
  };

  const handleUpdateVisit = async (id: string, data: VisitUpdate) => {
    try {
        await visitService.updateVisit(id, data);
        fetchClient();
    } catch (err) {
        console.error("Error al actualizar visita:", err);
        throw err;
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSendingNote(true);
    try {
      await apiRequest(`/clients/${clientId}/notes`, {
        method: "POST",
        body: JSON.stringify({ text: newNote }),
      });
      setNewNote("");
      await fetchClient();
    } catch (error) {
      console.error("Error al añadir nota:", error);
    } finally {
      setIsSendingNote(false);
    }
  };

  const getOperationStatusBadge = (status: OperationStatus) => {
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

  if (isLoading) {
    return (
      <div className="w-full md:max-w-6xl md:mx-auto space-y-6 pb-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <Link href="/oficina/clientes">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <p className="text-muted-foreground mt-4">Cliente no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-6xl md:mx-auto space-y-4 md:space-y-6 pb-8 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/oficina/clientes">
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full shrink-0">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-3xl font-heading font-bold">{client.full_name}</h1>
              {client.type === "BUYER" && <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-[10px] md:text-xs">Comprador</Badge>}
              {client.type === "OWNER" && <Badge variant="secondary" className="bg-green-100 text-green-800 text-[10px] md:text-xs">Propietario</Badge>}
              {client.type === "TENANT" && <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-[10px] md:text-xs">Inquilino</Badge>}
            </div>
            <p className="text-muted-foreground text-[10px] md:text-sm mt-0.5 md:mt-1">
              {client.is_active ? "Cliente activo" : "Cliente inactivo"}
            </p>
          </div>
        </div>
        <Link href={`/oficina/clientes/${clientId}/editar`} className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 font-bold">
            <Edit className="mr-2 h-4 w-4" /> Editar Perfil
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Column: Info & Notes */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 md:space-y-6">
          {/* Info Card */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2 border-b md:border-none">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <User className="h-4 w-4 md:h-5 md:w-5" /> Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {client.email && (
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Email</p>
                    <p className="font-medium text-xs md:text-sm truncate">{client.email}</p>
                  </div>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Teléfono</p>
                    <p className="font-medium text-xs md:text-sm">{client.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Alta</p>
                  <p className="font-medium text-xs md:text-sm">{new Date(client.created_at).toLocaleDateString("es-ES")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notes Card */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2 border-b md:border-none">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <StickyNote className="h-4 w-4 md:h-5 md:w-5" /> Notas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Escribir nota..."
                  className="flex-1 min-h-[50px] md:min-h-[60px] rounded-md border border-input bg-background/50 px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none whitespace-normal"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={isSendingNote || !newNote.trim()}
                  size="icon"
                  className="self-end shrink-0 h-8 w-8"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1">
                {client.notes.length === 0 ? (
                  <p className="text-[10px] md:text-xs text-muted-foreground text-center py-4 italic">No hay notas registradas.</p>
                ) : (
                  client.notes.map((note) => (
                    <div key={note.id} className="border-l-2 border-primary/20 pl-3 py-1 bg-muted/20 rounded-r-lg">
                      <p className="text-xs md:text-sm">{note.text}</p>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground mt-1 font-medium">
                        {new Date(note.created_at).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4 md:space-y-6">
          {/* Responsible Agent Section */}
          <AgentCard 
            agent={client.responsible_agent} 
            title="Agente Responsable" 
            emptyMessage="No asignado."
          />
          
          {/* Properties Section (Optional) */}
          {client.type === "OWNER" && (
            <Card className="border-l-4 border-l-green-500 shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 bg-green-50/50">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Home className="h-4 w-4 md:h-5 md:w-5 text-green-600" /> Propiedades
                </CardTitle>
                <Badge variant="outline" className="text-[10px] h-5">{client.owned_properties.length}</Badge>
              </CardHeader>
              <CardContent className="p-0">
                {client.owned_properties.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-xs italic">
                    Sin propiedades registradas.
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {client.owned_properties.map((prop) => (
                      <Link href={`/oficina/propiedades/${prop.id}`} key={prop.id} className="block hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between p-3 md:p-4 group">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                                <Home size={18} className="md:w-5 md:h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs md:text-sm truncate group-hover:text-primary transition-colors">{prop.title}</p>
                              <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">{prop.city} • {prop.status}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Operations Section */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 bg-blue-50/50">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-blue-600" /> Operaciones
                </CardTitle>
                <Badge variant="outline" className="text-[10px] h-5">{client.operations.length}</Badge>
              </CardHeader>
              <CardContent className="p-0">
                {client.operations.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-xs italic">
                    Sin operaciones abiertas.
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {client.operations.map((op) => (
                      <Link href={`/oficina/operaciones/${op.id}`} key={op.id} className="block hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between p-3 md:p-4 group">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                <Activity size={18} className="md:w-5 md:h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs md:text-sm">Op: {op.type === OperationType.SALE ? "Venta" : "Alquiler"}</span>
                                {getOperationStatusBadge(op.status)}
                              </div>
                              <p className="text-[10px] md:text-xs text-muted-foreground italic line-clamp-1 mt-0.5">
                                {format(new Date(op.created_at), "d 'de' MMMM", { locale: es })}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
          </Card>

          {/* Visits Section */}
          <Card className="border-l-4 border-l-primary shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 bg-muted/5">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Visitas
                </CardTitle>
                <Button size="sm" variant="outline" className="h-7 md:h-8 gap-1 text-[10px] md:text-xs" onClick={() => setIsVisitDialogOpen(true)}>
                    <Plus className="h-3.5 w-3.5" /> Nuevo
                </Button>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <VisitList 
                    visits={client.visits} 
                    isLoading={false} 
                    onUpdate={handleUpdateVisit}
                />
            </CardContent>
          </Card>
        </div>
      </div>

      <RegisterVisitDialog
        isOpen={isVisitDialogOpen}
        onClose={() => setIsVisitDialogOpen(false)}
        onSubmit={handleRegisterVisit}
        initialClientId={client.id}
      />
    </div>
  );
}
