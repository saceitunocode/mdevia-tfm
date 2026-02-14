
export type VisitStatus = 'PENDING' | 'DONE' | 'CANCELLED';

export interface VisitNote {
  id: string;
  visit_id: string;
  author_user_id: string;
  text: string;
  created_at: string;
  author_name?: string;
  author?: {
    full_name: string;
  };
}

export interface Visit {
  id: string;
  client_id: string;
  property_id: string;
  agent_id: string;
  scheduled_at: string;
  status: VisitStatus;
  created_at: string;
  updated_at: string;
  
  // Relations
  client?: {
    id: string;
    full_name: string;
    email: string;
  }; 
  property?: {
    id: string;
    title: string;
    address_line1: string;
  };
  agent?: {
    id: string;
    full_name: string;
  };
  notes?: VisitNote[];
}

export interface VisitCreate {
  client_id: string;
  property_id: string;
  scheduled_at: string;
  agent_id?: string;
  status?: VisitStatus;
  note?: string;
}

export interface VisitUpdate {
  scheduled_at?: string;
  status?: VisitStatus;
  note?: string;
}
