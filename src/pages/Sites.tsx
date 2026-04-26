import { useState } from 'react';
import { MapPin, Users, Building2, Plus, CircleDot, Dumbbell, Swords, Waves, Building, Home, Radio, Hotel } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { mockSites, mockSiteMetrics } from '../lib/mockData';
import type { Site } from '../types';

const typeConfig: Record<string, { label: string; color: string; icon: any; bgColor: string }> = {
  stade: { label: 'Stade', color: 'text-green-700', icon: CircleDot, bgColor: 'bg-green-50' },
  complexe: { label: 'Complexe sportif', color: 'text-sky-700', icon: Dumbbell, bgColor: 'bg-sky-50' },
  arène: { label: 'Arène', color: 'text-terra-700', icon: Swords, bgColor: 'bg-terra-50' },
  piscine: { label: 'Piscine', color: 'text-cyan-700', icon: Waves, bgColor: 'bg-cyan-50' },
  palais: { label: 'Palais des sports', color: 'text-gold-800', icon: Building, bgColor: 'bg-gold-100' },
  hébergement: { label: 'Village athlètes', color: 'text-amber-700', icon: Home, bgColor: 'bg-amber-50' },
  médias: { label: 'Centre médias', color: 'text-senred-700', icon: Radio, bgColor: 'bg-senred-50' },
  hôtel: { label: 'Hôtel', color: 'text-purple-700', icon: Hotel, bgColor: 'bg-purple-50' },
};

export default function Sites() {
  const [selected, setSelected] = useState<Site | null>(null);

  const getMetric = (siteId: number) =>
    mockSiteMetrics.find((m) => m.site_id === siteId);

  const getPct = (site: Site) => {
    const m = getMetric(site.id);
    if (!site.capacity || !m) return 0;
    return Math.round((m.people_count / site.capacity) * 100);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{mockSites.length} sites JOJ Dakar 2026</h3>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau site
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
          {mockSites.map((site) => {
            const tc = typeConfig[site.type] || { label: site.type, color: 'text-gray-600', icon: Building2, bgColor: 'bg-gray-100' };
            const metric = getMetric(site.id);
            const pct = getPct(site);
            const IconComponent = tc.icon;

            return (
              <div
                key={site.id}
                onClick={() => setSelected(site)}
                className="border border-gray-100 rounded-xl p-5 hover:border-green-200 hover:shadow-card transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${tc.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${tc.color}`} />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tc.bgColor} ${tc.color}`}>
                    {tc.label}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{site.name}</h4>
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" />
                  {site.location}
                </p>

                {site.capacity && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {metric ? metric.people_count.toLocaleString('fr-FR') : '0'}
                        {' / '}
                        {site.capacity.toLocaleString('fr-FR')}
                      </span>
                      <span className={`font-bold ${pct > 90 ? 'text-senred-600' : pct > 75 ? 'text-amber-600' : 'text-green-600'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 90 ? 'bg-senred-500' : pct > 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail du site" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {(() => {
                const tc = typeConfig[selected.type] || { icon: Building2, bgColor: 'bg-gray-100', color: 'text-gray-600' };
                const IconComponent = tc.icon;
                return (
                  <div className={`w-12 h-12 rounded-lg ${tc.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${tc.color}`} />
                  </div>
                );
              })()}
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{selected.name}</h4>
                <p className="text-sm text-gray-500">{selected.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Type</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[selected.type]?.bgColor || 'bg-gray-100'} ${typeConfig[selected.type]?.color || 'text-gray-600'}`}>
                  {typeConfig[selected.type]?.label || selected.type}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Capacité totale</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {selected.capacity ? selected.capacity.toLocaleString('fr-FR') : 'N/A'} personnes
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Fréquentation actuelle</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  {(getMetric(selected.id)?.people_count || 0).toLocaleString('fr-FR')} visiteurs
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Taux d'occupation</p>
                <p className={`text-sm font-bold ${getPct(selected) > 90 ? 'text-senred-600' : getPct(selected) > 75 ? 'text-amber-600' : 'text-green-600'}`}>
                  {getPct(selected)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
