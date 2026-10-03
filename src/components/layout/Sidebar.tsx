import { Shield, Home, AlertTriangle, Mail, Link, Users, Network, Activity, Sword, ScrollText, Settings } from 'lucide-react';
import { useCurrentView, useSetCurrentView } from '../../store/store';

const navItems = [
  { name: 'Overview', icon: Home },
  { name: 'Incidents', icon: AlertTriangle },
  { name: 'Email Security', icon: Mail },
  { name: 'LinkGuard', icon: Link },
  { name: 'Identity', icon: Users },
  { name: 'Network', icon: Network },
  { name: 'EHR Security', icon: Activity },
];

const opItems = [
  { name: 'Attack Simulator', icon: Sword },
  { name: 'Audit Ledger', icon: ScrollText },
];

export function Sidebar() {
  const currentView = useCurrentView();
  const setCurrentView = useSetCurrentView();

  return (
    <aside className="sidebar">
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ backgroundColor: 'var(--accent-primary)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
          <Shield size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--text-primary)' }}>CARESENTINEL</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Clinical Security Intelligence</span>
        </div>
      </div>
      
      <div style={{ padding: '1.5rem 1rem', overflowY: 'auto', flex: 1 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>Security</div>
          {navItems.map((item) => {
            const active = currentView === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  marginBottom: '0.25rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <item.icon size={18} style={{ marginRight: '0.75rem' }} />
                {item.name}
              </button>
            );
          })}
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>Operations</div>
          {opItems.map((item) => {
            const active = currentView === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  marginBottom: '0.25rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <item.icon size={18} style={{ marginRight: '0.75rem' }} />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border)' }}>
         <button
            onClick={() => setCurrentView('Settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              color: currentView === 'Settings' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              backgroundColor: currentView === 'Settings' ? 'var(--bg-hover)' : 'transparent',
              fontWeight: currentView === 'Settings' ? 600 : 500,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (currentView !== 'Settings') e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'Settings') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Settings size={18} style={{ marginRight: '0.75rem' }} />
            Settings
          </button>
      </div>
    </aside>
  );
}
