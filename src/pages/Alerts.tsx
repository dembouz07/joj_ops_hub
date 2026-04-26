import { useState } from 'react';
import { Plus, Bell, CheckCircle2 } from 'lucide-react';
import { AlertLevelBadge, AlertStatusBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { mockAlerts } from '../lib/mockData';
import type { Alert, AlertLevel, AlertStatus } from '../types';

export default function Alerts() {
  const [filterLevel, setFilterLevel] = useState<AlertLevel | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<AlertStatus | 'all'>('active');
  const [selected, setSelected] = useState<Alert | null>(null);

  const filtered = mockAlerts.filter((a) => {
    if (filterLevel !== 'all' && a.level !== filterLevel) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const levelIcon: Record<AlertLevel, string> = {
    critical: '🔴',
    warning: '🟡',
    info: '🔵',
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Critiques actives', value: mockAlerts.filter(a => a.level === 'critical' && a.status === 'active').length, color: 'bg-senred-50 border-senred-200 text-senred-700' },
          { label: 'Avertissements', value: mockAlerts.filter(a => a.level === 'warning' && a.status === 'active').length, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Résolues', value: mockAlerts.filter(a => a.status === 'resolved').length, color: 'bg-green-50 border-green-200 text-green-700' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 border ${item.color}`}>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'resolved'] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === 'all' ? 'Toutes' : s === 'active' ? 'Actives' : 'Résolues'}
              </button>
            ))}
            <div className="w-px bg-gray-200 mx-1" />
            {(['all', 'critical', 'warning', 'info'] as const).map((l) => (
              <button key={l} onClick={() => setFilterLevel(l)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterLevel === l ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {l === 'all' ? 'Tous niveaux' : l === 'critical' ? 'Critique' : l === 'warning' ? 'Avertissement' : 'Info'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle alerte
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Aucune alerte correspondant aux filtres</p>
            </div>
          )}
          {filtered.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelected(alert)}
              className={`px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${alert.level === 'critical' && alert.status === 'active' ? 'border-l-4 border-l-senred-500' : alert.level === 'warning' && alert.status === 'active' ? 'border-l-4 border-l-amber-500' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-lg mt-0.5">{levelIcon[alert.level]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                      <AlertLevelBadge level={alert.level} />
                      <AlertStatusBadge status={alert.status} />
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Par {alert.creator?.name} · {formatDate(alert.created_at!)}
                    </p>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Résoudre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail de l'alerte">
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <AlertLevelBadge level={selected.level} />
              <AlertStatusBadge status={selected.status} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">{selected.title}</h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700">{selected.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Créé par</p>
                <p className="text-sm text-gray-900">{selected.creator?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Date</p>
                <p className="text-sm text-gray-900">{formatDate(selected.created_at!)}</p>
              </div>
              {selected.incident_id && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Incident lié</p>
                  <p className="text-sm text-green-600 font-medium">#{selected.incident_id}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
