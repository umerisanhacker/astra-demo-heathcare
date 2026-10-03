import { useState } from 'react';
import { useEvents } from '../store/store';
import { selectEventsByCategory } from '../store/selectors';
import { Mail, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function EmailSecurity() {
  const events = useEvents();
  const emailEvents = selectEventsByCategory(events, 'email');
  const [quarantined, setQuarantined] = useState<Set<string>>(new Set());

  const handleQuarantine = (id: string) => {
    setQuarantined(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Email Security</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <Mail className="h-8 w-8 text-[var(--accent-primary)]" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Events</p>
              <p className="text-2xl font-bold">{emailEvents.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] font-medium text-[var(--text-primary)]">
          Recent Email Threats
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {emailEvents.length === 0 ? (
            <div className="p-4 text-[var(--text-secondary)]">No email events detected.</div>
          ) : emailEvents.map(e => (
            <div key={e.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition-colors">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{e.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{e.description} • {new Date(e.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
              <div>
                {quarantined.has(e.id) ? (
                  <span className="flex items-center text-[var(--success)] text-sm font-medium gap-1">
                    <ShieldCheck className="h-4 w-4" /> Quarantined
                  </span>
                ) : (
                  <button 
                    onClick={() => handleQuarantine(e.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)] hover:text-white rounded text-sm transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4" /> Quarantine
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

