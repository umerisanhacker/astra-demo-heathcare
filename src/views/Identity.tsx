import { useStore } from '../store/store';
import { selectEventsByCategory } from '../store/selectors';
import { Users, UserX, UserCheck, ShieldAlert } from 'lucide-react';

export default function Identity() {
  const { state } = useStore();
  const identityEvents = selectEventsByCategory(state.events, 'identity');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Identity & Access</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-[var(--accent-primary)]" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Monitored Users</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{state.users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <ShieldAlert className="h-8 w-8 text-[var(--warning)]" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Identity Anomalies</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{identityEvents.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] font-medium text-[var(--text-primary)]">
            User Risk Directory
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {state.users.map(u => {
              const userEvents = identityEvents.filter(e => e.userId === u.id);
              const hasRisk = userEvents.length > 0;
              return (
                <div key={u.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition-colors">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{u.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{u.role} • {u.department}</p>
                  </div>
                  {hasRisk ? <UserX className="h-5 w-5 text-[var(--critical)]" /> : <UserCheck className="h-5 w-5 text-[var(--success)]" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] font-medium text-[var(--text-primary)]">
            Recent Identity Events
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {identityEvents.length === 0 ? (
              <div className="p-4 text-[var(--text-secondary)]">No events found.</div>
            ) : identityEvents.map(e => (
              <div key={e.id} className="p-4 flex flex-col gap-1 hover:bg-[var(--bg-tertiary)] transition-colors">
                <div className="flex justify-between">
                  <span className="font-medium text-[var(--text-primary)]">{e.title}</span>
                  <span className="text-xs text-[var(--text-muted)]">{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">User: {e.userId || 'Unknown'} • Device: {e.deviceId || 'Unknown'}</span>
                <span className="text-sm text-[var(--text-muted)]">{e.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

