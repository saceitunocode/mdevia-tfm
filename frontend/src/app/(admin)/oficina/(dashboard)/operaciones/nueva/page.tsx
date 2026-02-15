"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { 
  ArrowLeft, 
  Briefcase, 
  User, 
  Home, 
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { operationService } from "@/services/operationService";
import { OperationType, OperationStatus } from "@/types/operation";
import { Combobox } from "@/components/ui/Combobox";

interface Client {
  id: string;
  full_name: string;
}

interface Property {
  id: string;
  title: string;
  city: string;
  status: string;
}

export default function NuevaOperacionPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [clientId, setClientId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [type, setType] = useState<OperationType>(OperationType.SALE);
  const [note, setNote] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsData, propertiesData] = await Promise.all([
          apiRequest<Client[]>("/clients/"),
          apiRequest<Property[]>("/properties/")
        ]);
        setClients(clientsData || []);
        setProperties(propertiesData?.filter(p => p.status === "AVAILABLE") || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar datos", {
          description: error instanceof Error ? error.message : "Error desconocido",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!clientId || !propertyId) {
      toast.error("Por favor, selecciona un cliente y una propiedad");
      return;
    }

    setIsSaving(true);
    try {
      const newOp = await operationService.createOperation({
        client_id: clientId,
        property_id: propertyId,
        type: type,
        status: OperationStatus.INTEREST,
        note: note
      });
      toast.success("Operación creada correctamente");
      router.push(`/oficina/operaciones/${newOp.id}`);
    } catch (error) {
      // console.error("Error al crear operación:", error);
      toast.error("Error al crear la operación", {
        description: error instanceof Error ? error.message : "Error inesperado",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Cargando datos del sistema...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-heading font-bold">Nueva Operación</h1>
          <p className="text-muted-foreground">Inicia el proceso de venta o alquiler para un cliente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Selection Column */}
        <div className="flex flex-col gap-6">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <User size={18} className="text-primary" />
                Seleccionar Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <Combobox
                options={clients.map(c => ({ value: c.id, label: c.full_name }))}
                value={clientId}
                onValueChange={setClientId}
                placeholder="Seleccionar cliente..."
                searchPlaceholder="Buscar por nombre..."
                emptyMessage="No se encontraron clientes."
              />
              <p className="text-xs text-muted-foreground">
                El cliente debe estar registrado previamente en la base de datos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Home size={18} className="text-primary" />
                Seleccionar Propiedad
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <Combobox
                options={properties.map(p => ({ value: p.id, label: `${p.title} (${p.city})` }))}
                value={propertyId}
                onValueChange={setPropertyId}
                placeholder="Seleccionar propiedad..."
                searchPlaceholder="Buscar por título o ciudad..."
                emptyMessage="No se encontraron propiedades disponibles."
              />
              <p className="text-xs text-muted-foreground">
                Solo se muestran propiedades con estado &quot;Disponible&quot;.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Column */}
        <div className="flex flex-col gap-6 h-full">
          <Card className="border-primary/10 shadow-sm flex-1 flex flex-col">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                Detalles de Operación
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Operación</label>
                <div className="flex gap-2">
                   <Button 
                     variant={type === OperationType.SALE ? "default" : "outline"}
                     onClick={() => setType(OperationType.SALE)}
                     className="flex-1"
                   >
                     Venta
                   </Button>
                   <Button 
                     variant={type === OperationType.RENT ? "default" : "outline"}
                     onClick={() => setType(OperationType.RENT)}
                     className="flex-1"
                   >
                     Alquiler
                   </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nota Inicial</label>
                <Input 
                  placeholder="Ej: Cliente vio anuncio en Idealista..." 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="pt-4 mt-auto">
                <Button 
                  className="w-full flex items-center justify-center gap-2 h-12 text-lg shadow-lg"
                  disabled={isSaving || !clientId || !propertyId}
                  onClick={handleSave}
                >
                  {isSaving ? "Creando..." : (
                    <>
                      <CheckCircle2 size={20} />
                      Crear Operación
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {clientId && propertyId && (
            <Card className="bg-primary/5 border-none">
              <CardContent className="pt-6">
                 <div className="text-sm space-y-2">
                    <p className="font-bold text-primary flex items-center gap-2">
                       <CheckCircle2 size={16} /> Resumen:
                    </p>
                    <p className="text-muted-foreground italic">
                       Se abrirá una nueva ficha de <strong>{type === OperationType.SALE ? "venta" : "alquiler"}</strong> para 
                       <strong> {clients.find(c => c.id === clientId)?.full_name}</strong> sobre el inmueble 
                       <strong> {properties.find(p => p.id === propertyId)?.title}</strong>.
                    </p>
                 </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
