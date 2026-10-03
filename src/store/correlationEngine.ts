import type { SecurityEvent, CorrelatedIncident, RiskFactor, Severity } from './types';

export function calculateIncidentRisk(eventIds: string[], events: SecurityEvent[]): number {
  const incidentEvents = events.filter(e => eventIds.includes(e.id));
  const score = incidentEvents.reduce((acc, e) => acc + e.riskContribution * 2, 0); // Scaled
  return Math.min(100, score);
}

function determineSeverity(score: number): Severity {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'low';
  return 'info';
}

export function correlateEvents(events: SecurityEvent[], existingIncidents: CorrelatedIncident[]): CorrelatedIncident[] {
  const activeEvents = events.filter(e => (e.status === 'new' || e.status === 'acknowledged') && e.userId);
  
  // Group by userId
  const byUser: Record<string, SecurityEvent[]> = {};
  activeEvents.forEach(e => {
    if (e.userId) {
      if (!byUser[e.userId]) byUser[e.userId] = [];
      byUser[e.userId].push(e);
    }
  });

  const updatedIncidents: CorrelatedIncident[] = [...existingIncidents];

  Object.entries(byUser).forEach(([userId, userEvents]) => {
    const categories = new Set(userEvents.map(e => e.category));
    
    // If events across 2+ categories
    if (categories.size >= 2) {
      const eventIds = userEvents.map(e => e.id);
      
      // Find existing active incident for this user
      const existingIdx = updatedIncidents.findIndex(inc => 
        inc.affectedUserId === userId && inc.status !== 'resolved' && inc.status !== 'contained'
      );

      const riskFactors: RiskFactor[] = userEvents.map(e => ({
        id: `rf-${e.id}`,
        label: e.title,
        deduction: e.riskContribution,
        eventId: e.id,
        category: e.category,
      }));

      const riskScore = calculateIncidentRisk(eventIds, events);
      const severity = determineSeverity(riskScore);
      const systems = Array.from(new Set(userEvents.map(e => e.system)));

      if (existingIdx >= 0) {
        // Update existing
        const inc = updatedIncidents[existingIdx];
        updatedIncidents[existingIdx] = {
          ...inc,
          eventIds: Array.from(new Set([...inc.eventIds, ...eventIds])),
          affectedSystems: Array.from(new Set([...inc.affectedSystems, ...systems])),
          riskScore,
          severity,
          riskFactors,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Create new
        const newInc: CorrelatedIncident = {
          id: `INC-${Date.now()}`,
          title: `Multi-Vector Threat Detected`,
          severity,
          status: 'active',
          affectedUserId: userId,
          affectedSystems: systems,
          eventIds,
          riskScore,
          riskFactors,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          description: `Correlated events across ${categories.size} categories.`
        };
        updatedIncidents.push(newInc);
      }
    }
  });

  return updatedIncidents;
}

