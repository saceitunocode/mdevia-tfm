"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { PropertyForm, PropertyFormValues } from "@/components/properties/PropertyForm";
import { Loader2 } from "lucide-react";

interface Property {
  id: string;
  title: string;
  address_line1: string;
  city: string;
  sqm: number;
  rooms: number;
  price_amount: number;
  status: string;
  public_description?: string;
  internal_notes?: string;
  owner_client_id: string;
  images?: {
    id: string;
    public_url: string;
    is_cover: boolean;
  }[];
}

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [clients, setClients] = useState<{ id: string; full_name: string }[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [propertyData, clientsData] = await Promise.all([
          apiRequest<Property>(`/properties/${id}`),
          apiRequest<{ id: string; full_name: string }[]>("/clients/"),
        ]);
        setProperty(propertyData);
        setClients(clientsData);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Error al cargar la propiedad");
        router.push("/oficina/propiedades");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (values: PropertyFormValues, images: File[]) => {
    setIsLoading(true);
    try {
      // 1. Update Property
      await apiRequest(`/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      // 2. Upload NEW images if any
      if (images.length > 0) {
        for (const imageFile of images) {
          const formData = new FormData();
          formData.append("file", imageFile);
          // Only set as cover if there are no existing images? Or simple logic for now.
          // Let's assume appended images are not cover by default unless specific logic.
          // But the API requires is_cover.
          formData.append("is_cover", "false"); 
          
          await apiRequest(`/properties/${id}/images`, {
            method: "POST",
            body: formData,
          });
        }
      }

      alert("Propiedad actualizada correctamente");
      router.push(`/oficina/propiedades/${id}`);
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Error al actualizar la propiedad");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !property) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Editar Propiedad</h1>
        <p className="text-muted-foreground">Modifica los datos de la propiedad.</p>
      </div>
      
      <PropertyForm 
        clients={clients} 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        initialValues={{
            title: property.title,
            address_line1: property.address_line1,
            city: property.city,
            sqm: property.sqm,
            rooms: property.rooms,
            price_amount: property.price_amount,
            owner_client_id: property.owner_client_id,
            public_description: property.public_description,
            internal_notes: property.internal_notes || undefined,
        }}
        initialImages={property.images?.map(img => ({ id: img.id, url: img.public_url })) || []}
        isEditMode={true}
      />
    </div>
  );
}
