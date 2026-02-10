import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function HomePage() {
  return (
    <main className="container mx-auto py-10 px-4 space-y-12 relative">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      {/* Header Section */}
      <section className="space-y-4 text-center">
        <h1 className="text-5xl font-heading text-primary uppercase tracking-tighter">FR Inmobiliaria</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
          Sistema de Diseño Corporativo. Evolución visual basada en la identidad de FR Inmobiliarias: 
          Confianza (Azul) y Crecimiento (Verde).
        </p>
      </section>

      {/* Typography Section */}
      <section className="space-y-6">
        <h2 className="text-3xl border-b pb-2 font-heading">Typography</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outfit (Headings)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-4xl">H1: El lujo de lo funcional</h1>
              <h2 className="text-3xl">H2: Gestión inmobiliaria inteligente</h2>
              <h3 className="text-2xl">H3: Escaparate y Backoffice</h3>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Inter (Body UI)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground font-sans">
              <p>
                Este es el cuerpo de texto principal. Diseñado para ser leído con facilidad
                en pantallas de alta densidad. El interlineado y el tracking están optimizados.
              </p>
              <p className="font-bold">Texto en negrita para énfasis.</p>
              <p className="italic">Texto en itálica para aclaraciones.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Components Section */}
      <section className="space-y-6">
        <h2 className="text-3xl border-b pb-2 font-heading">Components</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Buttons */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Buttons & States</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </CardContent>
            <CardFooter className="gap-2">
              <Badge variant="success">Active</Badge>
              <Badge variant="secondary">Draft</Badge>
              <Badge variant="destructive">Sold</Badge>
            </CardFooter>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Nombre de la propiedad..." />
              <Input type="email" placeholder="email@ejemplo.com" />
              <Button className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" /> Enviar Datos
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Colors Section */}
      <section className="space-y-6">
        <h2 className="text-3xl border-b pb-2 font-heading">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="space-y-2 text-center">
            <div className="h-20 w-full bg-primary rounded-lg shadow-inner" />
            <p className="text-xs font-medium uppercase tracking-wider">FR Blue</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="h-20 w-full bg-secondary rounded-lg shadow-inner" />
            <p className="text-xs font-medium uppercase tracking-wider">Neutral</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="h-20 w-full bg-accent rounded-lg shadow-inner border border-border" />
            <p className="text-xs font-medium uppercase tracking-wider">FR Green</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="h-20 w-full bg-muted rounded-lg shadow-inner border border-border" />
            <p className="text-xs font-medium uppercase tracking-wider">Muted</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="h-20 w-full bg-card rounded-lg shadow-inner border border-border" />
            <p className="text-xs font-medium uppercase tracking-wider">Card</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="h-20 w-full bg-foreground rounded-lg shadow-inner" />
            <p className="text-xs font-medium uppercase tracking-wider">Foreground</p>
          </div>
        </div>
      </section>
    </main>
  );
}
