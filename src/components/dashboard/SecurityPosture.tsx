import type { SecurityPosture as SecurityPostureType } from '../../store/types';

interface Props {
  posture: SecurityPostureType;
}

export default function SecurityPosture({ posture }: Props) {
  const dashArray = 251.2; // 2 * pi * r (r=40)
  const dashOffset = dashArray - (dashArray * posture.score) / 100;
  
  const getColor = (score: number) => {
    if (score >= 90) return 'text-[var(--success)]';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-[var(--warning)]';
    return 'text-[var(--critical)]';
  };

  const colorClass = getColor(posture.score);

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Security Posture</h2>
      <div className="flex items-center justify-center mb-8 relative">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[var(--bg-tertiary)]" />
          <circle 
            cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={dashArray} strokeDashoffset={dashOffset} 
            className={`${colorClass} transition-all duration-1000 ease-out`} 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[var(--text-primary)]">{posture.score}</span>
          <span className={`text-sm font-medium ${colorClass}`}>{posture.label}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(posture.categoryScores).map(([cat, score]) => (
          <div key={cat}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--text-secondary)] capitalize">{cat}</span>
              <span className="text-[var(--text-primary)] font-medium">{score}/100</span>
            </div>
            <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${getColor(score).replace('text-', 'bg-')}`} 
                style={{ width: `${score}%`, transition: 'width 1s ease-out' }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {posture.riskFactors.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Risk Factors</h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            {posture.riskFactors.slice(0, 3).map(rf => (
              <li key={rf.id} className="flex justify-between">
                <span className="truncate mr-2">- {rf.label}</span>
                <span className="text-[var(--critical)] shrink-0">-{rf.deduction} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

