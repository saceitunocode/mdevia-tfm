export enum EventType {
  VISIT = "VISIT",
  NOTE = "NOTE",
  CAPTATION = "CAPTATION",
  REMINDER = "REMINDER",
}

export enum EventStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  starts_at: string;
  ends_at: string;
  status: EventStatus;
  agent_id: string; // The backend returns this
  client_id?: string;
  property_id?: string;
  operation_id?: string;
  visit_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEventCreate {
  title: string;
  description?: string;
  type: EventType;
  starts_at: string; // ISO 8601
  ends_at: string; // ISO 8601
  agent_id?: string;
  client_id?: string;
  property_id?: string;
  operation_id?: string;
  visit_id?: string;
}

export interface CalendarEventUpdate {
  title?: string;
  description?: string;
  type?: EventType;
  starts_at?: string;
  ends_at?: string;
  status?: EventStatus;
  client_id?: string;
  property_id?: string;
  operation_id?: string;
}

export type CalendarView = "month" | "week" | "day";

export const EVENT_COLORS: Record<EventType, string> = {
    [EventType.VISIT]: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
    [EventType.NOTE]: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
    [EventType.CAPTATION]: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
    [EventType.REMINDER]: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
};
