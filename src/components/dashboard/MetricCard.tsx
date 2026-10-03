import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: ReactNode;
}

export default function MetricCard({ title, value, trend, trendUp, icon }: MetricCardProps) {
  const isNeutral = trend === 'Baseline stable' || trend === 'No active alerts' || trend === 'No active anomalies' || trend === 'Baseline quiet';

  return (
    <div className="card metric-card" style={{ padding: '1.1rem 1.15rem', background: 'rgba(255,255,255,.92)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.75rem' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '.67rem', fontWeight: 800, letterSpacing: '.07em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {title}
          </p>
          <p style={{ fontSize: '1.7rem', lineHeight: 1.05, fontWeight: 800, color: 'var(--text-primary)', marginTop: '.55rem', letterSpacing: '-.035em' }}>
            {value}
          </p>
        </div>

        <div style={{
          width: 40,
          height: 40,
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 12,
          background: 'linear-gradient(145deg, #f4f9fc, #eaf3f8)',
          border: '1px solid rgba(8,126,164,.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9)',
        }}>
          {icon}
        </div>
      </div>

      <div style={{
        marginTop: '.85rem',
        paddingTop: '.7rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '.3rem',
        minHeight: 25,
      }}>
        {isNeutral ? (
          <Minus size={14} color="var(--text-muted)" />
        ) : trendUp ? (
          <ArrowUpRight size={14} color="var(--critical)" />
        ) : (
          <ArrowDownRight size={14} color="var(--positive)" />
        )}
        <span style={{
          fontSize: '.72rem',
          fontWeight: 700,
          color: isNeutral ? 'var(--text-secondary)' : trendUp ? 'var(--critical)' : 'var(--positive)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {trend}
        </span>
      </div>
    </div>
  );
}
