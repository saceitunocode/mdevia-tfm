"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, Calendar, Briefcase, 
  ArrowUpRight, MapPin, 
  MoreHorizontal, Building2, TrendingUp
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getStatusConfig } from "@/constants/status";

// --- Types ---
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
  address?: string; // Optional if not in API response yet
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


// --- Components ---

function Sparkline({ color }: { color: string }) {
  // Simple sparkline path mimicking the design's "random" look
  // We can vary this if we had history data, but fixed for now as visual element
  const path = "M0 30 C 20 30, 20 10, 40 20 C 60 30, 60 5, 80 15 L 100 10";
  
  return (
    <svg className="w-24 h-10 sparkline" viewBox="0 0 100 40" preserveAspectRatio="none">
      <path 
        d={path} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        className={color}
      />
    </svg>
  );
}

function KpiCard({ title, value, icon: Icon, trend, trendLabel, colorClass, iconBgClass, sparklineColor }: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: string;
  trendLabel?: string;
  colorClass: string;
  iconBgClass: string;
  sparklineColor: string;
}) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mt-1 max-w-[120px] truncate" title={String(value)}>{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg transition-colors", iconBgClass)}>
          <Icon className={cn("w-6 h-6", colorClass)} />
        </div>
      </div>
      <div className="flex items-end justify-between">
         {trend && (
           <div className={cn("flex items-center text-sm font-medium px-2 py-0.5 rounded", "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400")}>
             <TrendingUp className="w-4 h-4 mr-1" />
             {trend}
           </div>
         )}
         {!trend && trendLabel && (
           <span className="text-xs text-muted-foreground">{trendLabel}</span>
         )}
         <Sparkline color={sparklineColor} />
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, actionHref, actionLabel, filters }: { 
  title: string, 
  subtitle?: string,
  actionHref?: string, 
  actionLabel?: string,
  filters?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <div>
        <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {filters}
        {actionHref && (
          <Link href={actionHref} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            {actionLabel || "View All"}
          </Link>
        )}
      </div>
    </div>
  );
}

function SkeletonKpi() {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          <div className="h-8 w-12 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
      </div>
      <div className="h-8 w-full bg-muted/50 animate-pulse rounded mt-2" />
    </div>
  );
}

