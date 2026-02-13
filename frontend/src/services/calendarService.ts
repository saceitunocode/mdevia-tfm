import { apiRequest } from "@/lib/api";
import { CalendarEvent, CalendarEventCreate, CalendarEventUpdate } from "@/types/calendar";

interface FetchEventsParams {
  start_date?: string;
  end_date?: string;
  agent_id?: string;
}

export const calendarService = {
  async getEvents(params: FetchEventsParams): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams();
    if (params.start_date) searchParams.append("start_date", params.start_date);
    if (params.end_date) searchParams.append("end_date", params.end_date);
    if (params.agent_id) searchParams.append("agent_id", params.agent_id);

    return apiRequest<CalendarEvent[]>(`/calendar-events/?${searchParams.toString()}`);
  },

  async createEvent(event: CalendarEventCreate): Promise<CalendarEvent> {
    return apiRequest<CalendarEvent>("/calendar-events/", {
      method: "POST",
      body: JSON.stringify(event),
    });
  },

  async updateEvent(id: string, updates: CalendarEventUpdate): Promise<CalendarEvent> {
    return apiRequest<CalendarEvent>(`/calendar-events/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  async deleteEvent(id: string): Promise<void> {
    await apiRequest<void>(`/calendar-events/${id}`, {
      method: "DELETE",
    });
  },
};
