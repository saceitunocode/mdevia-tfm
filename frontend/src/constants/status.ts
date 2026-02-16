import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Briefcase, 
  AlertCircle,
  LucideIcon
} from "lucide-react";

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: LucideIcon;
  description?: string;
}

export const PROPERTY_STATUS: Record<string, StatusConfig> = {
  AVAILABLE: {
    label: "Disponible",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800",
    icon: Building2,
  },
  SOLD: {
    label: "Vendido",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-100 dark:border-blue-800",
    icon: CheckCircle2,
  },
  RENTED: {
    label: "Alquilado",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-100 dark:border-amber-800",
    icon: Clock,
  },
  PENDING: {
    label: "Pendiente",
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-100 dark:border-yellow-800",
    icon: AlertCircle,
  },
  published: {
    label: "Publicado",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800",
    icon: Building2,
  },
};

export const OPERATION_STATUS: Record<string, StatusConfig> = {
  INTEREST: {
    label: "Interés",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-100 dark:border-blue-800",
    icon: TrendingUp,
  },
  NEGOTIATION: {
    label: "Negociación",
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-100 dark:border-yellow-800",
    icon: ActivityCircleIcon(), // Activity is common
  },
  RESERVED: {
    label: "Reservado",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-100 dark:border-orange-800",
    icon: Clock,
  },
  CLOSED: {
    label: "Cerrado",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-100 dark:border-green-800",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-100 dark:border-red-800",
    icon: XCircle,
  },
};

export const VISIT_STATUS: Record<string, StatusConfig> = {
  PENDING: {
    label: "Pendiente",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-100 dark:border-blue-800",
    icon: Clock,
  },
  DONE: {
    label: "Realizada",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelada",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-100 dark:border-red-800",
    icon: XCircle,
  },
};

// Helper for Negotiation icon since I can't call a function in the object directly easily without defining it
function ActivityCircleIcon() {
  return Briefcase; // Simplified for the interface
}

export const getStatusConfig = (type: 'property' | 'operation' | 'visit', status: string): StatusConfig => {
  const configs = type === 'property' ? PROPERTY_STATUS : type === 'operation' ? OPERATION_STATUS : VISIT_STATUS;
  return configs[status] || {
    label: status,
    color: "text-gray-700 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-100 dark:border-gray-700",
    icon: AlertCircle,
  };
};
