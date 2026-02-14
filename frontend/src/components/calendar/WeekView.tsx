"use client";

import React from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarEvent, EventType } from "@/types/calendar";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  [EventType.VISIT]: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800",
  [EventType.NOTE]: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800",
  [EventType.CAPTATION]: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-800",
  [EventType.REMINDER]: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-700",
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ currentDate, events, onTimeSlotClick, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { locale: es });
  const weekEnd = endOfWeek(currentDate, { locale: es });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.starts_at), day));
  };

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.starts_at);
    const end = new Date(event.ends_at);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const duration = Math.max(endMinutes - startMinutes, 30); // Minimum 30min display

    return {
      top: `${(startMinutes / (24 * 60)) * 100}%`,
      height: `${(duration / (24 * 60)) * 100}%`,
    };
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-border/50 overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto relative scrollbar-hide">
        {/* Days Header - Sticky */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/50 bg-muted/30 sticky top-0 z-30 shadow-sm backdrop-blur-sm">
          <div className="border-r border-border/50 p-2" /> {/* Spacer for time column */}
          {weekDays.map((day) => {
            const isTodayDate = isToday(day);
            return (
              <div
                key={day.toString()}
                className={cn(
                  "text-center py-3 border-r border-border/50 last:border-r-0",
                  isTodayDate && "bg-primary/5"
                )}
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {format(day, "EEE", { locale: es })}
                </div>
                <div
                  className={cn(
                    "text-lg font-semibold mt-0.5 w-9 h-9 flex items-center justify-center rounded-full mx-auto transition-colors",
                    isTodayDate
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Grid - Body */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-h-[1440px]">
          {/* Time Labels Column */}
          <div className="relative border-r border-border/50 bg-background/50">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute w-full pr-2 text-right"
                style={{ top: `${(hour / 24) * 100}%` }}
              >
                <span className="text-[10px] text-muted-foreground font-medium -translate-y-1/2 block">
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toString()}
                className={cn(
                  "relative border-r border-border/50 last:border-r-0",
                  isTodayDate && "bg-primary/5"
                )}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full border-t border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
                    style={{
                      top: `${(hour / 24) * 100}%`,
                      height: `${(1 / 24) * 100}%`,
                    }}
                    onClick={() => onTimeSlotClick(day, hour)}
                  />
                ))}

                {/* Current time indicator */}
                {isTodayDate && (
                  <CurrentTimeIndicator />
                )}

                {/* Events */}
                {dayEvents.map((event) => {
                  const pos = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute left-1 right-1 rounded-md px-2 py-1 cursor-pointer border-l-[3px] shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md z-10 overflow-hidden",
                        EVENT_TYPE_COLORS[event.type]
                      )}
                      style={{ top: pos.top, height: pos.height, minHeight: "24px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      title={event.title}
                    >
                      <div className="text-[10px] font-bold leading-tight truncate">
                        {event.title}
                      </div>
                      <div className="text-[9px] opacity-80 leading-tight">
                        {format(new Date(event.starts_at), "HH:mm")} - {format(new Date(event.ends_at), "HH:mm")}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CurrentTimeIndicator() {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // Update every minute
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
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-[5px] shadow-sm" />
        <div className="flex-1 h-[2px] bg-red-500/70" />
      </div>
    </div>
  );
}
