import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Mail, Link as LinkIcon, ShieldAlert, Activity, Users, Network } from 'lucide-react';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface SecurityEvent {
  id: string;
  type: string;
  title: string;
  source: string;
  time: string;
  severity: Severity;
  icon: LucideIcon;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  riskScore: number;
  account: string;
  systems: string[];
  status: 'Investigating' | 'Contained' | 'Resolved';
  events: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  system: string;
  action: string;
  outcome: 'Success' | 'Failed';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: Severity;
}

interface SecurityContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  events: SecurityEvent[];
  incidents: Incident[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  simulateAttack: (type: string) => void;
  markNotificationsRead: () => void;
}

const defaultContext: SecurityContextType = {
  currentView: 'Overview',
  setCurrentView: () => {},
  events: [],
  incidents: [],
  auditLogs: [],
  notifications: [],
  simulateAttack: () => {},
  markNotificationsRead: () => {}
};

const SecurityContext = createContext<SecurityContextType>(defaultContext);

export function useSecurity() {
  return useContext(SecurityContext);
}

const initialEvents: SecurityEvent[] = [
  { id: '1', type: 'EHR', title: 'Bulk record access detected', source: 'Account: dr.sarah', time: '09:48', severity: 'critical', icon: Activity },
  { id: '2', type: 'Identity', title: 'Unusual login detected', source: 'Dr. Sarah Wilson', time: '09:45', severity: 'high', icon: ShieldAlert },
  { id: '3', type: 'LinkGuard', title: 'Suspicious URL detected', source: 'Email Security', time: '09:43', severity: 'critical', icon: LinkIcon },
  { id: '4', type: 'Email', title: 'Phishing email detected', source: 'Dr. Sarah Wilson', time: '09:41', severity: 'high', icon: Mail },
  { id: '5', type: 'Network', title: 'Port scan blocked', source: '10.0.0.45', time: '08:12', severity: 'medium', icon: ShieldAlert },
];

const initialIncidents: Incident[] = [
  { id: 'INC-001', title: 'Possible Account Compromise', severity: 'critical', riskScore: 94, account: 'dr.sarah', systems: ['Email', 'Identity', 'Network', 'EHR'], status: 'Investigating', events: 8 },
  { id: 'INC-002', title: 'Suspicious EHR Access', severity: 'high', riskScore: 78, account: 'dr.m.carter', systems: ['EHR', 'Identity'], status: 'Contained', events: 3 },
];

const initialAuditLogs: AuditLog[] = [
  { id: 'AUD-001', timestamp: '09:48:12', actor: 'Correlation Engine', system: 'SOC', action: 'Incident created', outcome: 'Success' },
  { id: 'AUD-002', timestamp: '09:43:05', actor: 'CareSentinel', system: 'LinkGuard', action: 'URL Blocked', outcome: 'Success' },
  { id: 'AUD-003', timestamp: '09:41:22', actor: 'CareSentinel', system: 'Email', action: 'Phishing Flagged', outcome: 'Success' },
];

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState('Overview');
  const [events, setEvents] = useState<SecurityEvent[]>(initialEvents);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'N1', title: 'Critical Incident', message: 'Possible Account Compromise for dr.sarah', time: '09:48', read: false, type: 'critical' },
  ]);

  const simulateAttack = (type: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = Math.random().toString(36).substring(7);
    
    let newEvent: SecurityEvent;
    let newLog: AuditLog;
    let notifTitle = '';
    
    switch (type) {
      case 'port_scan':
        newEvent = { id, type: 'Network', title: 'Simulated Port Scan', source: 'External IP', time: now, severity: 'medium', icon: Network };
        notifTitle = 'Port Scan Detected';
        break;
      case 'brute_force':
        newEvent = { id, type: 'Network', title: 'Simulated Brute Force', source: 'External IP', time: now, severity: 'high', icon: Network };
        notifTitle = 'Brute Force Activity';
        break;
      case 'phishing':
        newEvent = { id, type: 'Email', title: 'Simulated Phishing', source: 'Unknown Sender', time: now, severity: 'high', icon: Mail };
        notifTitle = 'Phishing Email Detected';
        break;
      case 'credential_theft':
        newEvent = { id, type: 'Identity', title: 'Simulated Credential Compromise', source: 'System', time: now, severity: 'critical', icon: Users };
        notifTitle = 'Credential Compromise';
        break;
      case 'ehr_abuse':
        newEvent = { id, type: 'EHR', title: 'Simulated EHR Abuse', source: 'Internal Account', time: now, severity: 'high', icon: Activity };
        notifTitle = 'EHR Access Anomaly';
        break;
      case 'bulk_access':
        newEvent = { id, type: 'EHR', title: 'Simulated Bulk Access', source: 'Internal Account', time: now, severity: 'critical', icon: Activity };
        notifTitle = 'Bulk Record Access';
        break;
      case 'full_chain':
        // Just simulate the final result for simplicity
        newEvent = { id, type: 'EHR', title: 'Full Attack Chain Simulated', source: 'Multiple Systems', time: now, severity: 'critical', icon: ShieldAlert };
        notifTitle = 'Critical Incident Created';
        setIncidents(prev => [{
          id: `INC-${Math.floor(Math.random() * 1000)}`,
          title: 'Simulated Multi-Stage Attack',
          severity: 'critical',
          riskScore: 99,
          account: 'multiple',
          systems: ['Email', 'Identity', 'Network', 'EHR'],
          status: 'Investigating',
          events: 10
        }, ...prev]);
        break;
      default:
        return;
    }

    newLog = { id: `AUD-${id}`, timestamp: now, actor: 'Attack Simulator', system: newEvent.type, action: 'Simulation Triggered', outcome: 'Success' };

    setEvents(prev => [newEvent, ...prev]);
    setAuditLogs(prev => [newLog, ...prev]);
    setNotifications(prev => [{ id: `N-${id}`, title: notifTitle, message: newEvent.title, time: now, read: false, type: newEvent.severity }, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <SecurityContext.Provider value={{ currentView, setCurrentView, events, incidents, auditLogs, notifications, simulateAttack, markNotificationsRead }}>
      {children}
    </SecurityContext.Provider>
  );
}
