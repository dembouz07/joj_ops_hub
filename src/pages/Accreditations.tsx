import { useState } from 'react';
import { CreditCard, AlertCircle, Plus, User } from 'lucide-react';
import { AccreditationStatusBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { mockAccreditations, mockUsers } from '../lib/mockData';
import type { AccreditationStatus } from '../types';

const badgeTypeColors: Record<string, string> = {
  ALL_ACCESS: 'bg-gold-100 text-gold-800 border border-gold-300',
  SECURITY: 'bg-senred-50 text-senred-700 border border-senred-200',
  TRANSPORT: 'bg-sky-50 text-sky-700 border border-sky-200',
  PROTOCOL: 'bg-terra-50 text-terra-700 border border-terra-200',
  MEDIA: 'bg-green-50 text-green-700 border border-green-200',
  OPERATIONS: 'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function Accreditations() {
  const [filter, setFilter] = useState<AccreditationStatus | 'all'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    user_name: '',
    badge_type: 'OPERATIONS',
    valid_from: '',
    valid_until: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const filtered = mockAccreditations.filter((a) =>
    filter === 'all' ? true : a.status === filter
  );

  const expiringSoon = mockAccreditations.filter((a) => {
    if (a.status !== 'active') return false;
    const until = new Date(a.valid_until);
    const now = new Date();
    const diff = (until.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diff <= 7;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const daysLeft = (d: string) => {
    const diff = (new Date(d).getTime() - Date.now()) / (1000 * 3600 * 24);
    return Math.ceil(diff);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowUserDropdown(value.length > 0);
  };

  const handleUserSelect = (user: typeof mockUsers[0]) => {
    setFormData(prev => ({ 
      ...prev, 
      user_id: user.id.toString(),
      user_name: user.name 
    }));
    setSearchQuery(user.name);
    setShowUserDropdown(false);
  };

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limiter à 5 résultats

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_id) {
      alert('Veuillez sélectionner un utilisateur');
      return;
    }
    
    console.log('Nouvelle accréditation:', formData);
    
    // Réinitialiser le formulaire
    setFormData({
      user_id: '',
      user_name: '',
      badge_type: 'OPERATIONS',
      valid_from: '',
      valid_until: '',
    });
    setSearchQuery('');
    setShowCreateForm(false);
    alert('Accréditation créée avec succès !');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {expiringSoon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {expiringSoon.length} accréditation{expiringSoon.length > 1 ? 's' : ''} expire{expiringSoon.length === 1 ? '' : 'nt'} dans moins de 7 jours
            </p>
            <p className="text-xs text-amber-600 mt-1">
              {expiringSoon.map(a => a.user?.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Actives', value: mockAccreditations.filter(a => a.status === 'active').length, c: 'text-green-700 bg-green-50 border-green-200' },
          { label: 'Suspendues', value: mockAccreditations.filter(a => a.status === 'suspended').length, c: 'text-senred-700 bg-senred-50 border-senred-200' },
          { label: 'Expirées', value: mockAccreditations.filter(a => a.status === 'expired').length, c: 'text-gray-600 bg-gray-50 border-gray-200' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 border ${item.c}`}>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(['all', 'active', 'suspended', 'expired'] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === 'all' ? 'Toutes' : s === 'active' ? 'Actives' : s === 'suspended' ? 'Suspendues' : 'Expirées'}
              </button>
            ))}
          </div>
          {/* <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle accréditation
          </button> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {filtered.map((acc) => {
            const days = daysLeft(acc.valid_until);
            return (
              <div key={acc.id} className={`border rounded-xl p-4 hover:shadow-card transition-all cursor-pointer ${acc.status === 'suspended' ? 'border-senred-200 bg-senred-50/30' : acc.status === 'expired' ? 'border-gray-200 bg-gray-50/50 opacity-70' : 'border-gray-100 hover:border-green-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-700" />
                  </div>
                  <AccreditationStatusBadge status={acc.status} />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{acc.user?.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{acc.user?.email}</p>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${badgeTypeColors[acc.badge_type] || 'bg-gray-100 text-gray-700'}`}>
                  {acc.badge_type}
                </span>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Validité</span>
                    <span className={`font-medium ${days < 0 ? 'text-gray-400' : days <= 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {days < 0 ? 'Expirée' : days === 0 ? 'Expire aujourd\'hui' : `J+${days}`}
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs text-gray-400">
                    {formatDate(acc.valid_from)} → {formatDate(acc.valid_until)}
                  </div>
                </div>
                {acc.status !== 'suspended' && acc.status !== 'expired' && (
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-1.5 text-xs text-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium">
                      Modifier
                    </button>
                    <button className="flex-1 py-1.5 text-xs text-center bg-senred-50 hover:bg-senred-100 text-senred-700 rounded-lg transition-colors font-medium">
                      Suspendre
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de création d'accréditation */}
      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)} title="Créer une nouvelle accréditation" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="user_search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher un utilisateur <span className="text-senred-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="user_search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowUserDropdown(true)}
                placeholder="Tapez un nom ou email..."
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                autoComplete="off"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* Dropdown de résultats */}
            {showUserDropdown && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleUserSelect(user)}
                    className="w-full px-3 py-2.5 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700 font-semibold text-xs">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.role && (
                          <p className="text-xs text-gray-400">{user.role.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Message si aucun résultat */}
            {showUserDropdown && searchQuery && filteredUsers.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-sm text-gray-500 text-center">Aucun utilisateur trouvé</p>
              </div>
            )}
            
            {/* Utilisateur sélectionné */}
            {formData.user_id && formData.user_name && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">
                  <span className="text-green-800 font-semibold text-xs">
                    {formData.user_name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-green-800 flex-1">{formData.user_name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, user_id: '', user_name: '' }));
                    setSearchQuery('');
                  }}
                  className="text-green-600 hover:text-green-800 text-xs font-medium"
                >
                  Changer
                </button>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              Commencez à taper pour rechercher parmi tous les utilisateurs
            </p>
          </div>

          <div>
            <label htmlFor="badge_type" className="block text-sm font-medium text-gray-700 mb-1">
              Type de badge <span className="text-senred-500">*</span>
            </label>
            <select
              id="badge_type"
              name="badge_type"
              required
              value={formData.badge_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="ALL_ACCESS">Accès Complet (ALL_ACCESS)</option>
              <option value="SECURITY">Sécurité (SECURITY)</option>
              <option value="TRANSPORT">Transport (TRANSPORT)</option>
              <option value="PROTOCOL">Protocole (PROTOCOL)</option>
              <option value="MEDIA">Médias (MEDIA)</option>
              <option value="OPERATIONS">Opérations (OPERATIONS)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Le type de badge détermine les zones accessibles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="valid_from" className="block text-sm font-medium text-gray-700 mb-1">
                Date de début <span className="text-senred-500">*</span>
              </label>
              <input
                type="date"
                id="valid_from"
                name="valid_from"
                required
                value={formData.valid_from}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label htmlFor="valid_until" className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin <span className="text-senred-500">*</span>
              </label>
              <input
                type="date"
                id="valid_until"
                name="valid_until"
                required
                value={formData.valid_until}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Information importante</p>
                <p>L'accréditation sera active dès sa création. L'utilisateur recevra une notification avec les détails de son badge.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
            >
              Créer l'accréditation
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
