import type { 
  SimulatedUser, 
  SimulatedDevice, 
  SecurityEvent, 
  CorrelatedIncident, 
  AuditEvent, 
  AppNotification, 
  SecurityPosture 
} from './types';

const now = new Date();
const todayDate = now.toISOString().split('T')[0];

export const initialUsers: SimulatedUser[] = [
  { id: 'dr.sarah', name: 'Dr. Sarah Wilson', role: 'Attending Physician', department: 'Cardiology', email: 'sarah.wilson@hospital.org' },
  { id: 'dr.chen', name: 'Dr. Marcus Chen', role: 'Chief of Radiology', department: 'Radiology', email: 'marcus.chen@hospital.org' },
  { id: 'dr.emily', name: 'Dr. Emily Carter', role: 'ER Resident', department: 'Emergency', email: 'emily.carter@hospital.org' },
];

export const initialDevices: SimulatedDevice[] = [
  { id: 'dev-001', name: 'Hospital Workstation 04', type: 'Desktop', ip: '10.0.5.42', known: true },
  { id: 'dev-002', name: 'Laptop-Marcus-01', type: 'Laptop', ip: '10.0.8.15', known: true },
  { id: 'dev-003', name: 'Unknown-Device-External', type: 'Mobile', ip: '192.168.1.100', known: false },
  { id: 'dev-004', name: 'iOS-Unknown-889', type: 'Mobile', ip: '172.16.0.50', known: false },
];

export const initialEvents: SecurityEvent[] = [
  {
    id: 'evt-1',
    timestamp: `${todayDate}T07:15:00Z`,
    eventType: 'SUSPICIOUS_LINK',
    category: 'linkguard',
    severity: 'high',
    title: 'Suspicious Link Clicked',
    description: 'User clicked on a link classified as suspicious.',
    source: 'Email Gateway',
    userId: 'dr.sarah',
    system: 'Office365',
    status: 'new',
    riskContribution: 7,
    relatedIncidentId: 'INC-001',
    metadata: { url: 'http://secure-update-portal-hospital.com' },
  },
  {
    id: 'evt-2',
    timestamp: `${todayDate}T07:30:00Z`,
    eventType: 'UNKNOWN_DEVICE',
    category: 'identity',
    severity: 'medium',
    title: 'Login from Unknown Device',
    description: 'Successful login from an unrecognized device.',
    source: 'IAM Provider',
    userId: 'dr.sarah',
    deviceId: 'dev-003',
    system: 'EHR System',
    status: 'new',
    riskContribution: 4,
    relatedIncidentId: 'INC-001',
    metadata: { location: 'External IP' },
  },
  {
    id: 'evt-3',
    timestamp: `${todayDate}T08:05:00Z`,
    eventType: 'EHR_BULK_ACCESS',
    category: 'ehr',
    severity: 'critical',
    title: 'Bulk EHR Access Detected',
    description: 'User accessed an unusually high number of patient records in a short time.',
    source: 'EHR Audit Log',
    userId: 'dr.sarah',
    system: 'EHR System',
    status: 'new',
    riskContribution: 12,
    relatedIncidentId: 'INC-001',
    metadata: { recordsAccessed: 50 },
  },
  {
    id: 'evt-4',
    timestamp: `${todayDate}T09:00:00Z`,
    eventType: 'EHR_ACCESS',
    category: 'ehr',
    severity: 'high',
    title: 'Off-hours EHR Access',
    description: 'EHR accessed outside of typical working hours for this user.',
    source: 'EHR Audit Log',
    userId: 'dr.chen',
    system: 'EHR System',
    status: 'new',
    riskContribution: 7,
    relatedIncidentId: 'INC-002',
    metadata: { accessTime: '09:00:00Z' },
  },
];

export const initialIncidents: CorrelatedIncident[] = [
  {
    id: 'INC-001',
    title: 'Possible Account Compromise',
    severity: 'critical',
    status: 'active',
    affectedUserId: 'dr.sarah',
    affectedSystems: ['Office365', 'EHR System'],
    eventIds: ['evt-1', 'evt-2', 'evt-3'],
    riskScore: 82,
    riskFactors: [
      { id: 'rf-1', label: 'Suspicious Link', deduction: 7, eventId: 'evt-1', category: 'linkguard' },
      { id: 'rf-2', label: 'Unknown Device', deduction: 4, eventId: 'evt-2', category: 'identity' },
      { id: 'rf-3', label: 'Bulk EHR Access', deduction: 12, eventId: 'evt-3', category: 'ehr' },
    ],
    createdAt: `${todayDate}T08:10:00Z`,
    updatedAt: `${todayDate}T08:10:00Z`,
    description: 'User clicked suspicious link, followed by login from unknown device and bulk EHR access.'
  },
  {
    id: 'INC-002',
    title: 'Suspicious EHR Access Pattern',
    severity: 'high',
    status: 'active',
    affectedUserId: 'dr.chen',
    affectedSystems: ['EHR System'],
    eventIds: ['evt-4'],
    riskScore: 61,
    riskFactors: [
      { id: 'rf-4', label: 'Off-hours EHR Access', deduction: 7, eventId: 'evt-4', category: 'ehr' },
    ],
    createdAt: `${todayDate}T09:05:00Z`,
    updatedAt: `${todayDate}T09:05:00Z`,
    description: 'User accessed EHR outside normal hours.'
  },
];

export const initialAuditLog: AuditEvent[] = [
  { id: 'aud-1', timestamp: `${todayDate}T07:15:00Z`, actor: 'dr.sarah', system: 'Office365', action: 'Clicked Link', outcome: 'success', relatedEventId: 'evt-1' },
  { id: 'aud-2', timestamp: `${todayDate}T07:30:00Z`, actor: 'dr.sarah', system: 'EHR System', action: 'Login', outcome: 'success', relatedEventId: 'evt-2' },
];

export const initialNotifications: AppNotification[] = [
  { id: 'not-1', title: 'New Critical Incident', message: 'INC-001 created for dr.sarah', timestamp: `${todayDate}T08:10:00Z`, read: false, severity: 'critical', relatedIncidentId: 'INC-001' },
];

export const initialPosture: SecurityPosture = {
  score: 70,
  label: 'Fair',
  categoryScores: { email: 100, identity: 96, network: 100, ehr: 81, system: 100, linkguard: 93 },
  riskFactors: initialIncidents[0].riskFactors,
  lastCalculated: `${todayDate}T09:10:00Z`,
};

