import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/Badge";
import { Activity, Calendar, ChevronRight } from "lucide-react";
import { Operation, OperationStatus, OperationType } from "@/types/operation";

interface OperationListProps {
  operations: Operation[];
  isLoading?: boolean;
}

export const OperationList: React.FC<OperationListProps> = ({ operations, isLoading = false }) => {
  const getStatusBadge = (status: OperationStatus) => {
    switch (status) {
      case OperationStatus.INTEREST: 
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-none">Interés</Badge>;
      case OperationStatus.NEGOTIATION: 
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none">Negociación</Badge>;
      case OperationStatus.RESERVED: 
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-none">Reservado</Badge>;
      case OperationStatus.CLOSED: 
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-none">Cerrado</Badge>;
      case OperationStatus.CANCELLED: 
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-none">Cancelado</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (operations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground italic">No hay operaciones asociadas.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {operations.map((op) => (
        <Link href={`/oficina/operaciones/${op.id}`} key={op.id}>
          <div className="group flex items-center p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
            <div className="flex-1 flex items-center gap-3 min-w-0">
               <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
                 <Activity size={18} />
               </div>
               <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-bold truncate">Op: {op.type === OperationType.SALE ? "Venta" : "Alquiler"}</span>
                    {getStatusBadge(op.status)}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-tight">
                     <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {format(new Date(op.created_at), "d MMM yyyy", { locale: es })}
                     </span>
                     <span className="font-mono">ID: {op.id.substring(0, 8)}</span>
                  </div>
               </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      ))}
    </div>
  );
};
