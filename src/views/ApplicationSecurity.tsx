import { useEvents, useSelectIncident, useSetCurrentView } from '../store/store';
import { ArrowRight } from 'lucide-react';

export default function ApplicationSecurity() {
  const events = useEvents();
  const selectIncident = useSelectIncident();
  const setCurrentView = useSetCurrentView();

  const appEvents = events.filter(e => e.category === 'application');

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Application Security Monitoring
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Real-time API gateway telemetry, parameter tampering detection, and FHIR endpoint abuse monitoring.
        </p>
      </div>

      {/* Feature Spotlight */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="badge bg-critical-light" style={{ marginBottom: '0.35rem' }}>
              CRITICAL API TELEMETRY
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Endpoint Abuse: /synthetic-api/patient-records
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Source Ingress: 10.0.0.45 (Forwarded from Rogue VPN Client)
            </div>
          </div>

          <button
            onClick={() => {
              selectIncident('INC-001');
              setCurrentView('Incidents');
            }}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            Correlate with Incident INC-001 <ArrowRight size={15} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-main)',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          fontSize: '0.825rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            API Method: <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>GET (Bulk Enumeration)</strong>
          </div>
          <div>
            Target Resource: <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>FHIR Patient Bundle</strong>
          </div>
          <div>
            Rate Anomaly: <strong style={{ color: 'var(--critical)', display: 'block', marginTop: '2px' }}>47 requests / 90s</strong>
          </div>
          <div>
            Authorization Header: <strong style={{ color: 'var(--warning)', display: 'block', marginTop: '2px' }}>Stolen Bearer Token (dr.sarah)</strong>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            Cross-Signal Synthesis:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent-primary)' }}>•</span>
            <strong>Identity Link:</strong> Token matches credentials harvested via Look-alike Phishing Link.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent-primary)' }}>•</span>
            <strong>Network Link:</strong> Source IP 10.0.0.45 corresponds to Port Scan reconnaissance telemetry.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent-primary)' }}>•</span>
            <strong>EHR Link:</strong> Rapid automated scraping triggered bulk patient chart access velocity tripwire.
          </div>
        </div>
      </div>

      {/* Application Telemetry Events Table */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Clinical API Gateway Activity ({appEvents.length})
        </h3>

        {appEvents.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No anomalous application gateway probes detected.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {appEvents.map(e => (
              <div key={e.id} style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{e.title}</span>
                    <span className="badge bg-critical-light">{e.severity.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.description}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Endpoint: {String(e.metadata.endpoint || '/synthetic-api/patient-records')} • System: {e.system}
                  </div>
                </div>

                <button
                  onClick={() => {
                    selectIncident('INC-001');
                    setCurrentView('Incidents');
                  }}
                  className="btn btn-outline"
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                >
                  View in Timeline <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
