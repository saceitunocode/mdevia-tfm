"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ClientForm, type ClientFormValues } from "@/components/clients/ClientForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

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

      toast.success("Cliente creado correctamente");
      router.push("/oficina/clientes");
    } catch (error) {
      // console.error("Error al crear cliente:", error);
      toast.error("Error al crear el cliente", {
        description: error instanceof Error ? error.message : "Revisa los datos e inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-8 md:pb-12">
      <div className="flex items-center gap-3 md:gap-4">
        <Link href="/oficina/clientes">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full">
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Nuevo Cliente</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Registra un nuevo cliente en el sistema.</p>
        </div>
      </div>

      <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
