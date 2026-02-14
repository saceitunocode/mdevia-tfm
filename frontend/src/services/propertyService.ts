import { PropertyCardData } from "@/components/public/PropertyCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface PropertyFilterParams {
  city?: string;
  price_min?: number;
  price_max?: number;
  sqm_min?: number;
  sqm_max?: number;
  rooms?: number;
  baths?: number;
  status?: string;
  type?: string[]; // Multi-select
  amenities?: string[];
  limit?: number;
  offset?: number;
  sort?: string;
}

export const propertyService = {
  async getPublicProperties(params: PropertyFilterParams): Promise<{ items: PropertyCardData[]; total: number }> {
    const searchParams = new URLSearchParams();
    
    if (params.city) searchParams.set("city", params.city);
    if (params.price_min) searchParams.set("price_min", params.price_min.toString());
    if (params.price_max) searchParams.set("price_max", params.price_max.toString());
    if (params.sqm_min) searchParams.set("sqm_min", params.sqm_min.toString());
    if (params.sqm_max) searchParams.set("sqm_max", params.sqm_max.toString());
    if (params.rooms) searchParams.set("rooms", params.rooms.toString());
    if (params.baths) searchParams.set("baths", params.baths.toString());
    if (params.status) searchParams.set("status", params.status);
    
    if (params.type && params.type.length > 0) {
      params.type.forEach(t => searchParams.append("property_type", t));
    }

    if (params.amenities && params.amenities.length > 0) {
       params.amenities.forEach(a => searchParams.append("amenities", a));
    }

    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.offset) searchParams.set("offset", params.offset.toString());
    if (params.sort) searchParams.set("sort", params.sort);

    const res = await fetch(`${API_BASE}/properties/public?${searchParams.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch properties");
    
    // Check if response is array or object with items
    const data = await res.json();
    if (Array.isArray(data)) {
        return { items: data, total: data.length }; // Fallback if API returns array
    }
    return data; 
  },

  async getPublicProperty(id: string): Promise<PropertyCardData> {
    const res = await fetch(`${API_BASE}/properties/public/${id}`);
    if (!res.ok) throw new Error("Failed to fetch property details");
    return res.json();
  }
};
