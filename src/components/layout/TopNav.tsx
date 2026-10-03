import { useState } from 'react';
import { Search, Bell, CheckCircle, User, ShieldCheck } from 'lucide-react';
import { useNotifications, useMarkNotificationsRead, useStore } from '../../store/store';

export function TopNav() {
  const notifications = useNotifications();
  const markNotificationsRead = useMarkNotificationsRead();
  const { dispatch } = useStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--critical)';
      case 'high': return 'var(--warning)';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <header className="top-nav" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: '9999px', width: '300px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search incidents, users, emails..." 
            onChange={handleSearchChange}
            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.75rem', width: '100%', color: 'var(--text-primary)', fontSize: '0.875rem' }} 
          />
        </div>
        <div className="badge bg-positive-light" style={{ display: 'flex', gap: '0.5rem', border: '1px solid var(--positive)' }}>
          <ShieldCheck size={14} /> DEMO MODE — Synthetic Hospital Environment
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} className="text-positive" />
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>All systems monitored</span>
        </div>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>

        <div style={{ position: 'relative' }}>
          <button 
            style={{ position: 'relative', color: 'var(--text-secondary)' }}
            onClick={() => {
              setShowNotifs(!showNotifs);
              if (showNotifs) markNotificationsRead();
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', backgroundColor: 'var(--critical)', color: 'white', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifs && (
            <div style={{ position: 'absolute', top: '100%', right: 0, width: '320px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', zIndex: 50, marginTop: '1rem', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No notifications</p> : 
                  notifications.map(n => (
                    <div key={n.id} style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem', backgroundColor: n.read ? 'transparent' : 'var(--bg-hover)', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: severityColor(n.severity) }}>{n.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{n.message}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <User size={18} />
          </div>
        </button>
      </div>
    </header>
  );
}