// --- Main Page ---

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

  // Prepare chart data (simple normalization for visual bars)
  const chartData = data ? [
    { label: "Disp", value: data.stats.available_properties, colorClass: getStatusConfig('property', 'AVAILABLE').bg.replace('bg-', 'from-').replace(' dark:', ' dark:from-') + ' to-emerald-500', labelFull: "Disponibles" },
    { label: "Vend", value: data.stats.sold_properties, colorClass: getStatusConfig('property', 'SOLD').bg.replace('bg-', 'from-').replace(' dark:', ' dark:from-') + ' to-blue-500', labelFull: "Vendidas" },
    { label: "Alq", value: data.stats.rented_properties, colorClass: getStatusConfig('property', 'RENTED').bg.replace('bg-', 'from-').replace(' dark:', ' dark:from-') + ' to-amber-500', labelFull: "Alquiladas" },
    { label: "Ops", value: data.stats.active_operations, colorClass: "from-purple-100 to-purple-500 dark:from-purple-900/20", labelFull: "Operaciones" },
    { label: "Vis", value: data.stats.pending_visits, colorClass: "from-orange-100 to-orange-500 dark:from-orange-900/20", labelFull: "Visitas" },
    { label: "Clt", value: data.stats.total_clients > 20 ? 20 : data.stats.total_clients, colorClass: "from-cyan-100 to-cyan-500 dark:from-cyan-900/20", labelFull: "Clientes (Escala)" },
  ] : [];

  const maxChartValue = Math.max(...chartData.map(d => d.value), 10); // Avoid div by zero

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
      
      {/* 1. KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <SkeletonKpi />
            <SkeletonKpi />
            <SkeletonKpi />
            <SkeletonKpi />
          </>
        ) : data ? (
          <>
            <KpiCard
              title="Active Clients"
              value={data.stats.total_clients}
              icon={Users}
              colorClass="text-primary"
              iconBgClass="bg-blue-50 dark:bg-blue-900/20"
              trend="12%"
              sparklineColor="text-primary"
            />
            <KpiCard
              title="Properties"
              value={data.stats.total_properties}
              icon={Building2}
              colorClass="text-secondary" // green
              iconBgClass="bg-emerald-50 dark:bg-emerald-900/20"
              trend="4%"
              sparklineColor="text-emerald-500"
            />
            <KpiCard
              title="Active Ops"
              value={data.stats.active_operations}
              icon={Briefcase}
              colorClass="text-orange-500"
              iconBgClass="bg-orange-50 dark:bg-orange-900/20"
              trend="2%"
              sparklineColor="text-orange-500"
            />
            <KpiCard
              title="Visits (Week)"
              value={data.stats.pending_visits}
              icon={Calendar}
              colorClass="text-purple-500"
              iconBgClass="bg-purple-50 dark:bg-purple-900/20"
              trend="8%"
              sparklineColor="text-purple-500"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Middle Section - Left: Performance Chart (Visual Match) */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6">
           <SectionHeader 
             title="Activity Overview" 
             subtitle="Properties & Operations distribution"
             filters={
               <select className="bg-muted/50 border-none text-sm rounded-lg focus:ring-primary py-1 pl-3 pr-8 hidden sm:block">
                 <option>This Month</option>
                 <option>Last Month</option>
               </select>
             }
           />
           
           <div className="h-64 flex items-end justify-between space-x-4 px-2 mt-4">
              {isLoading ? (
                <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" />
              ) : chartData.map((item, idx) => {
                 const heightPercent = Math.max((item.value / maxChartValue) * 100, 10); // Min 10% height
                 return (
                   <div key={idx} className="flex flex-col items-center flex-1 group h-full justify-end">
                      <div className="w-full bg-muted/30 rounded-t-lg relative flex items-end h-full hover:bg-muted/50 transition-colors">
                         <div 
                           className={cn("w-full rounded-t-lg transition-all duration-1000 ease-out bg-linear-to-t shadow-sm group-hover:shadow-md", item.colorClass)} 
                           style={{ height: `${heightPercent}%` }}
                         ></div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-3 font-medium truncate w-full text-center" title={item.labelFull}>
                        {item.label}
                      </span>
                   </div>
                 );
              })}
           </div>
           
           {/* Legend */}
           <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                 <span className="text-xs text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                 <span className="text-xs text-muted-foreground">Sold</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                 <span className="text-xs text-muted-foreground">Ops</span>
              </div>
           </div>
        </div>

        {/* 3. Middle Section - Right: Recent Activity (Timeline Style) */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col h-[400px]">
           <SectionHeader title="Próximas Visitas" actionHref="/oficina/visitas" actionLabel="Ver Todo" />
           
           <div className="space-y-6 overflow-y-auto pr-2 flex-1 scrollbar-hide">
              {isLoading ? (
                 <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                          <div className="flex-1 space-y-2">
                             <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                             <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (!data || data.upcoming_visits.length === 0) ? (
                 <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No scheduled visits</p>
                 </div>
              ) : (
                data.upcoming_visits.map((visit, index) => (
                  <div key={visit.id} className="flex gap-4 group relative">
                     {/* Connector Line */}
                     {index !== data.upcoming_visits.length - 1 && (
                        <div className="absolute top-8 left-[15px] bottom-[-24px] w-[2px] bg-border z-0" />
                     )}
                     
                     <div className="relative z-10 shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                           <Calendar className="w-4 h-4" />
                        </div>
                     </div>
                     <div className="flex-1 pb-2">
                        <p className="text-sm font-semibold text-foreground">Visita Programada</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                           Con {visit.client_name} en {visit.property_title}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2">
                           <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium border border-border">
                              {format(new Date(visit.scheduled_at), "PPP p", { locale: es })}
                           </span>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>

      {/* 4. Bottom Section: Properties Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
           <h3 className="text-lg font-bold text-foreground">Últimas Propiedades</h3>
           <div className="flex gap-2">
              <button className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors">
                 <MoreHorizontal className="w-5 h-5" />
              </button>
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-xs">
                 <tr>
                    <th className="px-6 py-4">Propiedad</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Precio</th>
                    <th className="px-6 py-4">Agente</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                 {isLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center"><div className="w-full h-8 bg-muted animate-pulse rounded" /></td></tr>
                 ) : data?.recent_properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-muted/30 transition-colors">
                       <td className="px-6 py-4 max-w-[300px]">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                                <Building2 className="w-5 h-5" />
                             </div>
                             <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{prop.title}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                   <MapPin className="w-3 h-3" /> {prop.city}
                                </p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={cn(
                             "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                             getStatusConfig('property', prop.status).bg,
                             getStatusConfig('property', prop.status).color,
                             getStatusConfig('property', prop.status).border
                          )}>
                             {getStatusConfig('property', prop.status).label}
                          </span>
                       </td>
                       <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {prop.price_amount 
                             ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(prop.price_amount)
                             : "Consultar"}
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                                ME
                             </div>
                             <span className="text-sm text-muted-foreground">Yo</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <Link 
                             href={`/oficina/propiedades/${prop.id}`}
                             className="text-muted-foreground hover:text-primary transition-colors inline-block p-1"
                          >
                             <ArrowUpRight className="w-5 h-5" />
                          </Link>
                       </td>
                    </tr>
                 ))}
                 {!isLoading && (!data || data.recent_properties.length === 0) && (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No hay propiedades recientes</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

    </div>
  );
}
