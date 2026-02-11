"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { ImageUpload } from "./ImageUpload";

const propertySchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  address_line1: z.string().min(1, "La dirección es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  sqm: z.coerce.number().positive("Los metros cuadrados deben ser positivos"),
  rooms: z.coerce.number().int().nonnegative(),
  price_amount: z.coerce.number().positive("El precio debe ser positivo"),
  owner_client_id: z.string().uuid("Debes seleccionar un propietario"),
  public_description: z.string().optional(),
  internal_notes: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  clients: { id: string; full_name: string }[];
  onSubmit: (values: PropertyFormValues, images: File[]) => Promise<void>;
  isLoading?: boolean;
  initialValues?: Partial<PropertyFormValues>;
  initialImages?: { id: string; url: string }[];
  isEditMode?: boolean;
}

export function PropertyForm({ clients, onSubmit, isLoading, initialValues, initialImages = [], isEditMode = false }: PropertyFormProps) {
  const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      rooms: 1,
      sqm: 0,
      price_amount: 0,
      title: "",
      address_line1: "",
      city: "",
      owner_client_id: "",
      ...initialValues,
    },
  });

  const onFormSubmit = (values: PropertyFormValues) => {
    onSubmit(values, selectedImages);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-xl border-none">
      <CardHeader className="border-b border-border/50 bg-muted/5">
        <CardTitle className="text-2xl font-heading">
          {isEditMode ? "Editar Propiedad" : "Datos de la Propiedad"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Columna Izquierda: Datos del Formulario */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título Publicitario</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Piso luminoso en el centro"
                    className="h-11"
                    {...register("title")}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address_line1">Dirección</Label>
                    <Input
                      id="address_line1"
                      placeholder="Calle, número, piso"
                      className="h-11"
                      {...register("address_line1")}
                    />
                    {errors.address_line1 && <p className="text-sm text-destructive">{errors.address_line1.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      placeholder="Ej: Madrid"
                      className="h-11"
                      {...register("city")}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sqm">Superficie (m²)</Label>
                    <Input
                      id="sqm"
                      type="number"
                      className="h-11"
                      {...register("sqm")}
                    />
                    {errors.sqm && <p className="text-sm text-destructive">{errors.sqm.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Habitaciones</Label>
                    <Input
                      id="rooms"
                      type="number"
                      className="h-11"
                      {...register("rooms")}
                    />
                    {errors.rooms && <p className="text-sm text-destructive">{errors.rooms.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_amount">Precio (€)</Label>
                    <Input
                      id="price_amount"
                      type="number"
                      className="h-11 font-bold text-primary"
                      {...register("price_amount")}
                    />
                    {errors.price_amount && <p className="text-sm text-destructive">{errors.price_amount.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_client_id">Propietario / Cliente</Label>
                  <Select id="owner_client_id" className="h-11" {...register("owner_client_id")}>
                    <option value="">Selecciona un cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.full_name}
                      </option>
                    ))}
                  </Select>
                  {errors.owner_client_id && <p className="text-sm text-destructive">{errors.owner_client_id.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="public_description">Descripción Pública</Label>
                  <Textarea
                    id="public_description"
                    placeholder="Describe los puntos fuertes de la propiedad..."
                    rows={5}
                    className="resize-none"
                    {...register("public_description")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internal_notes">Notas Internas (Privado)</Label>
                  <Textarea
                    id="internal_notes"
                    placeholder="Información relevante para los agentes..."
                    rows={2}
                    className="resize-none bg-muted/30"
                    {...register("internal_notes")}
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Imágenes */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-muted/30 rounded-xl p-6 border border-border/50 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    Galería de Fotos
                  </h3>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border border-border">
                    Mín. 1 foto recomendada
                  </span>
                </div>
                <ImageUpload 
                  onImagesSelected={setSelectedImages} 
                  initialImages={initialImages}
                />
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-primary italic">Tip:</strong> La primera imagen que subas será utilizada como portada en el listado público.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3 border-t border-border/50 p-8 bg-muted/5">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancelar y volver
          </Button>
          <Button 
            type="submit" 
            size="lg"
            className="px-8 shadow-lg shadow-primary/20"
            isLoading={isLoading}
          >
            {isEditMode ? "Guardar Cambios" : "Dar de Alta Propiedad"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
