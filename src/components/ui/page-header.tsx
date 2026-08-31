import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center md:justify-between">
      <div>
        <h2 className="text-lg lg:text-2xl text-text-dark dark:text-accent-foreground font-medium tracking-tight">{title}</h2>
        <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="w-auto flex items-center justify-end">
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
