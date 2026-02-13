"use client";

import React, { useState, useEffect } from "react";
import { PropertyForm, PropertyFormValues } from "@/components/properties/PropertyForm";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
        toast.error("Error al cargar clientes", {
          description: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
    fetchClients();
  }, []);

  const handleSubmit = async (values: PropertyFormValues, images: File[]) => {
    setIsLoading(true);
    try {
      // 1. Crear la propiedad
      const property = await apiRequest<{ id: string }>("/properties/", {
        method: "POST",
        body: JSON.stringify(values),
      });

      // 2. Subir imágenes si existen
      if (images.length > 0) {
        for (const [index, imageFile] of images.entries()) {
          const formData = new FormData();
          formData.append("file", imageFile);
          formData.append("is_cover", index === 0 ? "true" : "false");
          
          await apiRequest(`/properties/${property.id}/images`, {
            method: "POST",
            body: formData,
          });
        }
      }

      toast.success("Propiedad guardada correctamente con sus fotos");
      router.push("/oficina/propiedades");
    } catch (error) {
      // console.error("Error al guardar:", error);
      toast.error("Error al guardar la propiedad", {
        description: error instanceof Error ? error.message : undefined,
      });
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
