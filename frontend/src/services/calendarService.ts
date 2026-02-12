import { CalendarEvent, CalendarEventCreate, CalendarEventUpdate } from "@/types/calendar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchEventsParams {
  start_date?: string;
  end_date?: string;
  agent_id?: string;
}

export const calendarService = {
  async getEvents(params: FetchEventsParams, token: string): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams();
    if (params.start_date) searchParams.append("start_date", params.start_date);
    if (params.end_date) searchParams.append("end_date", params.end_date);
    if (params.agent_id) searchParams.append("agent_id", params.agent_id);

    const res = await fetch(`${API_URL}/calendar-events/?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Error fetching calendar events");
    }

    const data = await res.json();
    console.log("calendarService: getEvents response:", data);
    return data;
  },

  async createEvent(event: CalendarEventCreate, token: string): Promise<CalendarEvent> {
    const res = await fetch(`${API_URL}/calendar-events/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Error creating calendar event");
    }

    return res.json();
  },

  async updateEvent(id: string, updates: CalendarEventUpdate, token: string): Promise<CalendarEvent> {
    const res = await fetch(`${API_URL}/calendar-events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error updating calendar event");
    }

    return res.json();
  },

  async deleteEvent(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/calendar-events/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error deleting calendar event");
    }
  },
};
