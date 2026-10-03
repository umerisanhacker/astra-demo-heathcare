import { Shield, AlertTriangle, Users, Network } from 'lucide-react';
import { useStore, useEvents, useIncidents, usePosture } from '../store/store';
import { selectRecentEvents } from '../store/selectors';
import MetricCard from '../components/dashboard/MetricCard';
import ThreatChart from '../components/dashboard/ThreatChart';
import SecurityPosture from '../components/dashboard/SecurityPosture';
import CriticalIncident from '../components/dashboard/CriticalIncident';
import RecentEvents from '../components/dashboard/RecentEvents';

export default function Overview() {
  const { state } = useStore();
  const events = useEvents();
  const incidents = useIncidents();
  const posture = usePosture();

  const activeIncidentsCount = incidents.filter(i => i.status === 'active').length;
  const alertCount = events.filter(e => e.status === 'new').length;
  const identityCount = events.filter(e => e.category === 'identity').length;
  const networkCount = events.filter(e => e.category === 'network').length;

  const criticalIncident = incidents.find(i => i.severity === 'critical' && i.status === 'active');
  const recentEvents = selectRecentEvents(events, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Incidents"
          value={activeIncidentsCount}
          trend="+2"
          trendUp={true}
          icon={<AlertTriangle className="h-6 w-6 text-[var(--critical)]" />}
        />
        <MetricCard
          title="Active Alerts"
          value={alertCount}
          trend="-14%"
          trendUp={false}
          icon={<Shield className="h-6 w-6 text-[var(--accent-primary)]" />}
        />
        <MetricCard
          title="Identity Anomalies"
          value={identityCount}
          trend="+5"
          trendUp={true}
          icon={<Users className="h-6 w-6 text-[var(--warning)]" />}
        />
        <MetricCard
          title="Network Events"
          value={networkCount}
          trend="-2%"
          trendUp={false}
          icon={<Network className="h-6 w-6 text-[var(--accent-secondary)]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {criticalIncident && <CriticalIncident incident={criticalIncident} />}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Threat Activity</h2>
            <div className="h-80">
              <ThreatChart events={events} />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <SecurityPosture posture={posture} />
          <RecentEvents events={recentEvents} />
        </div>
      </div>
    </div>
  );
}

