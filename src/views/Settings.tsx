import { Bell, Shield, Moon, Monitor } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Settings</h1>
      
      <div className="max-w-3xl space-y-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] font-medium text-[var(--text-primary)] flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Email Alerts</p>
                <p className="text-sm text-[var(--text-secondary)]">Receive critical incidents via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] font-medium text-[var(--text-primary)] flex items-center gap-2">
            <Shield className="h-5 w-5" /> Security Preferences
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Auto-Quarantine</p>
                <p className="text-sm text-[var(--text-secondary)]">Automatically quarantine high-risk emails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

