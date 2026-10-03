import type { SecurityEvent, RiskFactor, SecurityPosture, Category } from './types';

const BASE_SCORE = 100;

export function calculateRiskFactors(events: SecurityEvent[]): RiskFactor[] {
  return events
    .filter(e => e.status === 'new' || e.status === 'acknowledged')
    .map(e => ({
      id: `rf-${e.id}`,
      label: e.title,
      deduction: e.riskContribution,
      eventId: e.id,
      category: e.category,
    }));
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

export function calculatePosture(events: SecurityEvent[]): SecurityPosture {
  const activeEvents = events.filter(e => e.status === 'new' || e.status === 'acknowledged');
  
  const categoryScores: Record<Category, number> = {
    email: 100, identity: 100, network: 100, ehr: 100, system: 100, linkguard: 100
  };

  let totalDeduction = 0;
  const riskFactors: RiskFactor[] = [];

  activeEvents.forEach(e => {
    totalDeduction += e.riskContribution;
    categoryScores[e.category] = Math.max(0, categoryScores[e.category] - e.riskContribution);
    riskFactors.push({
      id: `rf-${e.id}`,
      label: e.title,
      deduction: e.riskContribution,
      eventId: e.id,
      category: e.category,
    });
  });

  const score = Math.max(0, BASE_SCORE - totalDeduction);

  return {
    score,
    label: getScoreLabel(score),
    categoryScores,
    riskFactors,
    lastCalculated: new Date().toISOString(),
  };
}

