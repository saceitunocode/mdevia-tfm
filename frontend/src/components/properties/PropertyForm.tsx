"use client";

import React from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { ImageUpload } from "./ImageUpload";
import { PropertyGalleryManager } from "./PropertyGalleryManager";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/Combobox";
import { Controller } from "react-hook-form";
import { PropertyStatus, PropertyType, OperationType } from "@/types/property";

const propertySchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  address_line1: z.string().min(1, "La dirección es obligatoria"),
  address_line2: z.string().nullable().optional().transform(v => v ?? ""),
  city: z.string().min(1, "La ciudad es obligatoria"),
  postal_code: z.string().nullable().optional().transform(v => v ?? ""),
  sqm: z.coerce.number().positive("Los metros cuadrados deben ser positivos"),
  rooms: z.coerce.number().int().nonnegative(),
  baths: z.coerce.number().int().min(1, "Debe tener al menos 1 baño"),
  floor: z.coerce.number().int().nullable().optional(),
  has_elevator: z.boolean().default(false),
  price_amount: z.coerce.number().positive("El precio debe ser positivo"),
  owner_client_id: z.string().uuid("Debes seleccionar un propietario"),
  status: z.nativeEnum(PropertyStatus),
  property_type: z.nativeEnum(PropertyType),
  operation_type: z.nativeEnum(OperationType),
  is_published: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  public_description: z.string().nullable().optional().transform(v => v ?? ""),
  internal_notes: z.string().nullable().optional().transform(v => v ?? ""),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  propertyId?: string;
  clients: { id: string; full_name: string }[];
  onSubmit: (values: PropertyFormValues, images: File[]) => Promise<void>;
  isLoading?: boolean;
  initialValues?: Partial<PropertyFormValues>;
  initialImages?: { id: string; url: string; is_cover: boolean; position: number }[];
  isEditMode?: boolean;
}

export function PropertyForm({ propertyId, clients, onSubmit, isLoading, initialValues, initialImages = [], isEditMode = false }: PropertyFormProps) {
  const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
  const [currentImages, setCurrentImages] = React.useState(initialImages);
  const {
    register,
    handleSubmit,
    control,
  } = useForm<PropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      rooms: 1,
      baths: 1,
      sqm: 0,
      price_amount: 0,
      title: "",
      address_line1: "",
      address_line2: "",
      city: "",
      postal_code: "",
      owner_client_id: "",
      status: PropertyStatus.AVAILABLE,
      property_type: PropertyType.APARTMENT,
      operation_type: OperationType.SALE,
      is_published: true,
      is_featured: false,
      public_description: "",
      internal_notes: "",
      ...initialValues,
      // Ensure null values from API become empty strings
      ...(initialValues && {
        public_description: initialValues.public_description ?? "",
        internal_notes: initialValues.internal_notes ?? "",
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any, 
  });

  const onFormSubmit = (values: PropertyFormValues) => {
    onSubmit(values, selectedImages);
  };

  const onFormError = (errors: FieldErrors<PropertyFormValues>) => {
    const errorMessages = Object.values(errors)
      .map((err) => err?.message)
      .filter(Boolean)
      .join(". ");
    
    if (errorMessages) {
      toast.error("Error de validación", {
        description: errorMessages,
      });
    }
  };

  return (
    <Card className="w-full shadow-xl border-none">
      <CardHeader className="border-b border-border/50 bg-muted/5">
        <CardTitle className="text-2xl font-heading">
          {isEditMode ? "Editar Propiedad" : "Datos de la Propiedad"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onFormSubmit, onFormError)}>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property_type">Tipo de Inmueble</Label>
                    <Select id="property_type" className="h-11" {...register("property_type")}>
                      <option value="APARTMENT">Piso / Apartamento</option>
                      <option value="HOUSE">Casa / Chalet</option>
                      <option value="OFFICE">Oficina</option>
                      <option value="LAND">Terreno</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operation_type">Tipo de Operación</Label>
                    <Select id="operation_type" className="h-11" {...register("operation_type")}>
                      <option value="SALE">Venta</option>
                      <option value="RENT">Alquiler</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address_line1">Dirección (Línea 1)</Label>
                    <Input
                      id="address_line1"
                      placeholder="Calle, número, piso"
                      className="h-11"
                      {...register("address_line1")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_line2">Dirección (Línea 2)</Label>
                    <Input
                      id="address_line2"
                      placeholder="Bloque, puerta, etc. (opcional)"
                      className="h-11"
                      {...register("address_line2")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      placeholder="Ej: Andújar"
                      className="h-11"
                      {...register("city")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Código Postal</Label>
                    <Input
                      id="postal_code"
                      placeholder="Ej: 23740"
                      className="h-11"
                      {...register("postal_code")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sqm">Superficie (m²)</Label>
                    <Input
                      id="sqm"
                      type="number"
                      className="h-11"
                      {...register("sqm")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Habitaciones</Label>
                    <Input
                      id="rooms"
                      type="number"
                      className="h-11"
                      {...register("rooms")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baths">Baños</Label>
                    <Input
                      id="baths"
                      type="number"
                      className="h-11"
                      {...register("baths")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Planta</Label>
                    <Input
                      id="floor"
                      type="number"
                      placeholder="0 para bajo"
                      className="h-11"
                      {...register("floor")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_amount">Precio (€)</Label>
                    <Input
                      id="price_amount"
                      type="number"
                      className="h-11 font-bold text-xl text-primary"
                      {...register("price_amount")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado Comercial</Label>
                    <Select id="status" className="h-11" {...register("status")}>
                      <option value="AVAILABLE">Disponible</option>
                      <option value="SOLD">Vendido</option>
                      <option value="RENTED">Alquilado</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border p-4 rounded-lg bg-muted/20">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="has_elevator"
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            {...register("has_elevator")}
                        />
                        <Label htmlFor="has_elevator" className="cursor-pointer font-medium text-xs">
                            Ascensor
                        </Label>
                    </div>
                  <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_published"
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        {...register("is_published")}
                    />
                    <Label htmlFor="is_published" className="cursor-pointer font-medium text-xs">
                        Publicado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_featured"
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        {...register("is_featured")}
                    />
                    <Label htmlFor="is_featured" className="cursor-pointer font-medium text-xs">
                        Destacado
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_client_id">Propietario / Cliente</Label>
                  <Controller
                    name="owner_client_id"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        options={clients.map(c => ({ value: c.id, label: c.full_name }))}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Buscar propietario..."
                        searchPlaceholder="Escribe el nombre del cliente..."
                      />
                    )}
                  />
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
                
                {isEditMode && propertyId && currentImages.length > 0 && (
                  <div className="mb-8 p-4 bg-background/50 rounded-xl border border-border/50">
                    <PropertyGalleryManager 
                      propertyId={propertyId}
                      initialImages={currentImages.map(img => ({
                        id: img.id,
                        public_url: img.url,
                        is_cover: img.is_cover,
                        position: img.position
                      }))}
                      onImagesChange={(imgs) => setCurrentImages(imgs.map(i => ({ id: i.id, url: i.public_url, is_cover: i.is_cover, position: i.position })))}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  {isEditMode && (
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
                      Añadir Nuevas Fotos
                    </h4>
                  )}
                  <ImageUpload 
                    onImagesSelected={setSelectedImages} 
                    initialImages={isEditMode ? [] : initialImages.map(img => ({ id: img.id, url: img.url }))}
                  />
                </div>
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
