import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  extraOptions?: { label: string; value: string }[];
}

export function FilterSelect({ 
  value, 
  onChange, 
  className = "",
  icon = <SlidersHorizontal className="size-4" />
}: FilterSelectProps) {
  return (
    <div className={`relative overflow-hidden rounded-full text-white ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      <div className="absolute inset-0 bg-white/60" />

      {/* Content */}
      <div className="relative flex items-center gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent rounded text-sidebar font-medium pl-4 pr-10 py-2.5 cursor-pointer focus:outline-none"
          style={{ 
            textShadow: "none",
            WebkitAppearance: "none",
            MozAppearance: "none"
          }}
        >
          <option value="all" className="text-text-dark">All Roles</option>
          <option value="admin" className="text-text-dark">Admins</option>
          <option value="member" className="text-text-dark">Members</option>
        </select>
        
        {/* Icon container - positioned absolutely on the right */}
        <div className="absolute right-1.5 flex items-center justify-center size-7 rounded-full bg-white text-text-dark pointer-events-none">
          {icon}
        </div>
      </div>
    </div>
  );
}