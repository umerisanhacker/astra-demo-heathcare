import type { CorrelatedIncident } from '../../store/types';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useEvents } from '../../store/store';

interface Props {
  incident: CorrelatedIncident;
}

export default function CriticalIncident({ incident }: Props) {
  const events = useEvents();
  const incidentEvents = events.filter(e => incident.eventIds.includes(e.id)).slice(0, 3); // show up to 3

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 relative overflow-hidden animate-pulse-slow">
      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--critical)]"></div>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-[var(--critical)]" />
          <h2 className="text-xl font-bold text-[var(--critical)]">Critical Incident: {incident.title}</h2>
        </div>
        <span className="text-sm font-medium bg-[var(--critical)] text-white px-3 py-1 rounded-full">
          Score: {incident.riskScore}
        </span>
      </div>
      
      <p className="mt-4 text-sm text-[var(--text-primary)]">User Affected: <span className="font-semibold">{incident.affectedUserId}</span></p>
      
      <div className="mt-6 flex flex-col md:flex-row gap-4 items-start md:items-center text-sm text-[var(--text-secondary)]">
        {incidentEvents.map((e, idx) => (
          <div key={e.id} className="flex items-center gap-4">
            <div className="bg-[var(--bg-tertiary)] p-3 rounded-lg border border-[var(--border-color)]">
              <span className="font-medium text-[var(--text-primary)] block">{e.title}</span>
              <span className="text-xs">{new Date(e.timestamp).toLocaleTimeString()}</span>
            </div>
            {idx < incidentEvents.length - 1 && <ArrowRight className="h-4 w-4 text-[var(--text-muted)] hidden md:block" />}
          </div>
        ))}
      </div>
    </div>
  );
}

