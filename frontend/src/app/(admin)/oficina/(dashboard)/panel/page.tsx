"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Home, Users, Calendar, Briefcase, ArrowUpRight, 
  Clock, MapPin, TrendingUp, Eye, Building2
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DashboardStats {
  total_properties: number;
  total_clients: number;
  pending_visits: number;
  active_operations: number;
  available_properties: number;
  sold_properties: number;
  rented_properties: number;
}

interface UpcomingVisit {
  id: string;
  client_name: string;
  property_title: string;
  scheduled_at: string;
  status: string;
}

interface RecentProperty {
  id: string;
  title: string;
  city: string;
  price_amount: number | null;
  status: string;
  created_at: string;
}

interface RecentOperation {
  id: string;
  type: string;
  status: string;
  client_name: string;
  property_title: string;
  created_at: string;
}

interface DashboardData {
  stats: DashboardStats;
  upcoming_visits: UpcomingVisit[];
  recent_properties: RecentProperty[];
  recent_operations: RecentOperation[];
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  SOLD: "Vendido",
  RENTED: "Alquilado",
  INTEREST: "Interés",
  NEGOTIATION: "Negociación",
  RESERVED: "Reservado",
  CLOSED: "Cerrado",
  CANCELLED: "Cancelado",
  PENDING: "Pendiente",
  DONE: "Realizada",
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  SOLD: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  RENTED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  INTEREST: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  NEGOTIATION: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  RESERVED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  CLOSED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

function StatCard({ name, value, icon: Icon, accent, subtitle }: {
  name: string;
  value: number;
  icon: React.ElementType;
  accent: string;
  subtitle?: string;
}) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-card overflow-hidden relative group">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-5">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{name}</CardTitle>
        <div className={`p-2 rounded-lg ${accent}/10`}>
          <Icon className={`h-5 w-5 ${accent.replace("bg-", "text-")}`} />
        </div>
      </CardHeader>
      <CardContent className="pl-5">
        <div className="text-3xl font-bold font-heading">{value}</div>
        {subtitle && (
          <p className="text-xs flex items-center mt-2 text-muted-foreground font-medium">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-none shadow-md bg-white dark:bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-9 w-9 bg-muted animate-pulse rounded-lg" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
          <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await apiRequest<DashboardData>("/dashboard/");
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la actividad inmobiliaria.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : data ? (
          <>
            <StatCard
              name="Propiedades"
              value={data.stats.total_properties}
              icon={Home}
              accent="bg-primary"
              subtitle={`${data.stats.available_properties} disponibles`}
            />
            <StatCard
              name="Clientes"
              value={data.stats.total_clients}
              icon={Users}
              accent="bg-blue-500"
              subtitle="Cartera activa"
            />
            <StatCard
              name="Visitas Pendientes"
              value={data.stats.pending_visits}
              icon={Calendar}
              accent="bg-amber-500"
              subtitle="Próximos 7 días"
            />
            <StatCard
              name="Operaciones Activas"
              value={data.stats.active_operations}
              icon={Briefcase}
              accent="bg-emerald-500"
              subtitle="En curso"
            />
          </>
        ) : null}
      </div>

      {/* Property Status Overview */}
      {data && data.stats.total_properties > 0 && (
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estado del Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.stats.available_properties}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Disponibles</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.stats.sold_properties}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Vendidas</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{data.stats.rented_properties}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Alquiladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Visits */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Próximas Visitas
            </CardTitle>
            <Link 
              href="/oficina/visitas" 
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SkeletonList />
            ) : data && data.upcoming_visits.length > 0 ? (
              <div className="space-y-3">
                {data.upcoming_visits.map((visit) => (
                  <Link
                    key={visit.id}
                    href={`/oficina/visitas`}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors duration-200 group"
                  >
                    <div className="shrink-0 h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {visit.client_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3 w-3" />
                        {visit.property_title}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-foreground">
                        {format(new Date(visit.scheduled_at), "d MMM", { locale: es })}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(visit.scheduled_at), "HH:mm")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-muted rounded-xl bg-muted/5">
                <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No hay visitas pendientes esta semana.</p>
                <Link href="/oficina/agenda" className="text-xs text-primary hover:underline mt-2 inline-block">
                  Ir a la Agenda →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Últimas Propiedades
            </CardTitle>
            <Link 
              href="/oficina/propiedades" 
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SkeletonList />
            ) : data && data.recent_properties.length > 0 ? (
              <div className="space-y-3">
                {data.recent_properties.map((prop) => (
                  <Link
                    key={prop.id}
                    href={`/oficina/propiedades/${prop.id}`}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors duration-200 group"
                  >
                    <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {prop.title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {prop.city}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      {prop.price_amount && (
                        <p className="text-xs font-bold text-primary">
                          {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(prop.price_amount)}
                        </p>
                      )}
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[prop.status] || "bg-muted text-foreground"}`}>
                        {STATUS_LABELS[prop.status] || prop.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-muted rounded-xl bg-muted/5">
                <Home className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No hay propiedades registradas.</p>
                <Link href="/oficina/propiedades/nueva" className="text-xs text-primary hover:underline mt-2 inline-block">
                  Añadir Propiedad →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Operations */}
      {data && data.recent_operations.length > 0 && (
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-500" />
              Últimas Operaciones
            </CardTitle>
            <Link 
              href="/oficina/operaciones" 
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Propiedad</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="py-2 px-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_operations.map((op) => (
                    <tr 
                      key={op.id} 
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/oficina/operaciones/${op.id}`}
                    >
                      <td className="py-3 px-3">
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-muted/50">
                          {op.type === "SALE" ? "Venta" : "Alquiler"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium">{op.client_name}</td>
                      <td className="py-3 px-3 text-muted-foreground truncate max-w-[200px]">{op.property_title}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[op.status] || "bg-muted text-foreground"}`}>
                          {STATUS_LABELS[op.status] || op.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-xs text-muted-foreground">
                        {format(new Date(op.created_at), "d MMM yyyy", { locale: es })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Nueva Propiedad", href: "/oficina/propiedades/nueva", icon: Home, color: "text-primary" },
          { label: "Nuevo Cliente", href: "/oficina/clientes/nuevo", icon: Users, color: "text-blue-500" },
          { label: "Agenda", href: "/oficina/agenda", icon: Calendar, color: "text-amber-500" },
          { label: "Operaciones", href: "/oficina/operaciones", icon: Briefcase, color: "text-emerald-500" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:scale-[1.02] bg-white dark:bg-card">
              <CardContent className="flex items-center gap-3 py-4 px-4">
                <action.icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
