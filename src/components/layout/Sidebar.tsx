import {
  LayoutDashboard, AlertTriangle, Bus, CreditCard,
  Calendar, Camera, BarChart3, FileText, Users, MapPin,
  Shield, LogOut, ChevronRight,
  ListTodo,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Page } from '../../types';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  group?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, group: 'general' },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: 3, group: 'general' },
  { id: 'taches', label: 'Taches', icon: ListTodo, group: 'general' },
  { id: 'team', label: 'Mon Équipe', icon: Users, group: 'general' }, // Nouveau bouton
  { id: 'security', label: 'Sécurité', icon: Shield, group: 'operations' },
  { id: 'transport', label: 'Transports', icon: Bus, group: 'operations' },
  { id: 'accreditations', label: 'Accréditations', icon: CreditCard, group: 'operations' },
  { id: 'protocol', label: 'Protocole', icon: Calendar, group: 'operations' },
  { id: 'media', label: 'Médias', icon: Camera, badge: 2, group: 'operations' },
  { id: 'metrics', label: 'Métriques', icon: BarChart3, group: 'analytique' },
  { id: 'reports', label: 'Rapports', icon: FileText, group: 'analytique' },
  { id: 'users', label: 'Utilisateurs', icon: Users, group: 'admin' },
  { id: 'sites', label: 'Sites', icon: MapPin, group: 'admin' },
];

const groupLabels: Record<string, string> = {
  general: 'Général',
  operations: 'Opérations',
  analytique: 'Analytique',
  admin: 'Administration',
};

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ currentPage, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  const { user, logout } = useAuth();

  const isManager = user?.role?.name === 'manager';
  const userTeam = user?.team;

  // Mapper les équipes aux pages d'opérations
  const teamToPage: Record<string, Page> = {
    securite: 'security',
    transports: 'transport',
    accreditations: 'accreditations',
    protocole: 'protocol',
    medias: 'media',
  };

  // Filtrer les items de navigation selon le rôle
  const filteredNavItems = navItems.filter(item => {
    // Si c'est un manager avec une équipe
    if (isManager && userTeam) {
      // Toujours montrer les pages générales (sauf "Mon Équipe" qui est toujours visible)
      if (item.group === 'general') return true;
      
      // Pour les opérations, montrer uniquement la page de son équipe
      if (item.group === 'operations') {
        return item.id === teamToPage[userTeam];
      }
      
      // Masquer les pages admin et analytique pour les managers
      return false;
    }
    
    // Pour les autres rôles (admin, etc.)
    // Masquer "Mon Équipe" si pas de team
    if (item.id === 'team' && !userTeam) return false;
    
    return true;
  });

  const grouped = filteredNavItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    const g = item.group || 'general';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const groups = ['general', 'operations', 'analytique', 'admin'].filter(g => grouped[g] && grouped[g].length > 0);

  const handleNav = (page: Page) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-green-900 z-50 flex flex-col shadow-sidebar transition-transform duration-300
          lg:translate-x-0 lg:relative lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="px-5 py-6 border-b border-green-800">
          <button 
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
          >
            <img 
              src="/JOH.png" 
              alt="JOJ Logo" 
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">JOJ OPS HUB</h1>
              <p className="text-gold-400 text-xs font-medium">Dakar 2026</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {groups.map((group) => {
            const items = grouped[group];
            if (!items) return null;
            return (
              <div key={group}>
                <p className="px-3 mb-2 text-xs font-semibold text-green-400 uppercase tracking-wider">
                  {groupLabels[group]}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNav(item.id)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                            ${isActive
                              ? 'bg-green-700 text-white'
                              : 'text-green-200 hover:bg-green-800 hover:text-white'
                            }
                          `}
                        >
                          <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-gold-400' : ''}`} />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge ? (
                            <span className="bg-senred-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                              {item.badge}
                            </span>
                          ) : isActive ? (
                            <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-green-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
              <span className="text-green-900 font-bold text-sm">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-green-400 text-xs truncate">{user?.role?.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-green-300 hover:bg-green-800 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
