export type EventType = 
  | 'EMAIL_RECEIVED' | 'PHISHING_DETECTED' | 'SUSPICIOUS_LINK' | 'ATTACHMENT_ANALYZED'
  | 'FAILED_LOGIN' | 'UNUSUAL_LOGIN' | 'UNKNOWN_DEVICE' | 'CREDENTIAL_COMPROMISE'
  | 'PORT_SCAN' | 'BRUTE_FORCE' | 'SUSPICIOUS_OUTBOUND'
  | 'EHR_ACCESS' | 'EHR_BULK_ACCESS'
  | 'INCIDENT_CREATED' | 'AUDIT_ACTION' | 'SIMULATION_TRIGGERED';

export type Category = 'email' | 'identity' | 'network' | 'ehr' | 'system' | 'linkguard';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type IncidentStatus = 'active' | 'investigating' | 'contained' | 'resolved';
export type EventStatus = 'new' | 'acknowledged' | 'resolved' | 'false_positive';

export interface SimulatedUser {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
}

export interface SimulatedDevice {
  id: string;
  name: string;
  type: string;
  ip: string;
  known: boolean;
}

export interface SecurityEvent {
  id: string;
  timestamp: string; // ISO string
  eventType: EventType;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  source: string;
  actor?: string;
  userId?: string;
  deviceId?: string;
  system: string;
  status: EventStatus;
  riskContribution: number; // 0-20 points deducted from base score
  relatedIncidentId?: string;
  metadata: Record<string, string | number | boolean>;
}

export interface RiskFactor {
  id: string;
  label: string;
  deduction: number;
  eventId: string;
  category: Category;
}

export interface CorrelatedIncident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  affectedUserId?: string;
  affectedSystems: string[];
  eventIds: string[];
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  system: string;
  action: string;
  outcome: 'success' | 'failed' | 'warning';
  relatedEventId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: Severity;
  relatedEventId?: string;
  relatedIncidentId?: string;
}

export interface SecurityPosture {
  score: number; // 0-100, derived
  label: string; // 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical'
  categoryScores: Record<Category, number>;
  riskFactors: RiskFactor[];
  lastCalculated: string;
}

export interface AppState {
  currentView: string;
  events: SecurityEvent[];
  incidents: CorrelatedIncident[];
  auditLog: AuditEvent[];
  notifications: AppNotification[];
  users: SimulatedUser[];
  devices: SimulatedDevice[];
  securityPosture: SecurityPosture;
  attackChainProgress: number; // 0-14 steps
  isRunningChain: boolean;
  searchQuery: string;
}

