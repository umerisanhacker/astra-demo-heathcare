import type { SecurityEvent, CorrelatedIncident, AuditEvent, AppNotification } from './types';

export type Action =
  | { type: 'ADD_EVENT'; payload: SecurityEvent }
  | { type: 'ADD_EVENTS'; payload: SecurityEvent[] }
  | { type: 'ADD_AUDIT'; payload: AuditEvent }
  | { type: 'ADD_AUDITS'; payload: AuditEvent[] }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'SET_INCIDENTS'; payload: CorrelatedIncident[] }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'SET_ATTACK_CHAIN_PROGRESS'; payload: number }
  | { type: 'SET_RUNNING_CHAIN'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'RECALCULATE_POSTURE' };

