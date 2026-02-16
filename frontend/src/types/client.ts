import { Visit } from "./visit";
import { Operation } from "./operation";
import { User } from "./user";

export type ClientType = "BUYER" | "TENANT" | "OWNER";

export interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  type: ClientType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  responsible_agent_id: string;
}

export interface ClientNote {
  id: string;
  text: string;
  author_user_id: string;
  created_at: string;
}

export interface OwnedProperty {
  id: string;
  title: string;
  city: string;
  status: string;
  price_amount: number | null;
  price_currency: string;
}

export interface ClientDetail extends Client {
  notes: ClientNote[];
  visits: Visit[];
  operations: Operation[];
  owned_properties: OwnedProperty[];
  responsible_agent?: User;
}
