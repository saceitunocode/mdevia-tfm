"use client";

import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalendarEvent, EventType, EventStatus, CalendarEventCreate } from "@/types/calendar";
import { calendarService } from "@/services/calendarService";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";

// --- Types & Constants ---
interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  [EventType.VISIT]: "bg-blue-100 text-blue-700 border-blue-200",
  [EventType.NOTE]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [EventType.CAPTATION]: "bg-purple-100 text-purple-700 border-purple-200",
  [EventType.REMINDER]: "bg-gray-100 text-gray-700 border-gray-200",
};

// --- Components ---

function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
            <div className="flex items-center bg-background border rounded-full px-1 py-1 shadow-sm">
                <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-7 w-7 rounded-full hover:bg-muted">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-4 min-w-[100px] text-center font-medium capitalize text-sm">
                    {format(currentDate, "MMMM", { locale: es })}
                </div>
                <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-7 w-7 rounded-full hover:bg-muted">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            
            <span className="text-xl font-light text-muted-foreground">
                {format(currentDate, "yyyy", { locale: es })}
            </span>
        </div>

        <Button variant="outline" size="sm" onClick={onToday} className="h-8 rounded-full px-4 text-xs font-medium">
            Hoy
        </Button>
      </div>
      
      {/* Removed duplicate filter and empty buttons */}
    </div>
  );
}

export default function CalendarPage() {
  const { token } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Month Navigation
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Data Fetching
  const fetchEvents = React.useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const start = startOfMonth(currentDate).toISOString();
            const end = endOfMonth(currentDate).toISOString();
            
            const evs = await calendarService.getEvents({
                start_date: start,
                end_date: end,
            }, token);
            setEvents(evs);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentDate, token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handlers
  const handleCreateEvent = async (data: CalendarEventCreate) => {
      if (!token) return;
      try {
          await calendarService.createEvent(data, token);
          // Refresh events
          fetchEvents();
      } catch (error) {
          console.error("Error creating event:", error);
          alert("Error al crear el evento");
          throw error;
      }
  };

  const handleDayClick = (day: Date) => {
      setSelectedDate(day);
      setIsDialogOpen(true);
  };
  
  const handleNewEventClick = () => {
      setSelectedDate(new Date());
      setIsDialogOpen(true);
  };

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
    <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
                <p className="text-muted-foreground">Gestiona tus visitas y eventos.</p>
            </div>
            {isLoading && (
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            )}
        </div>

        {/* Calendar Card */}
        <Card className="flex flex-col flex-1 p-6 border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CalendarHeader 
                currentDate={currentDate} 
                onPrevMonth={handlePrevMonth} 
                onNextMonth={handleNextMonth} 
                onToday={handleToday}
            />

            {/* Toolbar */}
             <div className="flex justify-end mb-4 gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
                <Button size="sm" className="gap-2" onClick={handleNewEventClick}>
                    <Plus className="h-4 w-4" />
                    Nuevo Evento
                </Button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2">
                {["Luns", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2 uppercase tracking-wider text-[10px]">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-px bg-border rounded-lg overflow-hidden border">
                {calendarDays.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isTodayDate = isToday(day);

                    return (
                        <div 
                            key={day.toString()} 
                            onClick={() => handleDayClick(day)}
                            className={cn(
                                "min-h-[120px] bg-background p-2 transition-colors hover:bg-muted/50 cursor-pointer flex flex-col gap-1",
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
                                            "text-[10px] px-1.5 py-1 rounded border truncate font-medium flex items-center gap-1",
                                            EVENT_TYPE_COLORS[event.type]
                                        )}
                                        title={event.title}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering day click
                                            // TODO: Edit event
                                            alert(`Evento: ${event.title}`);
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
        </Card>

        <CreateEventDialog 
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleCreateEvent}
            defaultDate={selectedDate}
        />
    </div>
  );
}
