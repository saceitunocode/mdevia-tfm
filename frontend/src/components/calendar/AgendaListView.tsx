"use client";

import React from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarEvent, EventType } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { Clock, User, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface AgendaListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function AgendaListView({ events, onEventClick }: AgendaListViewProps) {
  // Filter events to show only those in the current view range (or just show all provided events)
  // The parent already filters events based on the view range, so we just sort and display them.
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Clock className="h-8 w-8 text-muted-foreground opacity-20" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No hay eventos programados</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          No tienes nada en tu agenda para este periodo. ¡Aprovecha para descansar o captar nuevos inmuebles!
        </p>
      </div>
    );
  }

  // Group events by day for a better list view
  const groupedEvents: { [key: string]: CalendarEvent[] } = {};
  sortedEvents.forEach(event => {
    const dayKey = format(new Date(event.starts_at), "yyyy-MM-dd");
    if (!groupedEvents[dayKey]) groupedEvents[dayKey] = [];
    groupedEvents[dayKey].push(event);
  });

  const getEventStyles = (type: string) => {
    switch (type) {
      case EventType.VISIT:
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10";
      case EventType.CAPTATION:
        return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10";
      case EventType.NOTE:
        return "border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10";
      case EventType.REMINDER:
        return "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10";
      default:
        return "border-l-primary bg-primary/5";
    }
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {Object.entries(groupedEvents).map(([dayKey, dayEvents]) => {
        const date = new Date(dayKey);
        const isToday = isSameDay(date, new Date());

        return (
          <div key={dayKey} className="space-y-3">
            <h4 className={cn(
              "text-sm font-bold flex items-center gap-2 sticky top-0 bg-background/80 backdrop-blur-md py-2 z-10",
              isToday ? "text-primary" : "text-muted-foreground"
            )}>
              <span className="uppercase tracking-wider">
                {format(date, "EEEE, d 'de' MMMM", { locale: es })}
              </span>
              {isToday && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">HOY</span>
              )}
            </h4>

            <div className="space-y-3">
              {dayEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className={cn(
                    "p-4 border-l-4 transition-all hover:shadow-md cursor-pointer group",
                    getEventStyles(event.type)
                  )}
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                          {format(new Date(event.starts_at), "HH:mm")}
                        </span>
                        <h5 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                          {event.title}
                        </h5>
                      </div>
                      
                      {event.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 pl-10">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-y-2 gap-x-4 pt-1 pl-10">
                        {event.property_id && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Building2 size={12} className="text-primary/70" />
                            <span>Propiedad: {event.id.substring(0, 6)}</span>
                          </div>
                        )}
                        {event.client_id && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <User size={12} className="text-primary/70" />
                            <span>Cliente: {event.id.substring(0, 6)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
