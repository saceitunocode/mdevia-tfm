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
