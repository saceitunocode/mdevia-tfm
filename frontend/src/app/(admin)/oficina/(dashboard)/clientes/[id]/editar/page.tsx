"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ClientForm, type ClientFormValues } from "@/components/clients/ClientForm";
import { apiRequest } from "@/lib/api";

interface ClientData {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  type: "BUYER" | "TENANT" | "OWNER";
  is_active: boolean;
}

export default function EditarClientePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await apiRequest<ClientData>(`/clients/${clientId}`);
        setClient(data);
      } catch (error) {
        console.error("Error al cargar cliente:", error);
        toast.error("Error al cargar cliente", {
          description: error instanceof Error ? error.message : "Error desconocido",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleSubmit = async (values: ClientFormValues) => {
    setIsSaving(true);
    try {
      await apiRequest(`/clients/${clientId}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      toast.success("Cliente actualizado correctamente");
      router.push(`/oficina/clientes/${clientId}`);
    } catch (error) {
      // console.error("Error al actualizar cliente:", error);
      toast.error("Error al actualizar el cliente.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full md:max-w-6xl md:mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
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
    <div className="w-full md:max-w-6xl md:mx-auto space-y-4 md:space-y-6 pb-8 md:pb-12">
      <div className="flex items-center gap-3 md:gap-4">
        <Link href={`/oficina/clientes/${clientId}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full">
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Editar Cliente</h1>
          <p className="text-xs md:text-sm text-muted-foreground">{client.full_name}</p>
        </div>
      </div>

      <ClientForm
        initialValues={{
          full_name: client.full_name,
          email: client.email || "",
          phone: client.phone || "",
          type: client.type,
          is_active: client.is_active,
        }}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        isEditMode
      />
    </div>
  );
}
