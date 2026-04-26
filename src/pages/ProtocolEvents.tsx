import { useState } from 'react';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { mockProtocolEvents } from '../lib/mockData';
import type { ProtocolEvent } from '../types';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'neutral' }> = {
  upcoming: { label: 'À venir', variant: 'info' },
  ongoing: { label: 'En cours', variant: 'warning' },
  completed: { label: 'Terminé', variant: 'success' },
  cancelled: { label: 'Annulé', variant: 'neutral' },
};

const typeLabels: Record<string, string> = {
  ceremonie: 'Cérémonie',
  reception: 'Réception',
  medailles: 'Médailles',
  conference: 'Conférence',
};

const typeColors: Record<string, string> = {
  ceremonie: 'bg-gold-100 text-gold-800',
  reception: 'bg-terra-50 text-terra-700',
  medailles: 'bg-green-50 text-green-700',
  conference: 'bg-sky-50 text-sky-700',
};

export default function ProtocolEvents() {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<ProtocolEvent | null>(null);

  const filtered = mockProtocolEvents.filter((e) =>
    filter === 'all' ? true : e.status === filter
  );

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });

  const formatTime = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'À venir', value: mockProtocolEvents.filter(e => e.status === 'upcoming').length, color: 'text-sky-700 bg-sky-50 border-sky-200' },
          { label: 'En cours', value: mockProtocolEvents.filter(e => e.status === 'ongoing').length, color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Terminés', value: mockProtocolEvents.filter(e => e.status === 'completed').length, color: 'text-green-700 bg-green-50 border-green-200' },
          { label: 'Total', value: mockProtocolEvents.length, color: 'text-gray-700 bg-gray-50 border-gray-200' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 border ${item.color}`}>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === 'all' ? 'Tous' : statusConfig[s]?.label || s}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Nouvel événement
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map((event) => {
            const sc = statusConfig[event.status || ''] || { label: event.status, variant: 'neutral' as const };
            return (
              <div key={event.id} onClick={() => setSelected(event)} className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex flex-col items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                      <Badge variant={sc.variant}>{sc.label}</Badge>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[event.type] || 'bg-gray-100 text-gray-600'}`}>
                        {typeLabels[event.type] || event.type}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{event.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(event.start_time)} – {formatTime(event.end_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.site?.name}
                      </span>
                    </div>
                  </div>
                  {event.status === 'ongoing' && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                      En cours
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail de l'événement" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusConfig[selected.status || '']?.variant || 'neutral'}>
                {statusConfig[selected.status || '']?.label || selected.status}
              </Badge>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[selected.type] || 'bg-gray-100'}`}>
                {typeLabels[selected.type] || selected.type}
              </span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900">{selected.title}</h4>
            {selected.description && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">{selected.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Site</p>
                <p className="text-sm text-gray-900">{selected.site?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Début</p>
                <p className="text-sm text-gray-900">{formatDateTime(selected.start_time)}</p>
              </div>
              {selected.end_time && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Fin</p>
                  <p className="text-sm text-gray-900">{formatDateTime(selected.end_time)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
