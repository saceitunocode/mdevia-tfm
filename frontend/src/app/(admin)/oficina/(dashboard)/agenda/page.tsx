"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CalendarEvent, CalendarEventCreate, CalendarEventUpdate, EventType, EventStatus } from "@/types/calendar";
import { Visit } from "@/types/visit";
import { calendarService } from "@/services/calendarService";
import { useAuth } from "@/context/auth-context";
import { visitService } from "@/services/visitService";
import { cn } from "@/lib/utils";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { EditEventDialog } from "@/components/calendar/EditEventDialog";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";
import { AgendaSidebar } from "@/components/calendar/AgendaSidebar";
import { AgendaListView } from "@/components/calendar/AgendaListView";

// --- Types ---
type CalendarViewType = "month" | "week" | "day" | "agenda";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarViewType;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarViewType) => void;
  onNewEvent: () => void;
}

// --- Components ---

function CalendarHeader({ currentDate, view, onPrev, onNext, onToday, onViewChange, onNewEvent }: CalendarHeaderProps) {
  const getDateLabel = () => {
    switch (view) {
      case "month":
        return format(currentDate, "MMMM yyyy", { locale: es });
      case "week": {
        const weekStart = startOfWeek(currentDate, { locale: es });
        const weekEnd = endOfWeek(currentDate, { locale: es });
        return `${format(weekStart, "d MMM", { locale: es })} – ${format(weekEnd, "d MMM yyyy", { locale: es })}`;
      }
      case "day":
        return format(currentDate, "EEEE, d 'de' MMMM yyyy", { locale: es });
      case "agenda":
        return "Próximos Eventos";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
      {/* Left: Navigation & Date */}
      <div className="flex items-center gap-6 w-full sm:w-auto">
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 bg-muted/30 border border-border/50 rounded-lg p-1">
                <Button variant="ghost" size="icon" onClick={onPrev} className="h-8 w-8 hover:bg-background hover:text-primary transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-border/50" />
                <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8 hover:bg-background hover:text-primary transition-colors">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <Button variant="outline" size="sm" onClick={onToday} className="h-8 px-4 text-xs font-semibold uppercase tracking-wide">
                Hoy
            </Button>
        </div>
        
        <h2 className="text-xl font-bold tracking-tight capitalize text-foreground min-w-[180px]">
            {getDateLabel()}
        </h2>
      </div>

      {/* Right: Actions & Toggle */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-end">
         <div className="flex items-center bg-muted/30 border border-border/50 rounded-lg p-1 shadow-inner w-full sm:w-auto overflow-x-auto sm:overflow-visible">
            {([
            { key: "month" as const, label: "Mes" },
            { key: "week" as const, label: "Semana" },
            { key: "day" as const, label: "Día" },
            { key: "agenda" as const, label: "Resumen" },
            ]).map(({ key, label }) => (
            <button
                key={key}
                onClick={() => onViewChange(key)}
                className={cn(
                "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold rounded-md transition-all duration-200",
                view === key
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
            >
                {label}
            </button>
            ))}
        </div>
        
        <Button onClick={onNewEvent} className="h-9 w-full sm:w-auto shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Nuevo <span className="sm:hidden">Ev...</span><span className="hidden sm:inline">Evento</span>
        </Button>
      </div>
    </div>
  );
}



function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-12 w-12 text-destructive/60 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-1">Error al cargar eventos</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">
        No se pudieron cargar los eventos del calendario.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-3 h-full">
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 bg-muted/50 rounded" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px flex-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted/20 rounded" />
        ))}
      </div>
    </div>
  );
}

// --- Main Page (wrapped in Suspense for useSearchParams) ---

