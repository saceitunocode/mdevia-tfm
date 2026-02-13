"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, CalendarDays, CalendarRange, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CalendarEvent, CalendarEventCreate, CalendarEventUpdate } from "@/types/calendar";
import { calendarService } from "@/services/calendarService";
import { useAuth } from "@/context/auth-context";
import { visitService } from "@/services/visitService";
import { EventType as CalendarEventType } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { EditEventDialog } from "@/components/calendar/EditEventDialog";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";

// --- Types ---
type CalendarViewType = "month" | "week" | "day";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarViewType;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarViewType) => void;
}

// --- Components ---

function CalendarHeader({ currentDate, view, onPrev, onNext, onToday, onViewChange }: CalendarHeaderProps) {
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
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      {/* Left: Navigation */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center bg-background border rounded-full px-1 py-1 shadow-sm">
          <Button variant="ghost" size="icon" onClick={onPrev} className="h-7 w-7 rounded-full hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext} className="h-7 w-7 rounded-full hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-base sm:text-lg font-semibold capitalize min-w-[180px]">
          {getDateLabel()}
        </h2>

        <Button variant="outline" size="sm" onClick={onToday} className="h-7 rounded-full px-3 text-xs font-medium">
          Hoy
        </Button>
      </div>

      {/* Right: View Toggle */}
      <div className="flex items-center bg-muted/50 border rounded-lg p-0.5 shadow-sm">
        {([
          { key: "month" as const, label: "Mes", icon: CalendarDays },
          { key: "week" as const, label: "Semana", icon: CalendarRange },
          { key: "day" as const, label: "Día", icon: CalendarIcon },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onViewChange(key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              view === key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CalendarDays className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-1">No hay eventos</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        No hay eventos programados para este período. Haz clic en un día o usa el botón &ldquo;Nuevo Evento&rdquo; para crear uno.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-12 w-12 text-destructive/60 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-1">Error al cargar eventos</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">
        No se pudieron cargar los eventos del calendario. Comprueba tu conexión e inténtalo de nuevo.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-6 bg-muted rounded" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded" />
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
      case "day": updateUrl(subDays(currentDate, 1)); break;
    }
  };

  const handleNext = () => {
    switch (viewParam) {
      case "month": updateUrl(addMonths(currentDate, 1)); break;
      case "week": updateUrl(addWeeks(currentDate, 1)); break;
      case "day": updateUrl(addDays(currentDate, 1)); break;
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
          const dayStart = new Date(currentDate);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(currentDate);
          dayEnd.setHours(23, 59, 59, 999);
          start = dayStart.toISOString();
          end = dayEnd.toISOString();
          break;
      }

      const evs = await calendarService.getEvents({ start_date: start, end_date: end });
      setEvents(evs);
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

  // CRUD Handlers
  const handleCreateEvent = async (data: CalendarEventCreate) => {
    if (!token) return;
    try {
      if (data.type === CalendarEventType.VISIT && data.client_id && data.property_id) {
        // Para visitas, usamos el servicio de visitas que crea tanto la visita como el evento
        await visitService.createVisit({
          client_id: data.client_id,
          property_id: data.property_id,
          scheduled_at: data.starts_at,
          note: data.description
        });
      } else {
        // Otros eventos siguen el flujo normal
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
        // Si el evento está vinculado a una visita, usamos el servicio de visitas
        // Esto asegura que se actualice tanto la visita como el evento sincronizado
        await visitService.updateVisit(selectedEvent.visit_id, {
          scheduled_at: data.starts_at,
          note: data.description,
          // Nota: El backend de VisitUpdate actualmente no soporta cambiar cliente/propiedad
          // pero al menos sincronizamos la fecha y descripción.
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
        // Si el evento es una visita, eliminamos la visita (esto borrará el evento por cascada)
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
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground">Gestiona tus visitas y eventos.</p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          )}
          <Button size="sm" className="gap-2" onClick={handleNewEventClick}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Evento</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="flex flex-col flex-1 min-h-0 p-3 sm:p-6 bg-card/50 backdrop-blur-sm rounded-lg border shadow-sm">
        <CalendarHeader
          currentDate={currentDate}
          view={viewParam}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleViewChange}
        />

        {/* Calendar View Container */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {renderView()}
        </div>

        {/* Empty overlay for month view when no events */}
        {!isLoading && !hasError && events.length === 0 && viewParam === "month" && (
          <EmptyState />
        )}
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
