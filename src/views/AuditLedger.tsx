import { useStore } from '../store/store';
import { Search } from 'lucide-react';

export default function AuditLedger() {
  const { state } = useStore();
  
  // Sort newest first
  const sortedAudit = [...state.auditLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Ledger</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search audit logs..."
            className="pl-9 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)]"
          />
        </div>
      </div>
      
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] text-sm text-[var(--text-secondary)]">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Actor</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">System</th>
                <th className="p-4 font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {sortedAudit.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[var(--text-secondary)]">No audit records found.</td>
                </tr>
              ) : sortedAudit.map(log => (
                <tr key={log.id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="p-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-sm font-medium text-[var(--text-primary)]">{log.actor}</td>
                  <td className="p-4 text-sm text-[var(--text-primary)]">{log.action}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">{log.system}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.outcome === 'success' ? 'bg-green-500/10 text-green-500' :
                      log.outcome === 'failed' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {log.outcome.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

