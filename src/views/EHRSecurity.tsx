import { useEvents } from '../store/store';
import { selectEventsByCategory } from '../store/selectors';
import { Database, Key } from 'lucide-react';

export default function EHRSecurity() {
  const events = useEvents();
  const ehrEvents = selectEventsByCategory(events, 'ehr');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">EHR Security</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] font-medium text-[var(--text-primary)] flex justify-between items-center">
            <span>Suspicious Access Patterns</span>
            <Database className="h-5 w-5 text-[var(--accent-primary)]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] text-sm text-[var(--text-secondary)]">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Actor</th>
                  <th className="p-4 font-medium">Event Type</th>
                  <th className="p-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {ehrEvents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-[var(--text-secondary)]">No EHR anomalies detected.</td>
                  </tr>
                ) : ehrEvents.map(e => (
                  <tr key={e.id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="p-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">{new Date(e.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4 text-sm text-[var(--text-primary)] font-medium">{e.userId || 'Unknown'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${e.severity === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {e.title}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-6 w-6 text-[var(--warning)]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Break-Glass Access</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Monitor emergency "break-glass" access to patient records which bypasses normal access controls.
            </p>
            <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg flex items-center justify-between border border-[var(--border-color)]">
              <span className="text-sm font-medium text-[var(--text-primary)]">Active Break-Glass Sessions</span>
              <span className="text-xl font-bold text-[var(--warning)]">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

