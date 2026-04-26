import { useState } from 'react';
import { Plus, Filter, CheckCircle2, Circle, AlertCircle, Shield, Bus, CreditCard, Calendar, Camera } from 'lucide-react';
import Modal from '../components/ui/Modal';
import PageHeader from '../components/ui/PageHeader';
import { mockTasks, mockSites, mockUsers } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import type { Task, TaskStatus, TaskPriority, TaskCategory } from '../types';

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    pending: 'bg-gray-100 text-gray-700 border-gray-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const labels = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
  };

  const icons = {
    pending: Circle,
    in_progress: AlertCircle,
    completed: CheckCircle2,
    cancelled: Circle,
  };

  const Icon = icons[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status]}`}>
      <Icon className="w-3 h-3" />
      {labels[status]}
    </span>
  );
}

function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-amber-100 text-amber-700',
    urgent: 'bg-senred-100 text-senred-700',
  };

  const labels = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée',
    urgent: 'Urgente',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}

function TaskCategoryBadge({ category }: { category: TaskCategory }) {
  const config = {
    securite: { 
      style: 'bg-senred-50 text-senred-700 border-senred-200',
      label: 'Sécurité',
      icon: Shield
    },
    transports: { 
      style: 'bg-sky-50 text-sky-700 border-sky-200',
      label: 'Transports',
      icon: Bus
    },
    accreditations: { 
      style: 'bg-gold-50 text-gold-700 border-gold-200',
      label: 'Accréditations',
      icon: CreditCard
    },
    protocole: { 
      style: 'bg-purple-50 text-purple-700 border-purple-200',
      label: 'Protocole',
      icon: Calendar
    },
    medias: { 
      style: 'bg-pink-50 text-pink-700 border-pink-200',
      label: 'Médias',
      icon: Camera
    },
  };

  const { style, label, icon: Icon } = config[category];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${style}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export default function Taches() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [selected, setSelected] = useState<Task | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'securite' as TaskCategory,
    priority: 'medium' as TaskPriority,
    site_id: '',
    scheduled_time: '',
  });

  // Filtrer les tâches selon le rôle de l'utilisateur
  const isManager = user?.role?.name === 'manager';
  const userTeam = user?.team;

  // Si c'est un manager, filtrer par son équipe
  const tasksToShow = isManager && userTeam
    ? mockTasks.filter(task => task.category === userTeam)
    : mockTasks;

  // Filtrer les utilisateurs de la même équipe pour le manager
  const teamMembers = isManager && userTeam
    ? mockUsers.filter(u => u.team === userTeam)
    : mockUsers;

  const filtered = tasksToShow.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const counts = {
    pending: tasksToShow.filter((t) => t.status === 'pending').length,
    in_progress: tasksToShow.filter((t) => t.status === 'in_progress').length,
    completed: tasksToShow.filter((t) => t.status === 'completed').length,
    urgent: tasksToShow.filter((t) => t.priority === 'urgent').length,
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatTime = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouvelle tâche:', formData);
    setFormData({
      title: '',
      description: '',
      category: 'securite',
      priority: 'medium',
      site_id: '',
      scheduled_time: '',
    });
    setShowCreateForm(false);
    alert('Tâche créée avec succès !');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'En attente', value: counts.pending, color: 'border-l-gray-500 bg-gray-50', val: 'pending' as TaskStatus },
          { label: 'En cours', value: counts.in_progress, color: 'border-l-blue-500 bg-blue-50', val: 'in_progress' as TaskStatus },
          { label: 'Terminées', value: counts.completed, color: 'border-l-green-500 bg-green-50', val: 'completed' as TaskStatus },
          { label: 'Urgentes', value: counts.urgent, color: 'border-l-senred-500 bg-senred-50', val: null },
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
            // Seul l'admin peut créer des tâches, pas le manager
            !isManager ? (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouvelle tâche
              </button>
            ) : null
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
                onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminées</option>
                <option value="cancelled">Annulées</option>
              </select>
              
              {/* Filtre par priorité */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toutes priorités</option>
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          }
        />

        <div className="px-5 pb-2 flex items-center justify-between border-b border-gray-50">
          <h3 className="text-base font-semibold text-gray-800 pb-4">
            {filtered.length} tâche{filtered.length > 1 ? 's' : ''}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tâche</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priorité</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Heure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => setSelected(task)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{task.assignee?.name || 'Non assigné'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <TaskCategoryBadge category={task.category} />
                  </td>
                  <td className="px-4 py-4"><TaskPriorityBadge priority={task.priority} /></td>
                  <td className="px-4 py-4"><TaskStatusBadge status={task.status} /></td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-500">{formatTime(task.scheduled_time)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail de la tâche" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <TaskCategoryBadge category={selected.category} />
              <TaskPriorityBadge priority={selected.priority} />
              <TaskStatusBadge status={selected.status} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">{selected.title}</h4>
            {selected.description && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">{selected.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Assigné à</p>
                <p className="text-sm text-gray-900">{selected.assignee?.name || 'Non assigné'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Lieu</p>
                <p className="text-sm text-gray-900">{selected.site?.name || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Heure prévue</p>
                <p className="text-sm text-gray-900">{formatDate(selected.scheduled_time)}</p>
              </div>
              {selected.completed_at && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Terminée le</p>
                  <p className="text-sm text-gray-900">{formatDate(selected.completed_at)}</p>
                </div>
              )}
            </div>
            
            {/* Section d'assignation pour le manager */}
            {isManager && !selected.assignee && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Assigner cette tâche à un membre de votre équipe</p>
                <div className="space-y-2">
                  {teamMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => {
                        console.log('Assigner la tâche', selected.id, 'à', member.name);
                        alert(`Tâche assignée à ${member.name}`);
                        setSelected(null);
                      }}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 font-semibold text-sm">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role?.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              {selected.status !== 'completed' && selected.status !== 'cancelled' && (
                <>
                  {selected.status === 'pending' && (
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                      Démarrer la tâche
                    </button>
                  )}
                  {selected.status === 'in_progress' && (
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors">
                      Marquer terminée
                    </button>
                  )}
                  {!isManager && (
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
                      Modifier
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)} title="Créer une nouvelle tâche" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la tâche <span className="text-senred-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              placeholder="Ex: Inspection périmètre de sécurité"
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
              placeholder="Décrivez la tâche en détail..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-senred-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none"
                >
                  <option value="securite">Sécurité</option>
                  <option value="transports">Transports</option>
                  <option value="accreditations">Accréditations</option>
                  <option value="protocole">Protocole</option>
                  <option value="medias">Médias</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {formData.category === 'securite' && <Shield className="w-4 h-4 text-senred-600" />}
                  {formData.category === 'transports' && <Bus className="w-4 h-4 text-sky-600" />}
                  {formData.category === 'accreditations' && <CreditCard className="w-4 h-4 text-gold-600" />}
                  {formData.category === 'protocole' && <Calendar className="w-4 h-4 text-purple-600" />}
                  {formData.category === 'medias' && <Camera className="w-4 h-4 text-pink-600" />}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priorité <span className="text-senred-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                required
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="site_id" className="block text-sm font-medium text-gray-700 mb-1">
                Site
              </label>
              <select
                id="site_id"
                name="site_id"
                value={formData.site_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="">Non spécifié</option>
                {mockSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="scheduled_time" className="block text-sm font-medium text-gray-700 mb-1">
                Heure prévue
              </label>
              <input
                type="datetime-local"
                id="scheduled_time"
                name="scheduled_time"
                value={formData.scheduled_time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
            >
              Créer la tâche
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
