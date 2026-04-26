import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Taches from './pages/Taches';
import Alerts from './pages/Alerts';
import Security from './pages/Security';
import Transport from './pages/Transport';
import Accreditations from './pages/Accreditations';
import ProtocolEvents from './pages/ProtocolEvents';
import MediaRequests from './pages/MediaRequests';
import SiteMetrics from './pages/SiteMetrics';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Users from './pages/Users';
import Sites from './pages/Sites';
import Team from './pages/Team';
import type { Page } from './types';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-200 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'incidents': return <Incidents />;
      case 'taches': return <Taches />;
      case 'alerts': return <Alerts />;
      case 'security': return <Security />;
      case 'transport': return <Transport />;
      case 'accreditations': return <Accreditations />;
      case 'protocol': return <ProtocolEvents />;
      case 'media': return <MediaRequests />;
      case 'metrics': return <SiteMetrics />;
      case 'reports': return <Reports />;
      case 'notifications': return <Notifications />;
      case 'users': return <Users />;
      case 'sites': return <Sites />;
      case 'team': return <Team />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
