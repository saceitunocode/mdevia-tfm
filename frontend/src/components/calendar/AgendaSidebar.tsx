"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";
import { CalendarEvent, EventType } from "@/types/calendar";
import { Visit } from "@/types/visit";
import { cn } from "@/lib/utils";

interface AgendaSidebarProps {
  todayEvents: CalendarEvent[];
  pendingVisits: Visit[];
  onEventClick: (event: CalendarEvent) => void;
  onVisitClick: (visit: Visit) => void;
}

export function AgendaSidebar({ todayEvents, pendingVisits, onEventClick, onVisitClick }: AgendaSidebarProps) {
  return (
    <aside className="hidden xl:flex flex-col w-80 border-l border-border/50 bg-card/30 overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Today's Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Tareas de Hoy</h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {todayEvents.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {todayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No hay tareas para hoy.</p>
            ) : (
              todayEvents.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="bg-card hover:bg-muted/50 p-3 rounded-xl shadow-sm border border-border/50 cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          event.type === EventType.VISIT ? "bg-blue-500" :
                          event.type === EventType.CAPTATION ? "bg-purple-500" :
                          event.type === EventType.NOTE ? "bg-amber-500" : "bg-gray-500"
                       )} />
                       <span className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                         {event.title}
                       </span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground shrink-0 bg-muted px-1.5 py-0.5 rounded">
                      {format(new Date(event.starts_at), "HH:mm")}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 pl-4">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2 pl-4">
                    {/* Priority Badge (Mocked based on type for now) */}
                    {event.type === EventType.VISIT && (
                       <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                         Importante
                       </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Requests Section */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Solicitudes Pendientes</h2>
             <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {pendingVisits.length}
            </span>
          </div>

          <div className="space-y-3">
            {pendingVisits.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">¡Todo al día!</p>
               </div>
            ) : (
              pendingVisits.map((visit) => (
                <div 
                  key={visit.id}
                  onClick={() => onVisitClick(visit)}
                  className="group bg-card hover:bg-muted/50 p-3 rounded-lg border border-border/50 transition-all hover:shadow-md cursor-pointer relative"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      {(visit.client?.full_name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {visit.client?.full_name || "Cliente"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Solicitud de visita
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pl-[52px]">
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{visit.property?.title || "Propiedad"}</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(visit.scheduled_at), "d MMM, HH:mm", { locale: es })}</span>
                     </div>
                  </div>
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
