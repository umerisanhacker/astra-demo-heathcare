import type { AppState, AuditEvent, AppNotification, SecurityEvent, SimulatedEmail, SimulatedEHRAccess } from './types';
import type { Action } from './actions';
import { calculatePosture } from './riskEngine';
import { correlateEvents } from './correlationEngine';
import { createInitialBaseline } from './initialData';

export function rootReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TRIGGER_SIMULATION': {
      const { simulationType } = action.payload;
      const timestamp = new Date().toISOString();
      const eventId = `sim-evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      
      let event: SecurityEvent;
      let auditAction = '';
      let notifTitle = '';
      let targetView = 'Overview';
      let notifSeverity: 'low' | 'medium' | 'high' | 'critical' = 'high';

      // Updates to module states
      let updatedEmails = [...state.emails];
      let updatedEHRAccesses = [...state.ehrAccesses];
      let updatedUsers = [...state.users];
      let updatedDevices = [...state.devices];
      let updatedNetworkNodes = [...state.networkNodes];

      switch (simulationType) {
        case 'Phishing':
        case 'SIMULATE PHISHING': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'PHISHING_DETECTED',
            category: 'email',
            severity: 'high',
            title: 'Simulated Phishing Campaign Intercepted',
            description: 'Look-alike domain "hospital-support.example" targeting Dr. Sarah Wilson.',
            source: 'CareSentinel Email Gateway',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'Exchange / Email Gateway',
            status: 'new',
            riskContribution: 14,
            metadata: { 
              sender: 'hospital-billing@hospital-support.example', 
              domain: 'hospital-support.example', 
              lookalikeScore: 0.94,
              url: 'https://secure-hospital-login.example/account'
            },
          };
          auditAction = 'Synthetic phishing email injected & flagged by inbound heuristics';
          notifTitle = 'Phishing Email Intercepted';
          targetView = 'Email Security';
          notifSeverity = 'high';

          const newEmail: SimulatedEmail = {
            id: `em-sim-${Date.now()}`,
            sender: 'hospital-billing@hospital-support.example',
            senderName: 'Northstar Financial Support Desk',
            domain: 'hospital-support.example',
            recipient: 'sarah.wilson@northstar-med.org',
            recipientName: 'Dr. Sarah Wilson',
            subject: 'Urgent Patient Billing Reconciliation Manifest',
            preview: 'Action Required: Inpatient billing ledger updates must be verified prior to end of shift...',
            body: 'Dr. Wilson,\n\nPlease review the attached billing reconciliation manifest for Cardiology admissions. Due to regulatory policy revisions, you must authenticate via the hospital ledger portal link below:\n\nhttps://secure-hospital-login.example/account\n\nNorthstar Health Financial Office\nConfidentiality Notice: Simulated healthcare communication.',
            timestamp,
            risk: 'high',
            status: 'inbox',
            authIndicators: {
              syntaxValid: true,
              domainTrusted: false,
              displayNameMismatch: true,
              lookalikeDetected: true,
              syntheticSpf: 'FAIL',
              syntheticDkim: 'FAIL',
              syntheticDmarc: 'FAIL',
            },
            links: ['https://secure-hospital-login.example/account'],
            attachments: ['patient_billing_manifest.zip'],
          };
          updatedEmails = [newEmail, ...updatedEmails];
          break;
        }

        case 'Malicious Link':
        case 'SIMULATE MALICIOUS LINK': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'SUSPICIOUS_LINK',
            category: 'linkguard',
            severity: 'critical',
            title: 'Malicious Credential Harvesting URL Intercepted',
            description: 'LinkGuard intercepted link to credential collection proxy: https://secure-hospital-login.example/account',
            source: 'LinkGuard Edge',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'LinkGuard Safe-Proxy',
            status: 'new',
            riskContribution: 18,
            metadata: { 
              url: 'https://secure-hospital-login.example/account', 
              domain: 'secure-hospital-login.example', 
              riskScore: 88, 
              decision: 'BLOCK',
              reasons: 'Credential collection pattern detected; Look-alike domain masquerading as hospital portal'
            },
          };
          auditAction = 'LinkGuard blocked simulated credential-harvesting URL';
          notifTitle = 'Malicious URL Intercepted by LinkGuard';
          targetView = 'LinkGuard';
          notifSeverity = 'critical';
          break;
        }

        case 'Credential Compromise':
        case 'SIMULATE CREDENTIAL COMPROMISE': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'CREDENTIAL_COMPROMISE',
            category: 'identity',
            severity: 'critical',
            title: 'Simulated Credential Replay Signal: Dr. Sarah Wilson',
            description: 'Active Directory token harvested through phishing replica site; OAuth token replay detected.',
            source: 'Identity Threat Telemetry',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'Hospital IAM Provider',
            status: 'new',
            riskContribution: 20,
            metadata: { tokenEntropy: 'high', authSource: 'External VPN Gateway', tokenCompromised: true },
          };
          auditAction = 'Simulated credential token exposure flagged in Identity Provider';
          notifTitle = 'Credential Compromise Signal';
          targetView = 'Identity';
          notifSeverity = 'critical';

          updatedUsers = updatedUsers.map(u => 
            u.id === 'dr.sarah' ? { ...u, status: 'flagged' } : u
          );
          break;
        }

        case 'Port Scan':
        case 'SIMULATE PORT SCAN': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'PORT_SCAN',
            category: 'network',
            severity: 'high',
            title: 'Clinical Subnet Port Scan Detected',
            description: 'Subnet scan targeting clinical FHIR endpoints (ports 22, 80, 443, 8080, 8443).',
            source: 'Network Intrusion Detection System',
            actor: '10.0.0.45',
            system: 'Internal Clinical Firewall',
            status: 'new',
            riskContribution: 15,
            metadata: { sourceIP: '10.0.0.45', rate: '520 pkts/sec', scannedPorts: '22, 80, 443, 8080, 8443' },
          };
          auditAction = 'Simulated port scan pattern registered in NIDS';
          notifTitle = 'Clinical Subnet Port Scan Detected';
          targetView = 'Network';
          notifSeverity = 'high';

          updatedNetworkNodes = updatedNetworkNodes.map(n => 
            (n.id === 'node-fw' || n.id === 'node-app') ? { ...n, status: 'alert', trafficRate: '340 Mbps (Active Port Scan)' } : n
          );
          break;
        }

        case 'Brute Force':
        case 'SIMULATE BRUTE FORCE': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'BRUTE_FORCE',
            category: 'network',
            severity: 'high',
            title: 'Simulated SSH/Reverse-Proxy Brute Force Attack',
            description: '140 rapid authentication attempts against clinical DMZ reverse proxy within 60s.',
            source: 'Auth Sentry',
            actor: '10.0.0.45',
            system: 'DMZ Reverse Proxy',
            status: 'new',
            riskContribution: 16,
            metadata: { attempts: 140, window: '60s', rateLimitTriggered: true },
          };
          auditAction = 'Simulated brute-force sequence logged and rate-limited';
          notifTitle = 'Brute Force Attempt Detected';
          targetView = 'Network';
          notifSeverity = 'high';

          updatedNetworkNodes = updatedNetworkNodes.map(n => 
            n.id === 'node-dmz' ? { ...n, status: 'alert', trafficRate: '195 Mbps (Auth Spike - 140 req/min)' } : n
          );
          break;
        }

        case 'Unusual Login':
        case 'SIMULATE UNUSUAL LOGIN': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'UNUSUAL_LOGIN',
            category: 'identity',
            severity: 'high',
            title: 'Unusual Login from Unknown Device: Dr. Sarah Wilson',
            description: 'Dr. Sarah Wilson logged in from Rogue Device (192.168.1.100) at 03:17 (outside 07:00-17:00 shift).',
            source: 'IAM Provider',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            deviceId: 'dev-003',
            system: 'Single Sign-On (SSO)',
            status: 'new',
            riskContribution: 16,
            metadata: { 
              device: 'Unknown-Device-External', 
              ip: '192.168.1.100', 
              expectedWorkstation: 'Hospital Workstation 04',
              time: '03:17',
              authResult: 'SUCCESS',
              anomalyReason: 'Login outside shift window (07:00-17:00) from unregistered external IP'
            },
          };
          auditAction = 'Simulated anomalous authentication outside clinical hours recorded';
          notifTitle = 'Anomalous Identity Login Flagged';
          targetView = 'Identity';
          notifSeverity = 'high';

          updatedDevices = updatedDevices.map(d => 
            d.id === 'dev-003' ? { ...d, status: 'flagged' } : d
          );
          updatedUsers = updatedUsers.map(u => 
            u.id === 'dr.sarah' ? { ...u, status: 'flagged' } : u
          );
          break;
        }

        case 'Application Attack Signal':
        case 'SIMULATE APPLICATION ATTACK SIGNAL': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'APP_PROBE',
            category: 'application',
            severity: 'high',
            title: 'Simulated API Abuse on /synthetic-api/patient-records',
            description: 'Automated parameter tampering and scraping probe bypassing pagination controls on FHIR server.',
            source: 'Application Security Gateway',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'Clinical API Gateway',
            status: 'new',
            riskContribution: 16,
            metadata: { endpoint: '/synthetic-api/patient-records', pattern: 'Parameter tampering' },
          };
          auditAction = 'Simulated application security probe registered on clinical API endpoint';
          notifTitle = 'API Access Anomaly Detected';
          targetView = 'Network';
          notifSeverity = 'high';

          updatedNetworkNodes = updatedNetworkNodes.map(n => 
            n.id === 'node-app' ? { ...n, status: 'alert', trafficRate: '124 Mbps (API Query Anomalies)' } : n
          );
          break;
        }

        case 'EHR Abuse':
        case 'SIMULATE EHR ABUSE': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'EHR_ACCESS',
            category: 'ehr',
            severity: 'critical',
            title: 'Simulated Cross-Department EHR Relationship Anomaly',
            description: 'Cardiology physician accessing unrelated Neurology chart Thomas Brody (#8819) without clinical order.',
            source: 'EHR Connector Sentry',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'Epic/Cerner EHR Connector',
            status: 'new',
            riskContribution: 18,
            metadata: { physicianDept: 'Cardiology', targetPatient: 'Thomas Brody (#8819)', reason: 'None charted' },
          };
          auditAction = 'Simulated clinical relationship anomaly recorded in EHR audit ledger';
          notifTitle = 'EHR Relationship Anomaly Flagged';
          targetView = 'EHR Security';
          notifSeverity = 'critical';

          const newEHRAccess: SimulatedEHRAccess = {
            id: `ehr-sim-${Date.now()}`,
            timestamp,
            doctorId: 'dr.sarah',
            doctorName: 'Dr. Sarah Wilson',
            patientId: 'pat-8819',
            patientName: 'Thomas Brody (#8819)',
            department: 'Neurology (Unrelated)',
            accessReason: 'No charted clinical justification provided (Anomalous chart access)',
            relationship: 'Unrelated',
            device: 'Unknown-Device-External (192.168.1.100)',
            isAnomalous: true,
            isBreakGlass: false,
            risk: 'critical',
          };
          updatedEHRAccesses = [newEHRAccess, ...updatedEHRAccesses];
          break;
        }

        case 'Bulk Access':
        case 'SIMULATE BULK ACCESS':
        default: {
          event = {
            id: eventId,
            timestamp,
            eventType: 'EHR_BULK_ACCESS',
            category: 'ehr',
            severity: 'critical',
            title: 'Simulated EHR Bulk Record Exfiltration Attempt',
            description: 'Account queried 47 patient charts in 90 seconds (Baseline: 5 records / 30m). Velocity tripwire breached.',
            source: 'EHR Audit Velocity Engine',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'EHR Patient Data Layer',
            status: 'new',
            riskContribution: 22,
            metadata: { recordsAccessed: 47, windowSeconds: 90, riskTier: 'EXFILTRATION_VELOCITY' },
          };
          auditAction = 'Simulated EHR bulk access anomaly triggered velocity tripwire';
          notifTitle = 'EHR Bulk Access Velocity Alert';
          targetView = 'EHR Security';
          notifSeverity = 'critical';

          const newEHRAccess: SimulatedEHRAccess = {
            id: `ehr-sim-bulk-${Date.now()}`,
            timestamp,
            doctorId: 'dr.sarah',
            doctorName: 'Dr. Sarah Wilson',
            patientId: 'pat-bulk-47',
            patientName: 'Bulk Export Query (47 Clinical Charts)',
            department: 'Multi-Department Export',
            accessReason: 'Automated FHIR query sequence - Velocity threshold breached',
            relationship: 'Unrelated',
            device: 'Unknown-Device-External (192.168.1.100)',
            isAnomalous: true,
            isBreakGlass: false,
            risk: 'critical',
          };
          updatedEHRAccesses = [newEHRAccess, ...updatedEHRAccesses];
          break;
        }
      }

      const newEvents = [event, ...state.events];
      const newIncidents = correlateEvents(newEvents, state.incidents);
      const newPosture = calculatePosture(newEvents);

      const newAudit: AuditEvent = {
        id: `aud-sim-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp,
        actor: 'Security Analyst (Simulator)',
        system: event.system,
        action: auditAction,
        outcome: 'warning',
        relatedEventId: eventId,
        details: event.description,
      };

      const newNotif: AppNotification = {
        id: `not-sim-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        title: notifTitle,
        message: event.description,
        timestamp,
        read: false,
        severity: notifSeverity,
        relatedEventId: eventId,
        targetView,
      };

      return {
        ...state,
        events: newEvents,
        incidents: newIncidents,
        securityPosture: newPosture,
        emails: updatedEmails,
        ehrAccesses: updatedEHRAccesses,
        users: updatedUsers,
        devices: updatedDevices,
        networkNodes: updatedNetworkNodes,
        notifications: [newNotif, ...state.notifications],
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'ADD_EVENT': {
      const newEvents = [action.payload, ...state.events];
      const newIncidents = correlateEvents(newEvents, state.incidents);
      const newPosture = calculatePosture(newEvents);
      
      const newNotif: AppNotification = {
        id: `not-${Date.now()}`,
        title: action.payload.severity === 'critical' ? 'CRITICAL ALERT DETECTED' : 'Security Alert',
        message: `${action.payload.title} — ${action.payload.system}`,
        timestamp: new Date().toISOString(),
        read: false,
        severity: action.payload.severity,
        relatedEventId: action.payload.id,
      };

      return {
        ...state,
        events: newEvents,
        incidents: newIncidents,
        securityPosture: newPosture,
        notifications: [newNotif, ...state.notifications],
      };
    }
    
    case 'ADD_EVENTS': {
      const newEvents = [...action.payload, ...state.events];
      const newIncidents = correlateEvents(newEvents, state.incidents);
      const newPosture = calculatePosture(newEvents);
      return {
        ...state,
        events: newEvents,
        incidents: newIncidents,
        securityPosture: newPosture,
      };
    }

    case 'ADD_AUDIT':
      return { ...state, auditLog: [action.payload, ...state.auditLog] };

    case 'ADD_AUDITS':
      return { ...state, auditLog: [...action.payload, ...state.auditLog] };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };

    case 'SET_INCIDENTS':
      return { ...state, incidents: action.payload };

    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };

    case 'SET_ATTACK_CHAIN_PROGRESS':
      return { ...state, attackChainProgress: action.payload };

    case 'SET_RUNNING_CHAIN':
      return { ...state, isRunningChain: action.payload };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'SET_VIEW':
      return { 
        ...state, 
        currentView: action.payload,
        appMode: 'console',
      };

    case 'SET_APP_MODE':
      return { ...state, appMode: action.payload };

    case 'SET_PUBLIC_PAGE':
      return { 
        ...state, 
        publicPage: action.payload,
        appMode: 'public',
      };

    case 'SET_SELECTED_INCIDENT':
      return { ...state, selectedIncidentId: action.payload };

    case 'RECALCULATE_POSTURE':
      return { ...state, securityPosture: calculatePosture(state.events) };

    case 'QUARANTINE_EMAIL': {
      const { emailId, reason } = action.payload;
      const target = state.emails.find(e => e.id === emailId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Security Analyst (Simulated)',
        system: 'Email Security Gateway',
        action: `Quarantined email: "${target?.subject || emailId}"`,
        outcome: 'success',
        details: reason || 'Isolated by operator due to malicious threat score.',
      };
      const newNotif: AppNotification = {
        id: `not-${Date.now()}`,
        title: 'Email Quarantined',
        message: `Message "${target?.subject || emailId}" isolated in security vault.`,
        timestamp: new Date().toISOString(),
        read: false,
        severity: 'low',
        targetView: 'Email Security',
      };

      const updatedEmails = state.emails.map(e => 
        e.id === emailId ? { ...e, status: 'quarantined' as const } : e
      );

      // Also mark any related email events as resolved
      const updatedEvents = state.events.map(ev => 
        (ev.category === 'email' && ev.userId === target?.recipient?.split('@')[0])
          ? { ...ev, status: 'resolved' as const }
          : ev
      );

      return {
        ...state,
        emails: updatedEmails,
        events: updatedEvents,
        securityPosture: calculatePosture(updatedEvents),
        auditLog: [newAudit, ...state.auditLog],
        notifications: [newNotif, ...state.notifications],
      };
    }

    case 'RELEASE_EMAIL': {
      const { emailId } = action.payload;
      const target = state.emails.find(e => e.id === emailId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Security Analyst (Simulated)',
        system: 'Email Security Gateway',
        action: `Released email from quarantine: "${target?.subject || emailId}"`,
        outcome: 'success',
        details: 'Analyst reviewed email body and false-positive indicators.',
      };
      return {
        ...state,
        emails: state.emails.map(e => e.id === emailId ? { ...e, status: 'inbox' as const } : e),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'QUARANTINE_ATTACHMENT': {
      const { attachmentId } = action.payload;
      const att = state.attachments.find(a => a.id === attachmentId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Sandbox Operator',
        system: 'Attachment Threat Sandbox',
        action: `Quarantined file: ${att?.filename || attachmentId}`,
        outcome: 'success',
        details: 'Dynamic execution flagged malicious archive structure.',
      };
      return {
        ...state,
        attachments: state.attachments.map(a => 
          a.id === attachmentId ? { ...a, decision: 'QUARANTINED' as const } : a
        ),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'FLAG_USER': {
      const { userId } = action.payload;
      const usr = state.users.find(u => u.id === userId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'SOC Incident Handler',
        system: 'Active Directory / IAM',
        action: `Flagged user account: ${usr?.name || userId} for password reset`,
        outcome: 'success',
        details: 'Active SSO sessions revoked. Mandatory MFA re-enrollment required.',
      };
      return {
        ...state,
        users: state.users.map(u => u.id === userId ? { ...u, status: 'flagged' as const } : u),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'UNFLAG_USER': {
      const { userId } = action.payload;
      return {
        ...state,
        users: state.users.map(u => u.id === userId ? { ...u, status: 'active' as const } : u),
      };
    }

    case 'ISOLATE_DEVICE': {
      const { deviceId } = action.payload;
      const dev = state.devices.find(d => d.id === deviceId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'SOC Network Defender',
        system: 'Network Access Control (NAC)',
        action: `Isolated device: ${dev?.name || deviceId} (${dev?.ip})`,
        outcome: 'success',
        details: 'Endpoint severed from clinical VLAN 5. Traffic redirected to blackhole sandbox.',
      };
      return {
        ...state,
        devices: state.devices.map(d => d.id === deviceId ? { ...d, status: 'isolated' as const } : d),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'RESTORE_DEVICE': {
      const { deviceId } = action.payload;
      return {
        ...state,
        devices: state.devices.map(d => d.id === deviceId ? { ...d, status: 'online' as const } : d),
      };
    }

    case 'UPDATE_INCIDENT_STATUS': {
      const { incidentId, status } = action.payload;
      const inc = state.incidents.find(i => i.id === incidentId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'SOC Incident Commander',
        system: 'CareSentinel Incident Core',
        action: `Incident ${incidentId} transitioned to: ${status.toUpperCase()}`,
        outcome: 'success',
        details: `Updated from ${inc?.status} to ${status}. Recalculating security posture.`,
      };

      // If resolving incident, mark all associated events as resolved
      let updatedEvents = state.events;
      if (status === 'resolved' && inc) {
        updatedEvents = state.events.map(ev => 
          inc.eventIds.includes(ev.id) ? { ...ev, status: 'resolved' as const } : ev
        );
      }

      const updatedIncidents = state.incidents.map(i => 
        i.id === incidentId ? { ...i, status, updatedAt: new Date().toISOString() } : i
      );

      return {
        ...state,
        incidents: updatedIncidents,
        events: updatedEvents,
        securityPosture: calculatePosture(updatedEvents),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'ADD_INCIDENT_NOTE': {
      const { incidentId, note } = action.payload;
      return {
        ...state,
        incidents: state.incidents.map(i => {
          if (i.id === incidentId) {
            return {
              ...i,
              notes: [...(i.notes || []), note],
              updatedAt: new Date().toISOString(),
            };
          }
          return i;
        }),
      };
    }

    case 'APPROVE_BREAK_GLASS': {
      const { accessId } = action.payload;
      const acc = state.ehrAccesses.find(a => a.id === accessId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Clinical Privacy & Compliance Officer',
        system: 'EHR Audit Core',
        action: `Emergency break-glass reviewed & approved: ${acc?.doctorName} -> ${acc?.patientName}`,
        outcome: 'success',
        details: `Clinical emergency justification verified: ${acc?.accessReason}`,
      };
      return {
        ...state,
        ehrAccesses: state.ehrAccesses.map(a => 
          a.id === accessId ? { ...a, breakGlassApproved: true, risk: 'low' as const } : a
        ),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'SET_GUIDED_DEMO':
      return {
        ...state,
        guidedDemoActive: action.payload.active,
        guidedDemoStep: action.payload.step ?? state.guidedDemoStep,
      };

    case 'RESET_DEMO': {
      const baseline = createInitialBaseline();
      return {
        ...baseline,
        currentView: state.currentView, // stay on current view or Attack Simulator
        appMode: state.appMode,
      };
    }

    default:
      return state;
  }
}
