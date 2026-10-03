import { useState } from 'react';
import { useEvents } from '../store/store';
import { selectEventsByCategory } from '../store/selectors';
import { Link, Shield, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function LinkGuard() {
  const events = useEvents();
  const linkEvents = selectEventsByCategory(events, 'linkguard');
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<'idle' | 'analyzing' | 'safe' | 'malicious'>('idle');

  const handleAnalyze = () => {
    if (!url) return;
    setAnalysis('analyzing');
    setTimeout(() => {
      const isMalicious = url.includes('login') || url.includes('secure') || url.includes('hospital');
      setAnalysis(isMalicious ? 'malicious' : 'safe');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">LinkGuard Protection</h1>
      
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Manual URL Analysis</h2>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-3 h-5 w-5 text-[var(--text-muted)]" />
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze (e.g., http://secure-update-portal-hospital.com)"
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={!url || analysis === 'analyzing'}
            className="px-6 py-2.5 bg-[var(--accent-primary)] hover:bg-opacity-90 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            {analysis === 'analyzing' ? 'Analyzing...' : 'Analyze URL'}
          </button>
        </div>

        {analysis === 'safe' && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-500">
            <CheckCircle2 className="h-5 w-5" />
            <span>This URL appears to be safe.</span>
          </div>
        )}
        {analysis === 'malicious' && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500">
            <AlertOctagon className="h-5 w-5" />
            <span>High Risk: This URL exhibits phishing characteristics.</span>
          </div>
        )}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden mt-8">
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] font-medium text-[var(--text-primary)]">
          Recent Suspicious Links Detected
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {linkEvents.length === 0 ? (
            <div className="p-4 text-[var(--text-secondary)]">No suspicious links detected recently.</div>
          ) : linkEvents.map(e => (
            <div key={e.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--bg-tertiary)] transition-colors">
              <div>
                <p className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[var(--critical)]" /> {e.title}
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{e.description}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Target: {String(e.metadata?.url || 'Unknown')}</p>
              </div>
              <span className="text-sm text-[var(--text-muted)]">{new Date(e.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

