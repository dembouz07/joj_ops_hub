import { useState } from 'react';
import { Plus, User, MapPin, Shield } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { mockUsers } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import type { User as UserType } from '../types';

const roleColors: Record<string, string> = {
  admin: 'bg-gold-100 text-gold-800',
  security_chief: 'bg-senred-50 text-senred-700',
  transport_manager: 'bg-sky-50 text-sky-700',
  protocol_officer: 'bg-terra-50 text-terra-700',
  media_officer: 'bg-green-50 text-green-700',
  operator: 'bg-gray-100 text-gray-700',
};

const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  security_chief: 'Chef Sécurité',
  transport_manager: 'Responsable Transport',
  protocol_officer: 'Officier Protocole',
  media_officer: 'Responsable Médias',
  operator: 'Opérateur',
  manager: 'Manager',
};

const teamLabels: Record<string, string> = {
  securite: 'Sécurité',
  transports: 'Transports',
  accreditations: 'Accréditations',
  protocole: 'Protocole',
  medias: 'Médias',
};

const teamColors: Record<string, string> = {
  securite: 'bg-senred-50 text-senred-700 border-senred-200',
  transports: 'bg-sky-50 text-sky-700 border-sky-200',
  accreditations: 'bg-gold-50 text-gold-700 border-gold-200',
  protocole: 'bg-purple-50 text-purple-700 border-purple-200',
  medias: 'bg-pink-50 text-pink-700 border-pink-200',
};

export default function Users() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<UserType | null>(null);

  const isManager = user?.role?.name === 'manager';
  const userTeam = user?.team;

  // Filtrer les utilisateurs selon l'équipe du manager
  const usersToShow = isManager && userTeam
    ? mockUsers.filter(u => u.team === userTeam)
    : mockUsers;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            {usersToShow.length} utilisateur{usersToShow.length > 1 ? 's' : ''}
            {isManager && userTeam && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - Équipe {teamLabels[userTeam]}
              </span>
            )}
          </h3>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Nouvel utilisateur
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
          {usersToShow.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelected(user)}
              className="border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-card transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-800 font-bold text-sm">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role?.name || ''] || 'bg-gray-100 text-gray-600'}`}>
                  {roleLabels[user.role?.name || ''] || user.role?.name}
                </span>
                {user.team && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${teamColors[user.team]}`}>
                    {teamLabels[user.team]}
                  </span>
                )}
              </div>
              {user.site && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.site.name.split(' ').slice(0, 3).join(' ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail utilisateur">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-800 font-bold text-2xl">{selected.name.charAt(0)}</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{selected.name}</h4>
                <p className="text-sm text-gray-500">{selected.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Rôle
                </p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[selected.role?.name || ''] || 'bg-gray-100'}`}>
                  {roleLabels[selected.role?.name || ''] || selected.role?.name}
                </span>
              </div>
              {selected.team && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Équipe
                  </p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${teamColors[selected.team]}`}>
                    {teamLabels[selected.team]}
                  </span>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Site assigné
                </p>
                <p className="text-sm text-gray-900">{selected.site?.name || 'Tous les sites'}</p>
              </div>
              {selected.role?.description && (
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Description du rôle</p>
                  <p className="text-sm text-gray-700">{selected.role.description}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
                Modifier
              </button>
              <button className="px-4 py-2 bg-senred-50 text-senred-700 text-sm font-medium rounded-xl hover:bg-senred-100 transition-colors">
                Désactiver
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
