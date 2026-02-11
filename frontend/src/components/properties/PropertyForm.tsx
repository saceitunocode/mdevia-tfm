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
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function PropertyForm({ clients, onSubmit, isLoading }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertySchema as any),
    defaultValues: {
      rooms: 1,
      sqm: 0,
      price_amount: 0,
      title: "",
      address_line1: "",
      city: "",
      owner_client_id: "",
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nueva Propiedad</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título Publicitario</Label>
            <Input
              id="title"
              placeholder="Ej: Piso luminoso en el centro"
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
                {...register("address_line1")}
              />
              {errors.address_line1 && <p className="text-sm text-destructive">{errors.address_line1.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="Ej: Madrid"
                {...register("city")}
              />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sqm">Metros Cuadrados (m²)</Label>
              <Input
                id="sqm"
                type="number"
                {...register("sqm")}
              />
              {errors.sqm && <p className="text-sm text-destructive">{errors.sqm.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Habitaciones</Label>
              <Input
                id="rooms"
                type="number"
                {...register("rooms")}
              />
              {errors.rooms && <p className="text-sm text-destructive">{errors.rooms.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_amount">Precio (€)</Label>
              <Input
                id="price_amount"
                type="number"
                {...register("price_amount")}
              />
              {errors.price_amount && <p className="text-sm text-destructive">{errors.price_amount.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_client_id">Propietario</Label>
            <Select id="owner_client_id" {...register("owner_client_id")}>
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
              placeholder="Descripción que verán los clientes..."
              rows={4}
              {...register("public_description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internal_notes">Notas Internas</Label>
            <Textarea
              id="internal_notes"
              placeholder="Notas solo para el equipo..."
              rows={2}
              {...register("internal_notes")}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>Guardar Propiedad</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
