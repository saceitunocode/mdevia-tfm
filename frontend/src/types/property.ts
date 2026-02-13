export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  RENTED = "RENTED",
  WITHDRAWN = "WITHDRAWN",
}

export interface PropertyImage {
  id: string;
  public_url: string;
  is_cover: boolean;
  caption?: string;
  position: number;
}

export interface PropertyNote {
  id: string;
  property_id: string;
  author_user_id: string;
  text: string;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code?: string;
  sqm: number;
  rooms: number;
  floor?: number;
  has_elevator: boolean;
  status: PropertyStatus;
  price_amount: number;
  price_currency: string;
  public_description?: string;
  internal_notes?: string;
  owner_client_id: string;
  captor_agent_id: string;
  images: PropertyImage[];
  notes?: PropertyNote[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
