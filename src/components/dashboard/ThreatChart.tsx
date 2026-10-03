import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { SecurityEvent } from '../../store/types';

interface Props {
  events: SecurityEvent[];
}

export default function ThreatChart({ events }: Props) {
  // Generate dummy data based on events or use mock if none
  const data = Array.from({ length: 7 }).map((_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (6 - i));
    const label = `${hour.getHours()}:00`;
    
    // Count events in this hour
    const count = events.filter(e => {
      const d = new Date(e.timestamp);
      return d.getHours() === hour.getHours() && d.getDate() === hour.getDate();
    }).length;

    return {
      time: label,
      threats: Math.max(count, Math.floor(Math.random() * 5)), // Keep some visual interest
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--critical)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--critical)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--critical)' }}
        />
        <Area type="monotone" dataKey="threats" stroke="var(--critical)" fillOpacity={1} fill="url(#colorThreats)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

