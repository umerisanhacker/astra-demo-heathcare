import { useState } from 'react';
import { useIncidents, useEvents } from '../store/store';
import { Shield, AlertTriangle, ChevronRight, Activity, Users, Database } from 'lucide-react';
import type { CorrelatedIncident } from '../store/types';

export default function Incidents() {
  const incidents = useIncidents();
  const events = useEvents();
  const [selectedIncident, setSelectedIncident] = useState<CorrelatedIncident | null>(null);

  if (selectedIncident) {
    const incidentEvents = events.filter(e => selectedIncident.eventIds.includes(e.id));
    return (
      <div className="space-y-6 animate-fade-in">
        <button 
          onClick={() => setSelectedIncident(null)}
          className="text-sm text-[var(--accent-primary)] hover:underline mb-4 flex items-center"
        >
          &larr; Back to Incidents
        </button>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{selectedIncident.title}</h2>
          <div className="flex gap-4 mb-6 text-sm text-[var(--text-secondary)]">
            <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">{selectedIncident.severity.toUpperCase()}</span>
            <span>Status: {selectedIncident.status}</span>
            <span>Score: {selectedIncident.riskScore}</span>
          </div>
          <p className="text-[var(--text-secondary)] mb-6">{selectedIncident.description}</p>
          
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Evidence Events</h3>
          <div className="space-y-4">
            {incidentEvents.map(e => (
              <div key={e.id} className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-[var(--text-primary)]">{e.title}</span>
                  <span className="text-xs text-[var(--text-muted)]">{new Date(e.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Incident Management</h1>
      <div className="grid gap-4">
        {incidents.map(inc => (
          <div 
            key={inc.id} 
            className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover-lift cursor-pointer flex justify-between items-center"
            onClick={() => setSelectedIncident(inc)}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={`h-5 w-5 ${inc.severity === 'critical' ? 'text-[var(--critical)]' : 'text-[var(--warning)]'}`} />
                <span className="font-semibold text-[var(--text-primary)]">{inc.title}</span>
              </div>
              <div className="text-sm text-[var(--text-secondary)] flex gap-4">
                <span>ID: {inc.id}</span>
                <span>User: {inc.affectedUserId}</span>
                <span>Score: {inc.riskScore}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

