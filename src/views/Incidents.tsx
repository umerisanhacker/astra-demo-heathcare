import { useState } from 'react';
import { 
  useIncidents, 
  useEvents, 
  useStore, 
  useSelectIncident, 
  useUpdateIncidentStatus,
  useAddIncidentNote,
  useFlagUser,
  useIsolateDevice,
  useQuarantineEmail
} from '../store/store';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  User, 
  Check, 
  Plus, 
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Mail
} from 'lucide-react';
import type { IncidentStatus } from '../store/types';

export default function Incidents() {
  const incidents = useIncidents();
  const events = useEvents();
  const { state } = useStore();
  const selectIncident = useSelectIncident();
  const updateStatus = useUpdateIncidentStatus();
  const addNote = useAddIncidentNote();
  const flagUser = useFlagUser();
  const isolateDevice = useIsolateDevice();
  const quarantineEmail = useQuarantineEmail();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newNoteText, setNewNoteText] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Selected incident ID from state or local
  const activeIncident = incidents.find(i => i.id === state.selectedIncidentId) || null;

  const filteredIncidents = incidents.filter(i => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return i.status === 'active' || i.status === 'investigating' || i.status === 'new';
    if (filterStatus === 'resolved') return i.status === 'resolved' || i.status === 'contained';
    return i.status === filterStatus;
  });

  const handleAction = (actionName: string, execute: () => void) => {
    execute();
    setActionFeedback(`Simulated Action Executed: ${actionName}`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeIncident) return;
    addNote(activeIncident.id, newNoteText.trim(), 'SOC Lead (Investigator)');
    setNewNoteText('');
  };

  // Detailed Investigation Workspace
  if (activeIncident) {
    const incidentEvents = events.filter(e => activeIncident.eventIds.includes(e.id))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const incidentUserId = activeIncident.affectedUserId;
    const relatedIdentityEvent = incidentEvents.find(e => e.category === 'identity' && e.userId === incidentUserId);
    const relatedNetworkEvent = incidentEvents.find(e => e.category === 'network' && e.deviceId);
    const derivedDeviceId = relatedNetworkEvent?.deviceId || (
      relatedNetworkEvent?.metadata?.sourceIP
        ? state.devices.find(d => d.ip === String(relatedNetworkEvent.metadata.sourceIP))?.id
        : undefined
    );
    const relatedEmailEvent = incidentEvents.find(e => e.category === 'email');
    const relatedEmail = relatedEmailEvent
      ? state.emails.find(email => relatedEmailEvent.actor && email.recipientName === relatedEmailEvent.actor && email.status !== 'quarantined')
        || state.emails.find(email => email.risk === 'high' || email.risk === 'critical')
      : undefined;

    return (
      <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Back Navigation & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button 
            onClick={() => selectIncident(null)}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Back to Incident Queue
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Incident Lifecycle Status:
            </span>
            <select
              value={activeIncident.status}
              onChange={(e) => updateStatus(activeIncident.id, e.target.value as IncidentStatus)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'white',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="new">NEW</option>
              <option value="active">ACTIVE</option>
              <option value="investigating">INVESTIGATING</option>
              <option value="contained">CONTAINED</option>
              <option value="resolved">RESOLVED</option>
              <option value="escalated">ESCALATED</option>
            </select>
          </div>
        </div>

        {/* Action feedback banner */}
        {actionFeedback && (
          <div style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'var(--positive-bg)',
            border: '1px solid var(--positive)',
            color: 'var(--positive)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <CheckCircle2 size={16} /> {actionFeedback} (Safe Demo Mode)
          </div>
        )}

        {/* Incident Summary Banner */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className={`badge ${activeIncident.severity === 'critical' ? 'bg-critical-light' : 'bg-warning-light'}`} style={{ textTransform: 'uppercase' }}>
                  {activeIncident.severity} Severity
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {activeIncident.id}
                </span>
                <span className="badge bg-accent-light" style={{ textTransform: 'uppercase' }}>
                  {activeIncident.status}
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeIncident.title}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '800px', lineHeight: 1.5 }}>
                {activeIncident.description}
              </p>
            </div>

            <div style={{
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Incident Risk Score
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: activeIncident.riskScore >= 80 ? 'var(--critical)' : 'var(--warning)', lineHeight: 1, marginTop: '0.2rem' }}>
                {activeIncident.riskScore}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Deterministic Correlation
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.85rem',
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Affected Account</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {activeIncident.affectedUserId || 'Unknown'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Affected Clinical Systems</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {activeIncident.affectedSystems.join(', ')}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Assigned Investigator</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {activeIncident.assignedInvestigator || 'SOC Lead Analyst'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Created Timestamp</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {new Date(activeIncident.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Workspace: Left = Evidence & Timeline, Right = Actions & Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Forensic Attack Timeline & Evidence */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Timeline */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Correlated Attack Timeline
                </h3>
                <span className="badge bg-accent-light">{incidentEvents.length} Signals Fused</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                {incidentEvents.map((evt, idx) => (
                  <div key={evt.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: evt.severity === 'critical' ? 'var(--critical)' : 'var(--accent-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}>
                        {idx + 1}
                      </div>
                      {idx < incidentEvents.length - 1 && (
                        <div style={{ width: '2px', height: '40px', backgroundColor: 'var(--border)', margin: '4px 0' }} />
                      )}
                    </div>

                    <div style={{
                      flex: 1,
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {evt.title}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {evt.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>System: <strong>{evt.system}</strong></span>
                        <span>Category: <strong>{evt.category}</strong></span>
                        <span style={{ color: 'var(--critical)', fontWeight: 600 }}>+{evt.riskContribution} Risk</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contributing Risk Factors */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Contributing Signal Attribution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activeIncident.riskFactors.map(rf => (
                  <div key={rf.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {rf.label}
                    </span>
                    <span className="badge bg-critical-light" style={{ fontSize: '0.78rem' }}>
                      +{rf.deduction} Points
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Safe Response Playbooks & Investigation Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Safe Simulated Response Actions */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Safe Response Actions
                </h3>
                <span className="badge bg-accent-light">Simulation</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Execute clinical containment playbooks. Actions modify synthetic in-memory state and commit verification records to the audit ledger.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => derivedDeviceId && handleAction(`Isolate Device ${derivedDeviceId}`, () => isolateDevice(derivedDeviceId))}
                  className="btn btn-outline"
                  disabled={!derivedDeviceId}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--critical)', opacity: derivedDeviceId ? 1 : 0.5 }}
                >
                  <ShieldAlert size={16} /> {derivedDeviceId ? `Isolate Simulated Device (${derivedDeviceId})` : 'No related device signal'}
                </button>

                <button
                  onClick={() => incidentUserId && handleAction('Flag User Account & Enforce Credential Reset', () => flagUser(incidentUserId))}
                  className="btn btn-outline"
                  disabled={!incidentUserId}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: 'var(--warning)', opacity: incidentUserId ? 1 : 0.5 }}
                >
                  <User size={16} /> {incidentUserId ? `Flag Account & Revoke Active Tokens (${incidentUserId})` : 'No affected account'}
                </button>

                <button
                  onClick={() => relatedEmail && handleAction('Quarantine Related Email', () => quarantineEmail(relatedEmail.id))}
                  className="btn btn-outline"
                  disabled={!relatedEmail}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', opacity: relatedEmail ? 1 : 0.5 }}
                >
                  <Mail size={16} /> {relatedEmail ? `Quarantine Related Email (${relatedEmail.id})` : 'No related email'}
                </button>

                <button
                  onClick={() => handleAction('Transition Incident to CONTAINED', () => updateStatus(activeIncident.id, 'contained'))}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem' }}
                >
                  <Check size={16} /> Mark Threat Contained
                </button>

                <button
                  onClick={() => handleAction('Resolve Incident and Recalculate Posture', () => updateStatus(activeIncident.id, 'resolved'))}
                  className="btn btn-primary"
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', backgroundColor: 'var(--positive)' }}
                >
                  <CheckCircle2 size={16} /> Mark Fully Resolved
                </button>
              </div>
            </div>

            {/* Investigation Notes */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MessageSquare size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Investigation Notes ({activeIncident.notes?.length || 0})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
                {activeIncident.notes?.map(note => (
                  <div key={note.id} style={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{note.author}</span>
                      <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {note.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add clinical investigation findings, containment notes, or forensic observations..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-end', fontSize: '0.825rem', padding: '0.45rem 1rem' }}
                >
                  <Plus size={14} /> Add Note
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Incident Queue List View
  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Incident Operations Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Triage, investigate, and contain multi-vector clinical threats correlated across hospital infrastructure.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          padding: '0.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          {['all', 'active', 'investigating', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: filterStatus === status ? 700 : 500,
                color: filterStatus === status ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: filterStatus === status ? 'var(--bg-hover)' : 'transparent',
                borderRadius: '6px',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Cards Queue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredIncidents.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'white' }}>
            <CheckCircle2 size={36} color="var(--positive)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No Incidents Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              No security incidents match the selected filter.
            </p>
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => selectIncident(inc.id)}
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                borderLeft: `4px solid ${inc.severity === 'critical' ? 'var(--critical)' : 'var(--warning)'}`,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className={`badge ${inc.severity === 'critical' ? 'bg-critical-light' : 'bg-warning-light'}`} style={{ textTransform: 'uppercase' }}>
                    {inc.severity}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {inc.id}
                  </span>
                  <span className="badge bg-accent-light" style={{ textTransform: 'uppercase' }}>
                    {inc.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Risk Score
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: inc.riskScore >= 80 ? 'var(--critical)' : 'var(--warning)', lineHeight: 1 }}>
                      {inc.riskScore} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {inc.title}
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {inc.description}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border)',
              }}>
                <div>
                  Affected Account: <strong style={{ color: 'var(--text-primary)' }}>{inc.affectedUserId || 'Unknown'}</strong>
                </div>
                <div>
                  Systems: <strong style={{ color: 'var(--text-primary)' }}>{inc.affectedSystems.join(', ')}</strong>
                </div>
                <div>
                  Signals: <strong style={{ color: 'var(--text-primary)' }}>{inc.eventIds.length} telemetry events</strong>
                </div>
                <div style={{ marginLeft: 'auto', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Open Detailed Investigation Workspace <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
