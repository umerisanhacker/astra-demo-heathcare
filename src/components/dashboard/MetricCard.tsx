import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: ReactNode;
}

export default function MetricCard({ title, value, trend, trendUp, icon }: MetricCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 hover-lift transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-2">{value}</p>
        </div>
        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trendUp ? (
          <ArrowUpRight className="h-4 w-4 text-[var(--critical)] mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-[var(--success)] mr-1" />
        )}
        <span className={`text-sm font-medium ${trendUp ? 'text-[var(--critical)]' : 'text-[var(--success)]'}`}>
          {trend}
        </span>
        <span className="text-sm text-[var(--text-muted)] ml-2">vs last week</span>
      </div>
    </div>
  );
}

