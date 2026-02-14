import React from "react";
import { Search } from "lucide-react";

interface DashboardToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export function DashboardToolbar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Buscar...", 
  children 
}: DashboardToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      <div className="relative w-full sm:w-80 md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-input rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {children && (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {children}
        </div>
      )}
    </div>
  );
}
