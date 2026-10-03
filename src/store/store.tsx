import { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AppState, SecurityEvent } from './types';
import type { Action } from './actions';
import { rootReducer } from './reducer';
import { initialUsers, initialDevices, initialEvents, initialIncidents, initialAuditLog, initialNotifications, initialPosture } from './initialData';

const initialState: AppState = {
  currentView: 'Overview',
  events: initialEvents,
  incidents: initialIncidents,
  auditLog: initialAuditLog,
  notifications: initialNotifications,
  users: initialUsers,
  devices: initialDevices,
  securityPosture: initialPosture,
  attackChainProgress: 0,
  isRunningChain: false,
  searchQuery: '',
};

const SecurityStoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function SecurityStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  return (
    <SecurityStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </SecurityStoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(SecurityStoreContext);
  if (!context) throw new Error('useStore must be used within SecurityStoreProvider');
  return context;
}

export function useCurrentView() {
  const { state } = useStore();
  return state.currentView;
}

export function useSetCurrentView() {
  const { dispatch } = useStore();
  return useCallback((view: string) => dispatch({ type: 'SET_VIEW', payload: view }), [dispatch]);
}

export function useEvents() {
  const { state } = useStore();
  return state.events;
}

export function useIncidents() {
  const { state } = useStore();
  return state.incidents;
}

export function usePosture() {
  const { state } = useStore();
  return state.securityPosture;
}

export function useNotifications() {
  const { state } = useStore();
  return state.notifications;
}

export function useMarkNotificationsRead() {
  const { dispatch } = useStore();
  return useCallback(() => dispatch({ type: 'MARK_NOTIFICATIONS_READ' }), [dispatch]);
}

export function useSimulateAttack() {
  const { dispatch } = useStore();
  
  return useCallback((type: string) => {
    const eventId = `sim-${Date.now()}`;
    const newEvent: SecurityEvent = {
      id: eventId,
      timestamp: new Date().toISOString(),
      eventType: 'SIMULATION_TRIGGERED',
      category: 'system',
      severity: 'high',
      title: `Simulated Attack: ${type}`,
      description: 'User initiated an attack simulation.',
      source: 'Attack Simulator',
      system: 'Dashboard',
      status: 'new',
      riskContribution: 5,
      metadata: { attackType: type },
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    dispatch({
      type: 'ADD_AUDIT',
      payload: {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Admin',
        system: 'Dashboard',
        action: `Simulated Attack: ${type}`,
        outcome: 'success',
        relatedEventId: eventId,
      }
    });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `not-${Date.now()}`,
        title: 'Simulation Triggered',
        message: `Started attack simulation: ${type}`,
        timestamp: new Date().toISOString(),
        read: false,
        severity: 'high',
        relatedEventId: eventId,
      }
    });
  }, [dispatch]);
}

export function useRunFullChain() {
  const { dispatch } = useStore();
  
  return useCallback(() => {
    dispatch({ type: 'SET_RUNNING_CHAIN', payload: true });
    dispatch({ type: 'SET_ATTACK_CHAIN_PROGRESS', payload: 0 });
    
    // Simulate steps with delays
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      dispatch({ type: 'SET_ATTACK_CHAIN_PROGRESS', payload: step });
      
      const newEvent: SecurityEvent = {
        id: `chain-${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: 'CREDENTIAL_COMPROMISE',
        category: 'identity',
        severity: 'critical',
        title: `Chain Step ${step}`,
        description: 'Attack chain progressing...',
        source: 'Simulator',
        system: 'IAM',
        status: 'new',
        riskContribution: 10,
        metadata: { step },
        userId: 'dr.emily', // target one user
      };
      
      dispatch({ type: 'ADD_EVENT', payload: newEvent });

      if (step >= 14) {
        clearInterval(interval);
        dispatch({ type: 'SET_RUNNING_CHAIN', payload: false });
      }
    }, 1500);
  }, [dispatch]);
}

