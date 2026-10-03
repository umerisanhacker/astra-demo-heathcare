import type { SecurityEvent } from '../../store/types';
import { Shield, AlertTriangle, Key, Network, Mail, Activity, Link } from 'lucide-react';

interface Props {
  events: SecurityEvent[];
}

export default function RecentEvents({ events }: Props) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'identity': return <Key className="h-4 w-4 text-[var(--warning)]" />;
      case 'network': return <Network className="h-4 w-4 text-blue-500" />;
      case 'email': return <Mail className="h-4 w-4 text-[var(--accent-primary)]" />;
      case 'ehr': return <Activity className="h-4 w-4 text-purple-500" />;
      case 'linkguard': return <Link className="h-4 w-4 text-[var(--critical)]" />;
      default: return <Shield className="h-4 w-4 text-[var(--text-secondary)]" />;
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Events</h2>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-sm">No recent events.</p>
        ) : events.map(e => (
          <div key={e.id} className="flex gap-3 hover-lift p-2 rounded-lg transition-all">
            <div className="mt-1 shrink-0 p-2 bg-[var(--bg-tertiary)] rounded-lg">
              {e.severity === 'critical' ? <AlertTriangle className="h-4 w-4 text-[var(--critical)] animate-pulse" /> : getIcon(e.category)}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{e.title}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{new Date(e.timestamp).toLocaleTimeString()} • {e.system}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

