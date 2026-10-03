import { SecurityStoreProvider, useCurrentView } from './store/store';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Overview from './views/Overview';
import Incidents from './views/Incidents';
import EmailSecurity from './views/EmailSecurity';
import LinkGuard from './views/LinkGuard';
import Identity from './views/Identity';
import NetworkView from './views/NetworkView';
import EHRSecurity from './views/EHRSecurity';
import AttackSimulator from './views/AttackSimulator';
import AuditLedger from './views/AuditLedger';
import Settings from './views/Settings';

function AppContent() {
  const currentView = useCurrentView();

  const renderView = () => {
    switch (currentView) {
      case 'Overview': return <Overview />;
      case 'Incidents': return <Incidents />;
      case 'Email Security': return <EmailSecurity />;
      case 'LinkGuard': return <LinkGuard />;
      case 'Identity': return <Identity />;
      case 'Network': return <NetworkView />;
      case 'EHR Security': return <EHRSecurity />;
      case 'Attack Simulator': return <AttackSimulator />;
      case 'Audit Ledger': return <AuditLedger />;
      case 'Settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout>
      {renderView()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <SecurityStoreProvider>
      <AppContent />
    </SecurityStoreProvider>
  );
}

export default App;
