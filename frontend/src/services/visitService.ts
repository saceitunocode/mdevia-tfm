import { apiRequest } from "@/lib/api";
import { Visit, VisitCreate, VisitUpdate, VisitNote } from "@/types/visit";

export const visitService = {
  async getVisits(agentId?: string): Promise<Visit[]> {
    const url = agentId ? `/visits/?agent_id=${agentId}` : "/visits/";
    return apiRequest(url) as Promise<Visit[]>;
  },

  async getVisit(id: string): Promise<Visit> {
    return apiRequest(`/visits/${id}`) as Promise<Visit>;
  },

  async createVisit(visit: VisitCreate): Promise<Visit> {
    return apiRequest("/visits/", {
      method: "POST",
      body: JSON.stringify(visit),
    }) as Promise<Visit>;
  },

  async updateVisit(id: string, visit: VisitUpdate): Promise<Visit> {
    return apiRequest(`/visits/${id}`, {
      method: "PATCH",
      body: JSON.stringify(visit),
    }) as Promise<Visit>;
  },

  async addNote(visitId: string, text: string): Promise<VisitNote> {
    return apiRequest(`/visits/${visitId}/notes`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }) as Promise<VisitNote>;
  },

  async deleteVisit(id: string): Promise<void> {
    await apiRequest(`/visits/${id}`, {
      method: "DELETE",
    });
  }
};
