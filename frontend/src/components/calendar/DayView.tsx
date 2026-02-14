"use client";

import React from "react";
import { format, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarEvent, EventType } from "@/types/calendar";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  [EventType.VISIT]: "bg-blue-500/90 text-white border-blue-600",
  [EventType.NOTE]: "bg-yellow-500/90 text-white border-yellow-600",
  [EventType.CAPTATION]: "bg-indigo-500/90 text-white border-indigo-600",
  [EventType.REMINDER]: "bg-gray-500/90 text-white border-gray-600",
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  [EventType.VISIT]: "Visita",
  [EventType.NOTE]: "Nota",
  [EventType.CAPTATION]: "Captación",
  [EventType.REMINDER]: "Recordatorio",
};

// 30-minute slots: 0, 0.5, 1, 1.5, ... , 23, 23.5
const HALF_HOURS = Array.from({ length: 48 }, (_, i) => i * 0.5);

export function DayView({ currentDate, events, onTimeSlotClick, onEventClick }: DayViewProps) {
  const dayEvents = events.filter(event => isSameDay(new Date(event.starts_at), currentDate));
  const isTodayDate = isToday(currentDate);

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.starts_at);
    const end = new Date(event.ends_at);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const duration = Math.max(endMinutes - startMinutes, 30);

    return {
      top: `${(startMinutes / (24 * 60)) * 100}%`,
      height: `${(duration / (24 * 60)) * 100}%`,
    };
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-border/50 overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto relative scrollbar-hide">
        {/* Sticky Header */}
        <div className="grid grid-cols-[80px_1fr] border-b border-border/50 bg-muted/30 sticky top-0 z-30 shadow-sm backdrop-blur-sm">
           <div className="border-r border-border/50 bg-background/50" /> {/* Spacer */}
           <div className="flex items-center justify-center gap-3 py-4">
            <div
              className={cn(
                "text-3xl font-bold w-14 h-14 flex items-center justify-center rounded-full transition-colors",
                isTodayDate
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground"
              )}
            >
              {format(currentDate, "d")}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium capitalize">
                {format(currentDate, "EEEE", { locale: es })}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {format(currentDate, "MMMM yyyy", { locale: es })}
              </span>
            </div>
            {dayEvents.length > 0 && (
              <span className="ml-3 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                {dayEvents.length} evento{dayEvents.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Time Grid Body */}
        <div className="grid grid-cols-[80px_1fr] min-h-[1440px] relative">
          {/* Time Labels Column */}
          <div className="relative border-r border-border/50 bg-background/50">
            {HALF_HOURS.map((halfHour) => {
              const isFullHour = halfHour % 1 === 0;
              return (
                <div
                  key={halfHour}
                  className="absolute w-full pr-3 text-right"
                  style={{ top: `${(halfHour / 24) * 100}%` }}
                >
                  {isFullHour && (
                    <span className="text-xs text-muted-foreground font-medium -translate-y-1/2 block">
                      {String(halfHour).padStart(2, "0")}:00
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Main Column */}
          <div className={cn("relative", isTodayDate && "bg-primary/5")}>
            {/* Half-hour grid lines */}
            {HALF_HOURS.map((halfHour) => {
              const isFullHour = halfHour % 1 === 0;
              return (
                <div
                  key={halfHour}
                  className={cn(
                    "absolute w-full cursor-pointer hover:bg-muted/40 transition-colors",
                    isFullHour ? "border-t border-border/60" : "border-t border-border/20"
                  )}
                  style={{
                    top: `${(halfHour / 24) * 100}%`,
                    height: `${(0.5 / 24) * 100}%`,
                  }}
                  onClick={() => onTimeSlotClick(currentDate, halfHour)}
                />
              );
            })}

            {/* Current time indicator */}
            {isTodayDate && <CurrentTimeIndicator />}

            {/* Events */}
            {dayEvents.map((event) => {
              const pos = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  className={cn(
                    "absolute left-2 right-4 rounded-lg px-3 py-2 cursor-pointer border-l-4 shadow-md transition-all hover:scale-[1.01] hover:shadow-lg z-10 overflow-hidden",
                    EVENT_TYPE_COLORS[event.type]
                  )}
                  style={{ top: pos.top, height: pos.height, minHeight: "36px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-bold leading-tight truncate">
                        {event.title}
                      </div>
                      <div className="text-xs opacity-80 mt-0.5">
                        {format(new Date(event.starts_at), "HH:mm")} - {format(new Date(event.ends_at), "HH:mm")}
                      </div>
                    </div>
                    <span className="text-[9px] opacity-70 bg-white/20 px-1.5 py-0.5 rounded shrink-0">
                      {EVENT_TYPE_LABELS[event.type]}
                    </span>
                  </div>
                  {event.description && (
                    <div className="text-[10px] opacity-70 mt-1 truncate">
                      {event.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentTimeIndicator() {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const minutes = now.getHours() * 60 + now.getMinutes();
  const top = `${(minutes / (24 * 60)) * 100}%`;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top }}
    >
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-red-500 -ml-[6px] shadow-sm ring-2 ring-red-200" />
        <div className="flex-1 h-[2px] bg-red-500/80" />
      </div>
    </div>
  );
}
