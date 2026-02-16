"use client";

import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarEvent, EVENT_COLORS } from "@/types/calendar";

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
                            "md:min-h-[130px] min-h-[60px] bg-background p-1 md:p-2 transition-colors cursor-pointer flex flex-col group relative hover:bg-muted/30",
                            !isCurrentMonth && "bg-muted/10 text-muted-foreground/50",
                        )}
                    >
                         {/* Day Number */}
                        <div className="flex justify-center md:justify-between items-start mb-1">
                                <span className={cn(
                                    "text-xs md:text-sm font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-colors",
                                    isTodayDate 
                                      ? "bg-primary text-primary-foreground shadow-sm" 
                                      : "text-muted-foreground group-hover:text-foreground md:group-hover:text-foreground"
                                )}>
                                    {format(day, "d")}
                                </span>
                             
                             {/* Add Button (Hidden on mobile, shown on hover desktop) */}
                             {isCurrentMonth && (
                               <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="text-muted-foreground hover:text-primary p-1">
                                    <span className="sr-only">Añadir evento</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                  </button>
                               </div>
                             )}
                        </div>

                        {/* Mobile Events (Clickable Bars) */}
                        <div className="flex md:hidden flex-col gap-0.5 mt-1 w-full px-0.5">
                            {dayEvents.slice(0, 4).map((event) => (
                                <div 
                                    key={`mob-${event.id}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEventClick(event);
                                    }}
                                    className={cn(
                                        "h-3.5 rounded-[2px] px-1 flex items-center cursor-pointer overflow-hidden transition-opacity hover:opacity-80 active:scale-[0.98] border-l-2",
                                        EVENT_COLORS[event.type]
                                    )} 
                                >
                                    <span className="text-[7px] font-bold uppercase truncate leading-none w-full">
                                        {event.type}
                                    </span>
                                </div>
                            ))}
                            {dayEvents.length > 4 && (
                                <div className="h-3.5 flex items-center justify-center mt-0.5 bg-muted/50 rounded-[2px] cursor-pointer hover:bg-muted transition-colors" title="Ver más eventos">
                                    <span className="text-[9px] font-bold text-muted-foreground leading-none">+ {dayEvents.length - 4}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Desktop Events List (Detailed View) */}
                        <div className="hidden md:block space-y-1 mt-auto">
                            {dayEvents.slice(0, 3).map(event => (
                                <div 
                                    key={event.id}
                                    className={cn(
                                        "text-[10px] px-1.5 py-1 rounded border-l-2 truncate font-medium cursor-pointer transition-all hover:shadow-sm hover:translate-x-0.5",
                                        EVENT_COLORS[event.type]
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
                            {dayEvents.length > 3 && (
                                <p className="text-[10px] text-center text-muted-foreground font-medium pt-1 hover:text-primary transition-colors">
                                    + {dayEvents.length - 3} más
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
