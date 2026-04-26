import { Users as UsersIcon, Mail, Shield, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers } from '../lib/mockData';

const teamLabels: Record<string, string> = {
  securite: 'Sécurité',
  transports: 'Transports',
  accreditations: 'Accréditations',
  protocole: 'Protocole',
  medias: 'Médias',
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

export default function Team() {
  const { user } = useAuth();
  const userTeam = user?.team;

  // Filtrer les membres de l'équipe
  const teamMembers = userTeam
    ? mockUsers.filter(u => u.team === userTeam)
    : [];

  if (!userTeam) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Vous n'êtes pas assigné à une équipe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* En-tête de l'équipe */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-card p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Équipe {teamLabels[userTeam]}</h1>
            <p className="text-green-100 text-sm">
              {teamMembers.length} membre{teamMembers.length > 1 ? 's' : ''} dans votre équipe
            </p>
          </div>
        </div>
      </div>

      {/* Liste des membres */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Membres de l'équipe</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="border border-gray-100 rounded-xl p-5 hover:border-green-200 hover:shadow-card transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-800 font-bold text-xl">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-gray-900 truncate mb-1">
                    {member.name}
                  </h4>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    {roleLabels[member.role?.name || ''] || member.role?.name}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>

                {member.site && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{member.site.name}</span>
                  </div>
                )}

                {member.role?.description && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{member.role.description}</span>
                  </div>
                )}
              </div>

              {/* Indicateur si c'est l'utilisateur connecté */}
              {member.id === user?.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Vous
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques de l'équipe */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-card p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 mb-1">Total membres</p>
          <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 mb-1">Managers</p>
          <p className="text-2xl font-bold text-gray-900">
            {teamMembers.filter(m => m.role?.name === 'manager').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4 border-l-4 border-amber-500">
          <p className="text-sm text-gray-500 mb-1">Opérateurs</p>
          <p className="text-2xl font-bold text-gray-900">
            {teamMembers.filter(m => m.role?.name === 'operator').length}
          </p>
        </div>
      </div>
    </div>
  );
}
