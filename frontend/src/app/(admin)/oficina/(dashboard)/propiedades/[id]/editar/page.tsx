"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { PropertyForm, PropertyFormValues } from "@/components/properties/PropertyForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Property, PropertyStatus, PropertyType, OperationType } from "@/types/property";

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
        toast.error("Error al cargar la propiedad", {
          description: error instanceof Error ? error.message : "Error desconocido",
        });
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
          formData.append("is_cover", "false"); 
          
          await apiRequest(`/properties/${id}/images`, {
            method: "POST",
            body: formData,
          });
        }
      }

      toast.success("Propiedad actualizada correctamente");
      router.push(`/oficina/propiedades/${id}`);
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Error al actualizar la propiedad", {
        description: error instanceof Error ? error.message : "Error desconocido",
      });
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
    <div className="space-y-4 md:space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-heading font-bold">Editar Propiedad</h1>
          <p className="text-muted-foreground">Modifica los datos de la propiedad.</p>
        </div>
      </div>
      
      <PropertyForm 
        propertyId={property.id}
        clients={clients} 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        initialValues={{
            title: property.title,
            address_line1: property.address_line1,
            address_line2: property.address_line2 ?? "",
            city: property.city,
            postal_code: property.postal_code ?? "",
            sqm: property.sqm,
            rooms: property.rooms,
            baths: property.baths ?? 1,
            floor: property.floor,
            has_elevator: property.has_elevator ?? false,
            price_amount: property.price_amount,
            owner_client_id: property.owner_client_id,
            public_description: property.public_description ?? "",
            internal_notes: property.internal_notes ?? "",
            status: property.status as PropertyStatus,
            property_type: property.property_type as PropertyType,
            operation_type: property.operation_type as OperationType,
            is_published: property.is_published,
            is_featured: property.is_featured,
        }}
        initialImages={property.images?.map(img => ({ 
          id: img.id, 
          url: img.public_url,
          is_cover: img.is_cover,
          position: img.position
        })) || []}
        isEditMode={true}
      />
    </div>
  );
}
