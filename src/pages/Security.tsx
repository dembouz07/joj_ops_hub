import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, User, Eye } from 'lucide-react';
import Modal from '../components/ui/Modal';
import PageHeader from '../components/ui/PageHeader';
import { mockSites, mockUsers } from '../lib/mockData';

type SecurityStatus = 'secure' | 'warning' | 'alert' | 'critical';
type AccessLevel = 'all_access' | 'restricted' | 'vip' | 'staff' | 'media';

interface SecurityEvent {
  id: number;
  type: 'access_denied' | 'intrusion' | 'suspicious_activity' | 'system_check' | 'access_granted';
  status: SecurityStatus;
  title: string;
  description: string;
  site_id: number;
  site?: typeof mockSites[0];
  detected_at: string;
  resolved_at: string | null;
  detected_by?: typeof mockUsers[0];
}

interface AccessControl {
  id: number;
  zone: string;
  site_id: number;
  site?: typeof mockSites[0];
  access_level: AccessLevel;
  status: 'active' | 'inactive';
  people_count: number;
  capacity: number;
  last_check: string;
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 1,
    type: 'intrusion',
    status: 'critical',
    title: 'Tentative d\'intrusion détectée',
    description: 'Personne non autorisée détectée dans la zone VIP du stade',
    site_id: 1,
    site: mockSites[0],
    detected_at: '2026-04-25T14:30:00Z',
    resolved_at: null,
    detected_by: mockUsers[1],
  },
  {
    id: 2,
    type: 'access_denied',
    status: 'warning',
    title: 'Accès refusé - Badge expiré',
    description: 'Tentative d\'accès avec un badge expiré à l\'entrée principale',
    site_id: 2,
    site: mockSites[1],
    detected_at: '2026-04-25T13:15:00Z',
    resolved_at: '2026-04-25T13:20:00Z',
    detected_by: mockUsers[6],
  },
  {
    id: 3,
    type: 'suspicious_activity',
    status: 'warning',
    title: 'Activité suspecte - Zone technique',
    description: 'Personne photographiant les installations de sécurité',
    site_id: 5,
    site: mockSites[4],
    detected_at: '2026-04-25T12:00:00Z',
    resolved_at: null,
    detected_by: mockUsers[6],
  },
  {
    id: 4,
    type: 'system_check',
    status: 'secure',
    title: 'Vérification système complétée',
    description: 'Tous les systèmes de sécurité fonctionnent normalement',
    site_id: 1,
    site: mockSites[0],
    detected_at: '2026-04-25T11:00:00Z',
    resolved_at: '2026-04-25T11:30:00Z',
    detected_by: mockUsers[1],
  },
  {
    id: 5,
    type: 'access_granted',
    status: 'secure',
    title: 'Accès VIP autorisé',
    description: 'Délégation officielle accédée à la zone protocolaire',
    site_id: 1,
    site: mockSites[0],
    detected_at: '2026-04-25T10:30:00Z',
    resolved_at: '2026-04-25T10:31:00Z',
    detected_by: mockUsers[1],
  },
];

const mockAccessControls: AccessControl[] = [
  {
    id: 1,
    zone: 'Entrée principale',
    site_id: 1,
    site: mockSites[0],
    access_level: 'all_access',
    status: 'active',
    people_count: 1250,
    capacity: 2000,
    last_check: '2026-04-25T14:45:00Z',
  },
  {
    id: 2,
    zone: 'Zone VIP',
    site_id: 1,
    site: mockSites[0],
    access_level: 'vip',
    status: 'active',
    people_count: 85,
    capacity: 100,
    last_check: '2026-04-25T14:40:00Z',
  },
  {
    id: 3,
    zone: 'Zone presse',
    site_id: 7,
    site: mockSites[6],
    access_level: 'media',
    status: 'active',
    people_count: 120,
    capacity: 150,
    last_check: '2026-04-25T14:35:00Z',
  },
  {
    id: 4,
    zone: 'Zone technique',
    site_id: 2,
    site: mockSites[1],
    access_level: 'staff',
    status: 'active',
    people_count: 45,
    capacity: 50,
    last_check: '2026-04-25T14:30:00Z',
  },
  {
    id: 5,
    zone: 'Vestiaires athlètes',
    site_id: 6,
    site: mockSites[5],
    access_level: 'restricted',
    status: 'active',
    people_count: 180,
    capacity: 200,
    last_check: '2026-04-25T14:25:00Z',
  },
];

