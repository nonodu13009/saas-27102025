import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  colorScheme?: "blue" | "green" | "orange" | "purple" | "red" | "teal" | "pink" | "indigo";
}

const colorSchemes = {
  blue: {
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    border: "border-l-4 border-blue-500",
  },
  green: {
    iconBg: "bg-green-500/10 dark:bg-green-500/20",
    iconColor: "text-green-600 dark:text-green-400",
    border: "border-l-4 border-green-500",
  },
  orange: {
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    border: "border-l-4 border-orange-500",
  },
  purple: {
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    border: "border-l-4 border-purple-500",
  },
  red: {
    iconBg: "bg-red-500/10 dark:bg-red-500/20",
    iconColor: "text-red-600 dark:text-red-400",
    border: "border-l-4 border-red-500",
  },
  teal: {
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    border: "border-l-4 border-teal-500",
  },
  pink: {
    iconBg: "bg-pink-500/10 dark:bg-pink-500/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    border: "border-l-4 border-pink-500",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    border: "border-l-4 border-indigo-500",
  },
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, colorScheme = "blue" }: KPICardProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]", colors.border)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium text-muted-foreground mb-4">
              {title}
            </CardTitle>
            <div className="text-3xl font-bold mb-2">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
            )}
            {trend && (
              <div className="mt-3">
                <span className={cn(
                  "text-xs font-semibold flex items-center gap-1",
                  trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                  trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                  'text-muted-foreground'
                )}>
                  {trend === 'up' && (
                    <span className="text-green-600 dark:text-green-400">↑ Hausse</span>
                  )}
                  {trend === 'down' && (
                    <span className="text-red-600 dark:text-red-400">↓ Baisse</span>
                  )}
                  {trend === 'neutral' && (
                    <span className="text-muted-foreground">— Stable</span>
                  )}
                </span>
              </div>
            )}
          </div>
          <div className={cn("rounded-xl p-3 flex items-center justify-center", colors.iconBg)}>
            <Icon className={cn("h-10 w-10", colors.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

