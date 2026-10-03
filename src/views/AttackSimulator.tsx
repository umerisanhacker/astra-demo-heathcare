import { useStore, useSimulateAttack, useRunFullChain } from '../store/store';
import { Play, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AttackSimulator() {
  const { state } = useStore();
  const simulateAttack = useSimulateAttack();
  const runFullChain = useRunFullChain();

  const steps = [
    { label: 'Phishing Email Received' },
    { label: 'Suspicious Link Clicked' },
    { label: 'Credential Compromise' },
    { label: 'Unknown Device Login' },
    { label: 'EHR Bulk Access' },
    { label: 'Data Exfiltration Attempt' }
  ];
  
  // scale progress 0-14 to 0-6
  const visibleProgress = Math.min(6, Math.floor(state.attackChainProgress / (14/6)));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Attack Simulator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Manual Triggers</h2>
          <div className="space-y-3">
            <button 
              onClick={() => simulateAttack('Phishing')}
              className="w-full flex items-center justify-between p-4 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)] hover:text-white rounded-lg transition-colors border border-[var(--border-color)] group"
            >
              <span className="font-medium group-hover:text-white text-[var(--text-primary)]">Trigger Phishing Event</span>
              <Play className="h-5 w-5" />
            </button>
            <button 
              onClick={() => simulateAttack('Brute Force')}
              className="w-full flex items-center justify-between p-4 bg-[var(--bg-tertiary)] hover:bg-orange-500 hover:text-white rounded-lg transition-colors border border-[var(--border-color)] group"
            >
              <span className="font-medium group-hover:text-white text-[var(--text-primary)]">Simulate Brute Force</span>
              <Play className="h-5 w-5" />
            </button>
            <button 
              onClick={() => simulateAttack('EHR Bulk Access')}
              className="w-full flex items-center justify-between p-4 bg-[var(--bg-tertiary)] hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-[var(--border-color)] group"
            >
              <span className="font-medium group-hover:text-white text-[var(--text-primary)]">Trigger Bulk EHR Access</span>
              <Play className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[var(--critical)]" />
              Kill Chain Simulation
            </h2>
            <button 
              onClick={runFullChain}
              disabled={state.isRunningChain}
              className="w-full py-3 bg-[var(--critical)] hover:bg-red-600 text-white font-medium rounded-lg disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
            >
              {state.isRunningChain ? <Activity className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
              {state.isRunningChain ? 'Simulating Attack Chain...' : 'Run Full Attack Chain'}
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Chain Progress</h2>
          <div className="relative border-l-2 border-[var(--border-color)] ml-3 space-y-8">
            {steps.map((step, idx) => {
              const isActive = visibleProgress === idx && state.isRunningChain;
              const isCompleted = visibleProgress > idx || (!state.isRunningChain && state.attackChainProgress >= 14 && idx <= 5);
              return (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 ${
                    isCompleted ? 'bg-[var(--success)] border-[var(--success)]' : 
                    isActive ? 'bg-[var(--critical)] border-[var(--critical)] animate-pulse' : 
                    'bg-[var(--bg-tertiary)] border-[var(--border-color)]'
                  }`} />
                  <div>
                    <h3 className={`font-medium ${isCompleted ? 'text-[var(--text-primary)]' : isActive ? 'text-[var(--critical)]' : 'text-[var(--text-muted)]'}`}>
                      {step.label}
                    </h3>
                    {isCompleted && <p className="text-xs text-[var(--success)] flex items-center gap-1 mt-1"><CheckCircle2 className="h-3 w-3" /> Completed</p>}
                    {isActive && <p className="text-xs text-[var(--critical)] flex items-center gap-1 mt-1"><Activity className="h-3 w-3 animate-pulse" /> In Progress...</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

