import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import type { SecurityEvent } from '../../store/types';

interface Props {
  events: SecurityEvent[];
}

export default function ThreatChart({ events }: Props) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  const chartData = useMemo(() => {
    if (timeframe === '24h') {
      // 6 time buckets across 24h
      return [
        { time: '00:00', email: 2, identity: 1, network: 4, ehr: 0 },
        { time: '04:00', email: 1, identity: 3, network: 6, ehr: 1 },
        { time: '08:00', email: 5, identity: 2, network: 3, ehr: 2 },
        { time: '12:00', email: 8, identity: 4, network: 7, ehr: 5 },
        { time: '16:00', email: 6, identity: 3, network: 5, ehr: 3 },
        { time: '20:00', email: 3, identity: 2, network: 4, ehr: 2 },
      ].map((pt, idx) => {
        return {
          ...pt,
          email: pt.email + (idx === 3 ? Math.min(6, events.filter(e => e.category === 'email').length) : 0),
          identity: pt.identity + (idx === 4 ? Math.min(5, events.filter(e => e.category === 'identity').length) : 0),
          network: pt.network + (idx === 3 ? Math.min(4, events.filter(e => e.category === 'network').length) : 0),
          ehr: pt.ehr + (idx === 4 ? Math.min(7, events.filter(e => e.category === 'ehr').length) : 0),
        };
      });
    } else if (timeframe === '7d') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
      return days.map((day, idx) => ({
        time: day,
        email: 12 + idx * 2 + (idx === 6 ? events.filter(e => e.category === 'email').length : 0),
        identity: 8 + idx * 3 + (idx === 6 ? events.filter(e => e.category === 'identity').length : 0),
        network: 15 + idx * 2,
        ehr: 6 + idx * 4 + (idx === 6 ? events.filter(e => e.category === 'ehr').length : 0),
      }));
    } else {
      // 30 days
      return [
        { time: 'Week 1', email: 45, identity: 28, network: 62, ehr: 19 },
        { time: 'Week 2', email: 58, identity: 34, network: 71, ehr: 24 },
        { time: 'Week 3', email: 62, identity: 41, network: 80, ehr: 38 },
        { time: 'Week 4', email: 78, identity: 49, network: 94, ehr: 52 },
      ];
    }
  }, [timeframe, events]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with Timeframe toggles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Threat Activity Telemetry
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Multi-vector signal rates across synthetic hospital infrastructure
          </div>
        </div>

        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-main)',
          padding: '0.2rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          {(['24h', '7d', '30d'] as const).map(tf => {
            const active = timeframe === tf;
            const label = tf === '24h' ? 'Last 24 Hours' : tf === '7d' ? 'Last 7 Days' : 'Last 30 Days';
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'white' : 'transparent',
                  borderRadius: '6px',
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Multi-Area Visualization */}
      <div style={{ flex: 1, minHeight: '260px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEHR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--critical)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--critical)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIdentity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--warning)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--warning)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderColor: 'var(--border)', 
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
                fontSize: '0.8rem',
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '0.8rem', paddingBottom: '8px' }}
            />
            <Area 
              type="monotone" 
              name="EHR Anomalies" 
              dataKey="ehr" 
              stroke="var(--critical)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEHR)" 
            />
            <Area 
              type="monotone" 
              name="Identity Anomalies" 
              dataKey="identity" 
              stroke="var(--accent-primary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorIdentity)" 
            />
            <Area 
              type="monotone" 
              name="Email Threats" 
              dataKey="email" 
              stroke="var(--warning)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEmail)" 
            />
            <Area 
              type="monotone" 
              name="Network Threats" 
              dataKey="network" 
              stroke="var(--accent-secondary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorNetwork)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
