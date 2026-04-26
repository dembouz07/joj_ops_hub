import { useState, useRef, useEffect } from 'react';
import { Plus, Filter, MapPin, User, Clock, X, Search } from 'lucide-react';
import { SeverityBadge, StatusBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import PageHeader from '../components/ui/PageHeader';
import { mockIncidents, mockSites, mockUsers, mockRoles } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import type { Incident, IncidentStatus, IncidentSeverity } from '../types';

export default function Incidents() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'all'>('all');
  const [selected, setSelected] = useState<Incident | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as IncidentSeverity,
    site_id: '',
    assigned_to: '',
  });
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [userSearch, setUserSearch] = useState<string>('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const filtered = mockIncidents.filter((i) => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && i.severity !== filterSeverity) return false;
    return true;
  });

  const counts = {
    open: mockIncidents.filter((i) => i.status === 'open').length,
    in_progress: mockIncidents.filter((i) => i.status === 'in_progress').length,
    resolved: mockIncidents.filter((i) => i.status === 'resolved').length,
    critical: mockIncidents.filter((i) => i.severity === 'critical').length,
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour envoyer les données au backend
    console.log('Nouvel incident:', formData);
    // Réinitialiser le formulaire et fermer le modal
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      site_id: '',
      assigned_to: '',
    });
    setShowCreateForm(false);
    // Afficher un message de succès
    alert('Incident créé avec succès !');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filtrer les utilisateurs par rôle et recherche
  const filteredUsers = mockUsers.filter(user => {
    const matchesRole = !selectedRole || user.role_id === parseInt(selectedRole);
    const matchesSearch = !userSearch || 
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const selectedUser = mockUsers.find(u => u.id === parseInt(formData.assigned_to));

  const handleUserSelect = (userId: number) => {
    setFormData(prev => ({ ...prev, assigned_to: userId.toString() }));
    setShowUserDropdown(false);
    setUserSearch('');
  };

  const handleClearUser = () => {
    setFormData(prev => ({ ...prev, assigned_to: '' }));
    setUserSearch('');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Ouverts', value: counts.open, color: 'border-l-senred-500 bg-senred-50', val: 'open' as IncidentStatus },
          { label: 'En cours', value: counts.in_progress, color: 'border-l-amber-500 bg-amber-50', val: 'in_progress' as IncidentStatus },
          { label: 'Résolus', value: counts.resolved, color: 'border-l-green-500 bg-green-50', val: 'resolved' as IncidentStatus },
          { label: 'Critiques', value: counts.critical, color: 'border-l-senred-700 bg-senred-50', val: null },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => item.val && setFilterStatus(item.val === filterStatus ? 'all' : item.val)}
            className={`bg-white rounded-xl p-4 shadow-card text-left border-l-4 transition-all hover:shadow-card-hover ${item.color} ${filterStatus === item.val ? 'ring-2 ring-green-400' : ''}`}
          >
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <PageHeader
          actions={
            user?.role?.name !== "chef d'équipe" ? (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouvel incident
              </button>
            ) : undefined
          }
          filters={
            <div className="flex flex-wrap gap-3 px-5 pb-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Filter className="w-3.5 h-3.5" />
                Filtres :
              </div>
              
              {/* Filtre par statut */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as IncidentStatus | 'all')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="open">Ouverts</option>
                <option value="in_progress">En cours</option>
                <option value="resolved">Résolus</option>
              </select>
              
              {/* Filtre par sévérité */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as IncidentSeverity | 'all')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toutes sévérités</option>
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
                <option value="critical">Critique</option>
              </select>
            </div>
          }
        />

        <div className="px-5 pb-2 flex items-center justify-between border-b border-gray-50">
          <h3 className="text-base font-semibold text-gray-800 pb-4">
            {filtered.length} incident{filtered.length > 1 ? 's' : ''}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Incident</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Site</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sévérité</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() => setSelected(incident)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{incident.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{incident.creator?.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-700">{incident.site?.name}</p>
                  </td>
                  <td className="px-4 py-4"><SeverityBadge severity={incident.severity} /></td>
                  <td className="px-4 py-4"><StatusBadge status={incident.status} /></td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-500">{formatDate(incident.started_at)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail de l'incident" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <SeverityBadge severity={selected.severity} />
              <StatusBadge status={selected.status} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">{selected.title}</h4>
            {selected.description && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">{selected.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Site</p>
                <p className="text-sm text-gray-900">{selected.site?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Créé par</p>
                <p className="text-sm text-gray-900">{selected.creator?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Assigné à</p>
                <p className="text-sm text-gray-900">{selected.assignee?.name || 'Non assigné'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Début</p>
                <p className="text-sm text-gray-900">{formatDate(selected.started_at)}</p>
              </div>
              {selected.resolved_at && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Résolu le</p>
                  <p className="text-sm text-gray-900">{formatDate(selected.resolved_at)}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              {selected.status !== 'resolved' && (
                <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors">
                  Marquer résolu
                </button>
              )}
              {!selected.assigned_to && (
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
                  Assigner
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)} title="Créer un nouvel incident" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de l'incident <span className="text-senred-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              placeholder="Ex: Intrusion périmètre nord"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
              placeholder="Décrivez l'incident en détail..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Sévérité <span className="text-senred-500">*</span>
              </label>
              <select
                id="severity"
                name="severity"
                required
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
                <option value="critical">Critique</option>
              </select>
            </div>

            <div>
              <label htmlFor="site_id" className="block text-sm font-medium text-gray-700 mb-1">
                Site <span className="text-senred-500">*</span>
              </label>
              <select
                id="site_id"
                name="site_id"
                required
                value={formData.site_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="">Sélectionner un site</option>
                {mockSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-1">
              Assigner à
            </label>
            
            {/* Filtre par rôle */}
            <div className="mb-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="">Tous les rôles</option>
                {mockRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.description || role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Champ de recherche avec dropdown */}
            <div className="relative">
              {selectedUser ? (
                <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {selectedUser.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                      <p className="text-xs text-gray-500">{selectedUser.role?.name}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearUser}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onFocus={() => setShowUserDropdown(true)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  {showUserDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserDropdown(false)}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleUserSelect(user.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-semibold">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.role?.name} • {user.email}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-center text-sm text-gray-500">
                            Aucun utilisateur trouvé
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} disponible{filteredUsers.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
            >
              Créer l'incident
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
