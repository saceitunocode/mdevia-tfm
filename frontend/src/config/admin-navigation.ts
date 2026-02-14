import {
  LayoutDashboard,
  Home,
  Users,
  UserCog,
  Calendar,
  ClipboardList,
  MapPin,
} from "lucide-react";

export const ADMIN_MENU_ITEMS = [
  { 
    name: "Agenda", 
    href: "/oficina/agenda", 
    icon: Calendar, 
    roles: ["ADMIN", "AGENT"] 
  },
  { 
    name: "Clientes", 
    href: "/oficina/clientes", 
    icon: Users, 
    roles: ["ADMIN", "AGENT"] 
  },
  { 
    name: "Propiedades", 
    href: "/oficina/propiedades", 
    icon: Home, 
    roles: ["ADMIN", "AGENT"] 
  },
  { 
    name: "Visitas", 
    href: "/oficina/visitas", 
    icon: MapPin, 
    roles: ["ADMIN", "AGENT"] 
  },
  { 
    name: "Operaciones", 
    href: "/oficina/operaciones", 
    icon: ClipboardList, 
    roles: ["ADMIN", "AGENT"] 
  },
  { 
    name: "Dashboard", 
    href: "/oficina/panel", 
    icon: LayoutDashboard, 
    roles: ["ADMIN"] 
  },
  { 
    name: "Usuarios", 
    href: "/oficina/usuarios", 
    icon: UserCog, 
    roles: ["ADMIN"] 
  }
];
