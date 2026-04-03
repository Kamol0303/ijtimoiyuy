import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  variant?: "default" | "success" | "danger" | "warning";
}

const variantClasses = {
  default: "border-l-primary",
  success: "border-l-success",
  danger: "border-l-destructive",
  warning: "border-l-warning",
};

export function KPICard({ title, value, icon, trend, variant = "default" }: KPICardProps) {
  return (
    <div className={`kpi-card border-l-4 ${variantClasses[variant]} animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-muted">
          {icon}
        </div>
      </div>
    </div>
  );
}
