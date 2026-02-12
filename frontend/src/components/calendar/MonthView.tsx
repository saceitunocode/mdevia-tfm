"use client";

import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarEvent, EventType, EventStatus } from "@/types/calendar";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (day: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  [EventType.VISIT]: "bg-blue-100 text-blue-700 border-blue-200",
  [EventType.NOTE]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [EventType.CAPTATION]: "bg-purple-100 text-purple-700 border-purple-200",
  [EventType.REMINDER]: "bg-gray-100 text-gray-700 border-gray-200",
};

export function MonthView({ currentDate, events, onDayClick, onEventClick }: MonthViewProps) {
  // Calendar Grid Generation
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: es });
  const endDate = endOfWeek(monthEnd, { locale: es });
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.starts_at), day));
  };

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-lg border shadow-sm">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b">
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-3 uppercase tracking-wider text-[11px]">
                    {day}
                </div>
            ))}
        </div>

        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-border gap-px overflow-hidden rounded-b-lg">
            {calendarDays.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDate = isToday(day);

                return (
                    <div 
                        key={day.toString()} 
                        onClick={() => onDayClick(day)}
                        className={cn(
                            "min-h-[100px] bg-background p-2 transition-colors hover:bg-muted/50 cursor-pointer flex flex-col gap-1",
                            !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                            isTodayDate && "bg-primary/5"
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <span className={cn(
                                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                                isTodayDate ? "bg-primary text-primary-foreground" : "text-foreground/70"
                            )}>
                                {format(day, "d")}
                            </span>
                        </div>
                        
                        {/* Events List */}
                        <div className="space-y-1 mt-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                            {dayEvents.map(event => (
                                <div 
                                    key={event.id}
                                    className={cn(
                                        "text-[10px] px-1.5 py-1 rounded border truncate font-medium flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80",
                                        EVENT_TYPE_COLORS[event.type]
                                    )}
                                    title={event.title}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEventClick(event);
                                    }}
                                >
                                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", 
                                        event.status === EventStatus.COMPLETED ? "bg-green-500" : "bg-current"
                                    )} />
                                    {format(new Date(event.starts_at), "HH:mm")} {event.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