function SecurityStatusBadge({ status }: { status: SecurityStatus }) {
  const config = {
    secure: {
      style: 'bg-green-50 text-green-700 border-green-200',
      label: 'Sécurisé',
      icon: CheckCircle,
    },
    warning: {
      style: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Attention',
      icon: AlertTriangle,
    },
    alert: {
      style: 'bg-orange-50 text-orange-700 border-orange-200',
      label: 'Alerte',
      icon: AlertTriangle,
    },
    critical: {
      style: 'bg-senred-50 text-senred-700 border-senred-200',
      label: 'Critique',
      icon: XCircle,
    },
  };

  const { style, label, icon: Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${style}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function AccessLevelBadge({ level }: { level: AccessLevel }) {
  const config = {
    all_access: { style: 'bg-blue-50 text-blue-700', label: 'Accès libre' },
    restricted: { style: 'bg-orange-50 text-orange-700', label: 'Restreint' },
    vip: { style: 'bg-gold-50 text-gold-700', label: 'VIP' },
    staff: { style: 'bg-gray-50 text-gray-700', label: 'Personnel' },
    media: { style: 'bg-pink-50 text-pink-700', label: 'Médias' },
  };

  const { style, label } = config[level];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}

export default function Security() {
  const [filterStatus, setFilterStatus] = useState<SecurityStatus | 'all'>('all');
  const [filterSite, setFilterSite] = useState<number | 'all'>('all');
  const [selected, setSelected] = useState<SecurityEvent | null>(null);

  const filtered = mockSecurityEvents.filter((e) => {
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    if (filterSite !== 'all' && e.site_id !== filterSite) return false;
    return true;
  });

  const counts = {
    secure: mockSecurityEvents.filter((e) => e.status === 'secure').length,
    warning: mockSecurityEvents.filter((e) => e.status === 'warning').length,
    alert: mockSecurityEvents.filter((e) => e.status === 'alert').length,
    critical: mockSecurityEvents.filter((e) => e.status === 'critical').length,
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Sécurisé', value: counts.secure, color: 'border-l-green-500 bg-green-50', val: 'secure' as SecurityStatus },
          { label: 'Attention', value: counts.warning, color: 'border-l-amber-500 bg-amber-50', val: 'warning' as SecurityStatus },
          { label: 'Alerte', value: counts.alert, color: 'border-l-orange-500 bg-orange-50', val: 'alert' as SecurityStatus },
          { label: 'Critique', value: counts.critical, color: 'border-l-senred-500 bg-senred-50', val: 'critical' as SecurityStatus },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setFilterStatus(item.val === filterStatus ? 'all' : item.val)}
            className={`bg-white rounded-xl p-4 shadow-card text-left border-l-4 transition-all hover:shadow-card-hover ${item.color} ${filterStatus === item.val ? 'ring-2 ring-green-400' : ''}`}
          >
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Contrôles d'accès */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-base font-semibold text-gray-900">Contrôles d'accès en temps réel</h3>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAccessControls.map((control) => {
            const occupancy = Math.round((control.people_count / control.capacity) * 100);
            return (
              <div key={control.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{control.zone}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {control.site?.name}
                    </p>
                  </div>
                  <AccessLevelBadge level={control.access_level} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Occupation</span>
                    <span className="font-semibold text-gray-900">
                      {control.people_count} / {control.capacity}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occupancy > 90 ? 'bg-senred-500' :
                        occupancy > 75 ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(occupancy, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Dernière vérif: {formatDate(control.last_check)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Événements de sécurité */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <PageHeader
          filters={
            <div className="flex flex-wrap gap-3 px-5 pb-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Eye className="w-3.5 h-3.5" />
                Filtres :
              </div>
              
              {/* Filtre par statut */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SecurityStatus | 'all')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="secure">Sécurisé</option>
                <option value="warning">Attention</option>
                <option value="alert">Alerte</option>
                <option value="critical">Critique</option>
              </select>
              
              {/* Filtre par site */}
              <select
                value={filterSite}
                onChange={(e) => setFilterSite(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les sites</option>
                {mockSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        <div className="px-5 pb-2 flex items-center justify-between border-b border-gray-50">
          <h3 className="text-base font-semibold text-gray-800 pb-4">
            {filtered.length} événement{filtered.length > 1 ? 's' : ''} de sécurité
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Événement</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Site</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Détecté par</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => setSelected(event)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{event.description}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {event.site?.name}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <SecurityStatusBadge status={event.status} />
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {event.detected_by?.name || '—'}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(event.detected_at)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail de l'événement de sécurité" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <SecurityStatusBadge status={selected.status} />
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
                <p className="text-xs font-medium text-gray-500 mb-1">Site</p>
                <p className="text-sm text-gray-900">{selected.site?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Détecté par</p>
                <p className="text-sm text-gray-900">{selected.detected_by?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Date de détection</p>
                <p className="text-sm text-gray-900">{formatDate(selected.detected_at)}</p>
              </div>
              {selected.resolved_at && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Résolu le</p>
                  <p className="text-sm text-gray-900">{formatDate(selected.resolved_at)}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              {!selected.resolved_at && (
                <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors">
                  Marquer résolu
                </button>
              )}
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
                Créer un incident
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
