import { useEvents } from '../store/store';
import { selectEventsByCategory } from '../store/selectors';
import { Network, Server, Shield, Activity, Database } from 'lucide-react';

export default function NetworkView() {
  const events = useEvents();
  const networkEvents = selectEventsByCategory(events, 'network');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Network Security</h1>
      
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 h-80 relative overflow-hidden flex items-center justify-center">
        {/* Simple Network Diagram visualization using SVG */}
        <svg className="absolute inset-0 w-full h-full">
          <line x1="10%" y1="50%" x2="30%" y2="50%" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4" />
          <line x1="30%" y1="50%" x2="60%" y2="50%" stroke="var(--border-color)" strokeWidth="2" />
          <line x1="60%" y1="50%" x2="90%" y2="50%" stroke="var(--border-color)" strokeWidth="2" />
        </svg>
        
        <div className="relative w-full h-full flex items-center justify-between px-[10%]">
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full animate-pulse-slow">
              <Network className="h-8 w-8 text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">Internet</span>
          </div>
          <div className="flex flex-col items-center gap-2 z-10">
            <div className={`p-4 rounded-full border ${networkEvents.length > 0 ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-[var(--bg-tertiary)] border-[var(--border-color)]'}`}>
              <Shield className={`h-8 w-8 ${networkEvents.length > 0 ? 'text-red-500' : 'text-[var(--text-secondary)]'}`} />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">Firewall</span>
          </div>
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full">
              <Server className="h-8 w-8 text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">App Servers</span>
          </div>
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full">
              <Database className="h-8 w-8 text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">EHR Database</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] font-medium text-[var(--text-primary)]">
          Network Anomalies
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {networkEvents.length === 0 ? (
            <div className="p-4 text-[var(--text-secondary)]">No network anomalies detected.</div>
          ) : networkEvents.map(e => (
            <div key={e.id} className="p-4 flex items-start gap-4 hover:bg-[var(--bg-tertiary)] transition-colors">
              <Activity className="h-5 w-5 text-[var(--warning)] mt-1" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">{e.title}</p>
                <p className="text-sm text-[var(--text-secondary)]">{e.description}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{new Date(e.timestamp).toLocaleString()} • System: {e.system}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

