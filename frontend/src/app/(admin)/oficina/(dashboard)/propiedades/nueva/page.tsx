"use client";

import React, { useState, useEffect } from "react";
import { PropertyForm, PropertyFormValues } from "@/components/properties/PropertyForm";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NuevaPropiedadPage() {
  const router = useRouter();
  const [clients, setClients] = useState<{ id: string; full_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await apiRequest<{ id: string; full_name: string }[]>("/clients/");
        setClients(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    }
    fetchClients();
  }, []);

  const handleSubmit = async (values: PropertyFormValues) => {
    setIsLoading(true);
    try {
      await apiRequest("/properties/", {
        method: "POST",
        body: JSON.stringify(values),
      });
      alert("Propiedad guardada correctamente");
      router.push("/oficina/propiedades");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(error instanceof Error ? error.message : "Error al guardar la propiedad");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Alta de Propiedad</h1>
        <p className="text-muted-foreground">Registra una nueva propiedad en el catálogo.</p>
      </div>
      
      <PropertyForm 
        clients={clients} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}
