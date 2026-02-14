import { apiRequest } from "@/lib/api";
import { Operation, OperationCreate, OperationUpdate, OperationNote } from "@/types/operation";

export const operationService = {
  async getOperations(skip = 0, limit = 100): Promise<Operation[]> {
    return apiRequest<Operation[]>(`/operations/?skip=${skip}&limit=${limit}`, {
      method: "GET",
    });
  },

  async getOperation(id: string): Promise<Operation> {
    return apiRequest<Operation>(`/operations/${id}`, {
      method: "GET",
    });
  },

  async createOperation(operation: OperationCreate): Promise<Operation> {
    return apiRequest<Operation>("/operations/", {
      method: "POST",
      body: JSON.stringify(operation),
    });
  },

  async updateStatus(id: string, updates: OperationUpdate): Promise<Operation> {
    return apiRequest<Operation>(`/operations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async addNote(id: string, text: string): Promise<OperationNote> {
    return apiRequest(`/operations/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },
};
