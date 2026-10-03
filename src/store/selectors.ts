import type { AppState, SecurityEvent, Category } from './types';

export const selectEventsByCategory = (events: SecurityEvent[], category: Category) => {
  return events.filter(e => e.category === category);
};

export const selectRecentEvents = (events: SecurityEvent[], n: number) => {
  return [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, n);
};

export const selectUnreadCount = (notifications: AppState['notifications']) => {
  return notifications.filter(n => !n.read).length;
};

export const selectSearchResults = (state: AppState) => {
  const q = state.searchQuery.toLowerCase();
  if (!q) return { events: [], incidents: [], users: [], devices: [] };

  return {
    events: state.events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
    incidents: state.incidents.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)),
    users: state.users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    devices: state.devices.filter(d => d.name.toLowerCase().includes(q) || d.ip.includes(q)),
  };
};

