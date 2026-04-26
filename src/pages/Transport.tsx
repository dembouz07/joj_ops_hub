import { useState } from 'react';
import { Bus, MapPin, Clock, ArrowRight, Plus } from 'lucide-react';
import { TransportStatusBadge } from '../components/ui/Badge';
import { mockTransports, mockMovements } from '../lib/mockData';
import type { TransportStatus } from '../types';

export default function Transport() {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'movements'>('vehicles');
  const [filterStatus, setFilterStatus] = useState<TransportStatus | 'all'>('all');

  const filtered = mockTransports.filter((t) =>
    filterStatus === 'all' ? true : t.status === filterStatus
  );

  const formatTime = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const movementStatusColor: Record<string, string> = {
    completed: 'text-green-600 bg-green-50',
    delayed: 'text-senred-600 bg-senred-50',
    en_route: 'text-amber-600 bg-amber-50',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Actifs', value: mockTransports.filter(t => t.status === 'active').length, color: 'text-green-700 bg-green-50 border-green-200' },
          { label: 'En maintenance', value: mockTransports.filter(t => t.status === 'maintenance').length, color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Retardés', value: mockTransports.filter(t => t.status === 'delayed').length, color: 'text-senred-700 bg-senred-50 border-senred-200' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 border ${item.color}`}>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setActiveTab('vehicles')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'vehicles' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}>
                Véhicules ({mockTransports.length})
              </button>
              <button onClick={() => setActiveTab('movements')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'movements' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}>
                Mouvements ({mockMovements.length})
              </button>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'vehicles' && (['all', 'active', 'maintenance', 'delayed'] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s === 'all' ? 'Tous' : s === 'active' ? 'Actifs' : s === 'maintenance' ? 'Maintenance' : 'Retardés'}
                </button>
              ))}
              <button className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {filtered.map((transport) => (
              <div key={transport.id} className="border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-card transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-green-600" />
                  </div>
                  <TransportStatusBadge status={transport.status} />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{transport.name}</h4>
                <p className="text-xs text-gray-500 capitalize mb-2">{transport.type}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {transport.site?.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                  {transport.capacity && (
                    <span className="font-medium text-gray-700">{transport.capacity} places</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'movements' && (
          <div className="divide-y divide-gray-50">
            {mockMovements.map((movement) => (
              <div key={movement.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <Bus className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{movement.transport?.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="truncate">{movement.from_site?.name}</span>
                      <ArrowRight className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{movement.to_site?.name}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Départ</p>
                        <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(movement.departure_time)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Arrivée</p>
                        <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(movement.arrival_time)}
                        </p>
                      </div>
                      {movement.status && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${movementStatusColor[movement.status] || 'text-gray-600 bg-gray-100'}`}>
                          {movement.status === 'completed' ? 'Arrivé' : movement.status === 'delayed' ? 'Retardé' : 'En route'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
