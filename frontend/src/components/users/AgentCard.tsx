import React from "react";
import { User as UserType } from "@/types/user";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { User as UserIcon, Mail, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent?: UserType;
  title?: string;
  className?: string;
  emptyMessage?: string;
}

export function AgentCard({ 
  agent, 
  title = "Agente Responsable", 
  className,
  emptyMessage = "No se ha asignado un agente."
}: AgentCardProps) {
  return (
    <Card className={cn("border-l-4 border-l-purple-500 shadow-sm overflow-hidden", className)}>
        <CardHeader className="pb-2 bg-purple-50/50">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" /> {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-4">
            {agent ? (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                        <UserIcon size={20} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="font-bold text-sm">{agent.full_name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {agent.email}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-2">{emptyMessage}</p>
            )}
        </CardContent>
    </Card>
  );
}
