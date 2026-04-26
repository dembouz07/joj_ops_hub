import { useState } from 'react';
import { Camera, CheckCircle2, XCircle, Plus, Clock, MapPin } from 'lucide-react';
import { MediaStatusBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { mockMediaRequests } from '../lib/mockData';
import type { MediaRequest, MediaRequestStatus } from '../types';

export default function MediaRequests() {
  const [filter, setFilter] = useState<MediaRequestStatus | 'all'>('all');
  const [selected, setSelected] = useState<MediaRequest | null>(null);

  const filtered = mockMediaRequests.filter((m) =>
    filter === 'all' ? true : m.status === filter
  );

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'En attente', value: mockMediaRequests.filter(m => m.status === 'pending').length, c: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Approuvées', value: mockMediaRequests.filter(m => m.status === 'approved').length, c: 'text-green-700 bg-green-50 border-green-200' },
          { label: 'Rejetées', value: mockMediaRequests.filter(m => m.status === 'rejected').length, c: 'text-senred-700 bg-senred-50 border-senred-200' },
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
            {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === 'all' ? 'Toutes' : s === 'pending' ? 'En attente' : s === 'approved' ? 'Approuvées' : 'Rejetées'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle demande
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map((req) => (
            <div key={req.id} onClick={() => setSelected(req)} className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-terra-50 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-5 h-5 text-terra-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{req.title}</p>
                    <MediaStatusBadge status={req.status} />
                  </div>
                  {req.description && (
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{req.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {req.site?.name}
                    </span>
                    {req.event_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(req.event_time)}
                      </span>
                    )}
                  </div>
                </div>
                {req.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approuver
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-senred-700 bg-senred-50 hover:bg-senred-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail de la demande média" size="lg">
        {selected && (
          <div className="space-y-4">
            <MediaStatusBadge status={selected.status} />
            <h4 className="text-lg font-semibold text-gray-900">{selected.title}</h4>
            {selected.description && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">{selected.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Site</p>
                <p className="text-sm text-gray-900">{selected.site?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Demandé par</p>
                <p className="text-sm text-gray-900">{selected.requester?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Date de l'événement</p>
                <p className="text-sm text-gray-900">{formatDate(selected.event_time)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Soumis le</p>
                <p className="text-sm text-gray-900">{formatDate(selected.created_at || null)}</p>
              </div>
            </div>
            {selected.status === 'pending' && (
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Approuver
                </button>
                <button className="flex-1 py-2.5 bg-senred-50 hover:bg-senred-100 text-senred-700 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejeter
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
