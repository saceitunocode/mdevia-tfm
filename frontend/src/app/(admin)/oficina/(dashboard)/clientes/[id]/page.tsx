"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Edit, Mail, Phone, User, Calendar, StickyNote, Send } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface ClientNote {
  id: string;
  text: string;
  author_user_id: string;
  created_at: string;
}

interface ClientDetail {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  type: "BUYER" | "TENANT" | "OWNER";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  notes: ClientNote[];
}

export default function ClienteDetallePage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isSendingNote, setIsSendingNote] = useState(false);

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
    fetchClient();
  }, [fetchClient]);

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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "BUYER": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Comprador</Badge>;
      case "OWNER": return <Badge variant="secondary" className="bg-green-100 text-green-800">Propietario</Badge>;
      case "TENANT": return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Inquilino</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
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
        <p className="text-muted-foreground">Cliente no encontrado.</p>
        <Link href="/oficina/clientes">
          <Button variant="outline" className="mt-4">Volver al listado</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/oficina/clientes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-heading font-bold">{client.full_name}</h1>
              {getTypeBadge(client.type)}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {client.is_active ? "Cliente activo" : "Cliente inactivo"}
            </p>
          </div>
        </div>
        <Link href={`/oficina/clientes/${clientId}/editar`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
        </Link>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" /> Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {client.email && (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha de Alta</p>
                  <p className="font-medium">{new Date(client.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <StickyNote className="h-5 w-5" /> Notas de Seguimiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Note */}
          <div className="flex gap-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Escribe una nota sobre este cliente..."
              className="flex-1 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
            <Button
              onClick={handleAddNote}
              disabled={isSendingNote || !newNote.trim()}
              size="sm"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Notes List */}
          {client.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 italic">
              No hay notas todavía. Añade la primera nota de seguimiento.
            </p>
          ) : (
            <div className="space-y-3 pt-2">
              {client.notes.map((note) => (
                <div key={note.id} className="border-l-2 border-primary/30 pl-4 py-2">
                  <p className="text-sm">{note.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
