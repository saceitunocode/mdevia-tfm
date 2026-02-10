import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, MapPin, BedDouble, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PropiedadesPage() {
  const dummyProperties = [
    { id: 1, title: "Piso Moderno Centro", price: "125.000€", location: "Andújar", beds: 3, baths: 2, size: "95m²", type: "Venta" },
    { id: 2, title: "Chalet con Piscina", price: "245.000€", location: "Córdoba", beds: 4, baths: 3, size: "210m²", type: "Venta" },
    { id: 3, title: "Apartamento Luminoso", price: "550€/mes", location: "Córdoba", beds: 1, baths: 1, size: "45m²", type: "Alquiler" },
  ];

  return (
    <div className="container mx-auto py-12 px-4 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-bold tracking-tight uppercase">Propiedades</h1>
          <p className="text-muted-foreground">Explora nuestro catálogo exclusivo en la provincia.</p>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Buscar..." 
              className="w-full pl-10 pr-4 h-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button>Filtrar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyProperties.map((p) => (
          <Card key={p.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50">
            <div className="h-48 bg-muted relative overflow-hidden">
               <div className="absolute top-4 left-4 z-10">
                 <Badge variant={p.type === "Alquiler" ? "secondary" : "default"}>{p.type}</Badge>
               </div>
               <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-muted-foreground italic text-sm">
                 Imagen de Propiedad
               </div>
            </div>
            <CardHeader>
              <div className="flex items-center text-primary text-xs font-bold uppercase tracking-widest mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                {p.location}
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-4">{p.price}</div>
              <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                <div className="flex flex-col items-center">
                  <BedDouble className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">{p.beds}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bath className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">{p.baths}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Square className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">{p.size}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Ver Detalles</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
