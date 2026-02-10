import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Home, Calendar, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Propiedades Activas", value: "24", icon: Home, trend: "+2% esta semana" },
    { name: "Nuevos Clientes", value: "12", icon: Users, trend: "+10% esta semana" },
    { name: "Visitas Pendientes", value: "8", icon: Calendar, trend: "-1 hoy" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido de nuevo al panel de gestión.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-md bg-white dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
              <CardTitle className="text-sm font-medium uppercase tracking-wider">{stat.name}</CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading">{stat.value}</div>
              <p className="text-xs flex items-center mt-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Próximas Visitas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg m-6">
            No hay visitas programadas para hoy.
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Novedades Propiedades</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg m-6">
            Todo actualizado.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