function CalendarPageContent() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State Management
  const viewParam = (searchParams.get("view") || "month") as CalendarViewType;
  const dateParam = searchParams.get("date");

  const currentDate = useMemo(() => {
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  }, [dateParam]);

  const updateUrl = (newDate: Date, view: CalendarViewType = viewParam) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    params.set("date", format(newDate, "yyyy-MM-dd"));
    router.push(`?${params.toString()}`);
  };

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [pendingVisits, setPendingVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Navigation handlers per view type
  const handlePrev = () => {
    switch (viewParam) {
      case "month": updateUrl(subMonths(currentDate, 1)); break;
      case "week": updateUrl(subWeeks(currentDate, 1)); break;
      case "day":
      case "agenda": 
        updateUrl(subDays(currentDate, 1)); break;
    }
  };

  const handleNext = () => {
    switch (viewParam) {
      case "month": updateUrl(addMonths(currentDate, 1)); break;
      case "week": updateUrl(addWeeks(currentDate, 1)); break;
      case "day":
      case "agenda":
        updateUrl(addDays(currentDate, 1)); break;
    }
  };

  const handleToday = () => updateUrl(new Date());

  const handleViewChange = (view: CalendarViewType) => {
    updateUrl(currentDate, view);
  };

  // Data Fetching — fetch range depends on view
  const fetchEvents = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setHasError(false);
    try {
      let start: string;
      let end: string;

      // Always fetch a slightly larger range to ensure we have data transitions
      // But for Sidebar we need Pending Visits and Today's Events specifically
      // Note: Today's events are filtered on the client side from the main fetch if contained, 
      // but if we are in a different month, we might technically miss "today's tasks" in the sidebar 
      // if we only fetch the current view's range. 
      // Optimization: Fetch current view range.
      // Separate Fetch: Pending Visits (global). 
      // Separate Fetch: Today's Events (if not in current range? - sticking to client filtering for now as MVP).
      
      switch (viewParam) {
        case "month":
          start = startOfMonth(currentDate).toISOString();
          end = endOfMonth(currentDate).toISOString();
          break;
        case "week":
          start = startOfWeek(currentDate, { locale: es }).toISOString();
          end = endOfWeek(currentDate, { locale: es }).toISOString();
          break;
        case "day":
        case "agenda":
          const dayStart = new Date(currentDate);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(currentDate);
          // For agenda view, let's fetch a bit more (e.g. 7 days from current date)
          if (viewParam === "agenda") {
             const agendaEnd = addDays(dayStart, 7);
             agendaEnd.setHours(23, 59, 59, 999);
             end = agendaEnd.toISOString();
          } else {
             dayEnd.setHours(23, 59, 59, 999);
             end = dayEnd.toISOString();
          }
          start = dayStart.toISOString();
          break;
      }

      const [evs, visits] = await Promise.all([
        calendarService.getEvents({ start_date: start, end_date: end }),
        visitService.getVisits() // Fetch all to filter pending
      ]);
      
      setEvents(evs);
      setPendingVisits(visits.filter(v => v.status === "PENDING"));
      
    } catch (error) {
      console.error("Failed to fetch events", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, token, viewParam]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Derived data for sidebar
  const todayEvents = useMemo(() => {
      // In a real app we might want to fetch these separately to ensure we see them even 
      // when viewing next month's calendar. For now, filtering loaded events is a safe start,
      // assuming the user is mostly looking at the current month.
      // Better approach: filter from all fetched events if we fetched a wider range, 
      // or just accept that "Today's Tasks" are only visible if "Today" is in view range.
      // Correct approach for MVP: Filter events that fall on "Today".
      const today = new Date();
      return events.filter(e => isSameDay(new Date(e.starts_at), today));
  }, [events]);

  // CRUD Handlers
  const handleCreateEvent = async (data: CalendarEventCreate) => {
    if (!token) return;
    try {
      if (data.type === EventType.VISIT && data.client_id && data.property_id) {
        await visitService.createVisit({
          client_id: data.client_id,
          property_id: data.property_id,
          scheduled_at: data.starts_at,
          note: data.description
        });
      } else {
        await calendarService.createEvent(data);
      }
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  const handleUpdateEvent = async (id: string, data: CalendarEventUpdate) => {
    if (!token) return;
    try {
      if (selectedEvent?.visit_id) {
        await visitService.updateVisit(selectedEvent.visit_id, {
          scheduled_at: data.starts_at,
          note: data.description,
        });
      } else {
        await calendarService.updateEvent(id, data);
      }
      fetchEvents();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!token) return;
    try {
      if (selectedEvent?.visit_id) {
        await visitService.deleteVisit(selectedEvent.visit_id);
      } else {
        await calendarService.deleteEvent(id);
      }
      fetchEvents();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  // Click Handlers
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const dateWithHour = new Date(day);
    dateWithHour.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    setSelectedDate(dateWithHour);
    setIsDialogOpen(true);
  };

  const handleNewEventClick = () => {
    setSelectedDate(new Date());
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleVisitClick = (visit: Visit) => {
      // Create a transient calendar event to open the dialog
      // This is a bit hacky but reuses the dialog
      const event: CalendarEvent = {
          id: visit.id, // Using visit ID might clash if not careful, but for display it's fine
          title: `Visita: ${visit.client?.full_name || 'Cliente'}`,
          description: visit.notes?.[0]?.text || '',
          starts_at: visit.scheduled_at,
          ends_at: new Date(new Date(visit.scheduled_at).getTime() + 60*60*1000).toISOString(), // Assume 1h
          type: EventType.VISIT,
          status: visit.status === 'DONE' ? EventStatus.COMPLETED : visit.status === 'CANCELLED' ? EventStatus.CANCELLED : EventStatus.ACTIVE,
          visit_id: visit.id,
          property_id: visit.property_id,
          client_id: visit.client_id,
          agent_id: visit.agent_id,
          created_at: visit.created_at,
          updated_at: visit.updated_at
      };
      setSelectedEvent(event);
      setIsEditOpen(true);
  };

  // Render the appropriate view
  const renderView = () => {
    if (isLoading) return <CalendarSkeleton />;
    if (hasError) return <ErrorState onRetry={fetchEvents} />;

    switch (viewParam) {
      case "month":
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        );
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        );
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        );
      case "agenda":
        return (
          <AgendaListView
            events={events}
            onEventClick={handleEventClick}
          />
        );
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
        
        <CalendarHeader
          currentDate={currentDate}
          view={viewParam}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleViewChange}
          onNewEvent={handleNewEventClick}
        />

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 min-h-0">
            {/* Main Calendar Area */}
            <div className="h-full min-h-0 flex flex-col rounded-xl overflow-hidden bg-card/50 shadow-sm border border-border/50">
                <div className="flex-1 min-h-0 overflow-auto">
                    {renderView()}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block h-full min-h-0">
               <AgendaSidebar 
                  todayEvents={todayEvents} 
                  pendingVisits={pendingVisits}
                  onEventClick={handleEventClick}
                  onVisitClick={handleVisitClick}
               />
            </div>
        </div>

      {/* Dialogs */}
      <CreateEventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateEvent}
        defaultDate={selectedDate}
      />

      <EditEventDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
      />
    </div>
  );
}

// Wrap in Suspense boundary for useSearchParams
export default function CalendarPage() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarPageContent />
    </Suspense>
  );
}
