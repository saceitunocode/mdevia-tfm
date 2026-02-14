"use client";

import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarEvent, EventType } from "@/types/calendar";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (day: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

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
    <div className="flex flex-col h-full bg-background border border-border/50 rounded-lg shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-border/50 bg-muted/5">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div key={day} className="text-center text-muted-foreground py-2 text-sm font-semibold">
                    {day}
                </div>
            ))}
        </div>

        <div className="grid grid-cols-7 flex-1 overflow-y-auto bg-border/50 gap-px">
            {calendarDays.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDate = isToday(day);

                return (
                    <div 
                        key={day.toString()} 
                        onClick={() => onDayClick(day)}
                        className={cn(
                            "min-h-[100px] bg-background p-2 transition-colors cursor-pointer flex flex-col group relative hover:bg-muted/30",
                            !isCurrentMonth && "bg-muted/10 text-muted-foreground/50",
                        )}
                    >
                         {/* Day Number */}
                        <div className="flex justify-between items-start mb-1">
                            <span className={cn(
                                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                                isTodayDate 
                                  ? "bg-primary text-primary-foreground shadow-sm" 
                                  : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {format(day, "d")}
                            </span>
                             
                             {/* Add Button (Hidden by default, shown on hover) */}
                             {isCurrentMonth && (
                               <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="text-muted-foreground hover:text-primary p-1">
                                    <span className="sr-only">Añadir evento</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                  </button>
                               </div>
                             )}
                        </div>
                        
                        {/* Events List */}
                        <div className="space-y-1 mt-auto">
                            {dayEvents.map(event => (
                                <div 
                                    key={event.id}
                                    className={cn(
                                        "text-[10px] px-1.5 py-1 rounded border-l-2 truncate font-medium cursor-pointer transition-all hover:shadow-sm hover:translate-x-0.5",
                                        event.type === EventType.VISIT ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300" :
                                        event.type === EventType.CAPTATION ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300" :
                                        event.type === EventType.NOTE ? "bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-700 dark:text-amber-300" :
                                        "bg-gray-50 dark:bg-gray-800 border-gray-500 text-gray-700 dark:text-gray-300"
                                    )}
                                    title={event.title}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEventClick(event);
                                    }}
                                >
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
