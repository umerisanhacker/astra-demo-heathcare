import type { AppState } from './types';
import type { Action } from './actions';
import { calculatePosture } from './riskEngine';
import { correlateEvents } from './correlationEngine';

export function rootReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_EVENT': {
      const newEvents = [action.payload, ...state.events];
      const newIncidents = correlateEvents(newEvents, state.incidents);
      return {
        ...state,
        events: newEvents,
        incidents: newIncidents,
        securityPosture: calculatePosture(newEvents),
      };
    }
    case 'ADD_EVENTS': {
      const newEvents = [...action.payload, ...state.events];
      const newIncidents = correlateEvents(newEvents, state.incidents);
      return {
        ...state,
        events: newEvents,
        incidents: newIncidents,
        securityPosture: calculatePosture(newEvents),
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
      return { ...state, currentView: action.payload };
    case 'RECALCULATE_POSTURE':
      return { ...state, securityPosture: calculatePosture(state.events) };
    default:
      return state;
  }
}

