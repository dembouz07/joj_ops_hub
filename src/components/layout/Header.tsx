import { Menu, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { mockNotifications } from '../../lib/mockData';
import type { Page } from '../../types';

const pageTitles: Record<Page, string> = {
  dashboard: 'Tableau de bord',
  incidents: 'Gestion des incidents',
  taches: 'Gestion des tâches',
  alerts: 'Alertes & notifications',
  security: 'Sécurité',
  transport: 'Transports',
  accreditations: 'Accréditations',
  protocol: 'Événements protocolaires',
  media: 'Demandes médias',
  metrics: 'Métriques & KPIs',
  reports: 'Rapports',
  notifications: 'Notifications',
  users: 'Utilisateurs',
  sites: 'Sites & venues',
  team: 'Mon Équipe',
};

const pageSubtitles: Record<Page, string> = {
  dashboard: 'Vue globale des opérations JOJ Dakar 2026',
  incidents: 'Suivi et résolution des incidents de sécurité',
  taches: 'Planification et suivi des tâches opérationnelles',
  alerts: 'Gestion des alertes opérationnelles en temps réel',
  security: 'Gestion de la sécurité et surveillance',
  transport: 'Coordination des flux de transport inter-sites',
  accreditations: 'Gestion des badges et accréditations',
  protocol: 'Planification des événements officiels et cérémonies',
  media: 'Traitement des demandes d\'accréditation médias',
  metrics: 'Fréquentation et indicateurs de performance',
  reports: 'Génération et consultation des rapports',
  notifications: 'Centre de notifications système',
  users: 'Gestion des comptes utilisateurs',
  sites: 'Informations sur les sites et venues',
  team: 'Membres de votre équipe opérationnelle',
};

interface HeaderProps {
  currentPage: Page;
  onMenuClick: () => void;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onMenuClick, onNavigate }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read_at).length;

  const formatDate = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return notifDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <header className="min-h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30 pt-safe">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 text-gray-600 touch-manipulation"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-gray-900 truncate">
          {pageTitles[currentPage]}
        </h2>
        <p className="text-xs text-gray-400 hidden sm:block truncate">
          {pageSubtitles[currentPage]}
        </p>
      </div>

      {/* <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-56">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Rechercher..."
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none w-full"
        />
      </div> */}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-700 font-medium hidden sm:inline">Opérationnel</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-senred-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-40 max-h-96 overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-gray-500">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</span>
                  )}
                </div>
                <div className="overflow-y-auto flex-1">
                  {mockNotifications.length > 0 ? (
                    mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${
                          !notif.read_at ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!notif.read_at && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(notif.created_at || '')}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      Aucune notification
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('notifications');
                    }}
                    className="w-full text-xs text-green-600 hover:text-green-700 font-medium py-1"
                  >
                    Voir toutes les notifications →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
