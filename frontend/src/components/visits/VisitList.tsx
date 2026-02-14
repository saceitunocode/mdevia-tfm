import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User, Building2, CheckCircle2, Clock, XCircle, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Visit, VisitUpdate } from "@/types/visit";
import { Button } from "@/components/ui/Button";
import { CompleteVisitDialog } from "./CompleteVisitDialog";

interface VisitListProps {
  visits: Visit[];
  isLoading?: boolean;
  onUpdate?: (id: string, data: VisitUpdate) => Promise<void>;
}

export function VisitList({ visits, isLoading, onUpdate }: VisitListProps) {
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/30">
        <Calendar className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground">No hay visitas programadas</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "CANCELLED": return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DONE": return "Realizada";
      case "CANCELLED": return "Cancelada";
      default: return "Pendiente";
    }
  };

  const handleOpenComplete = (visit: Visit) => {
    setSelectedVisit(visit);
    setCompleteDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        {visits.map((visit) => (
          <Card key={visit.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">
                        {format(new Date(visit.scheduled_at), "d 'de' MMMM, HH:mm", { locale: es })}
                      </span>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5 uppercase tracking-wider font-bold">
                          {visit.status === 'PENDING' ? 'Próxima' : getStatusLabel(visit.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-primary/60" />
                        <span className="font-medium truncate">{visit.client?.full_name || "Cargando..."}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 size={12} className="text-primary/60" />
                        <span className="font-medium truncate">{visit.property?.title || "Propiedad"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {visit.status === 'PENDING' && onUpdate ? (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 text-xs gap-1 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20"
                        onClick={() => handleOpenComplete(visit)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Cerrar</span>
                      </Button>
                   ) : (
                      getStatusIcon(visit.status)
                   )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CompleteVisitDialog
        isOpen={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        visit={selectedVisit}
        onSubmit={async (id, data) => {
          if (onUpdate) await onUpdate(id, data);
        }}
      />
    </>
  );
}
