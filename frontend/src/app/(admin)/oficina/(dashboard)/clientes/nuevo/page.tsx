"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ClientForm, type ClientFormValues } from "@/components/clients/ClientForm";
import { apiRequest } from "@/lib/api";

export default function NuevoClientePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: ClientFormValues) => {
    setIsLoading(true);
    try {
      // Get current user to set responsible_agent_id
      const me = await apiRequest<{ id: string }>("/users/me");

      const payload = {
        ...values,
        responsible_agent_id: me.id,
      };

      await apiRequest("/clients/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push("/oficina/clientes");
    } catch (error) {
      console.error("Error al crear cliente:", error);
      alert("Error al crear el cliente. Revisa los datos e inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/oficina/clientes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold">Nuevo Cliente</h1>
          <p className="text-muted-foreground">Registra un nuevo cliente en el sistema.</p>
        </div>
      </div>

      <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
