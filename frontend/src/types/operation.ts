export enum OperationType {
  SALE = "SALE",
  RENT = "RENT",
}

export enum OperationStatus {
  INTEREST = "INTEREST",
  NEGOTIATION = "NEGOTIATION",
  RESERVED = "RESERVED",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

import { Visit } from "./visit";
import { User } from "./user";

export interface Operation {
  id: string;
  type: OperationType;
  status: OperationStatus;
  client_id: string;
  property_id: string;
  agent_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Nested data from backend
  client?: {
    id: string;
    full_name: string;
    phone?: string;
  };
  property?: {
    id: string;
    title: string;
    city: string;
  };
  agent?: User;
  status_history?: OperationStatusHistory[];
  notes?: OperationNote[];
  visits?: Visit[];
}

export interface OperationNote {
  id: string;
  operation_id: string;
  author_user_id: string;
  author?: {
    id: string;
    full_name: string;
  };
  text: string;
  created_at: string;
}

export interface OperationStatusHistory {
  id: string;
  operation_id: string;
  from_status: OperationStatus;
  to_status: OperationStatus;
  changed_at: string;
  changed_by_user_id: string;
  note?: string;
}

export interface OperationCreate {
  type: OperationType;
  status?: OperationStatus;
  client_id: string;
  property_id: string;
  agent_id?: string;
  note?: string;
}

export interface OperationUpdate {
  status?: OperationStatus;
  note?: string;
}
