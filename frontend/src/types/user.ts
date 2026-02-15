export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "AGENT";
  is_active: boolean;
}
