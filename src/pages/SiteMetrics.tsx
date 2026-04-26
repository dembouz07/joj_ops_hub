import { BarChart2, Users, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from 'recharts';
import { mockSiteMetrics, mockSites, mockKpis } from '../lib/mockData';

export default function SiteMetrics() {
  const siteData = mockSites.map((site) => {
    const metric = mockSiteMetrics.find((m) => m.site_id === site.id);
    const pct = site.capacity && metric ? Math.round((metric.people_count / site.capacity) * 100) : 0;
    return {
      name: site.name.split(' ').slice(0, 2).join(' '),
      fullName: site.name,
      capacity: site.capacity || 0,
      current: metric?.people_count || 0,
      pct,
      type: site.type,
    };
  });

  const kpisByModule = mockKpis.reduce<Record<string, typeof mockKpis>>((acc, kpi) => {
    if (!acc[kpi.module]) acc[kpi.module] = [];
    acc[kpi.module].push(kpi);
    return acc;
  }, {});

  const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Fréquentation totale', value: mockSiteMetrics.reduce((s, m) => s + m.people_count, 0).toLocaleString('fr-FR'), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Sites surveillés', value: mockSites.length, icon: BarChart2, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Taux max d\'occupation', value: `${Math.max(...siteData.map(s => s.pct))}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Site le + fréquenté', value: 'Stade LSS', icon: Users, color: 'text-terra-600', bg: 'bg-terra-50' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-xl p-4 shadow-card flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Fréquentation par site</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={siteData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Visiteurs']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="current" name="Visiteurs actuels" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {siteData.map((entry, index) => (
                  <Cell key={index} fill={entry.pct > 90 ? '#CE1126' : entry.pct > 75 ? '#F59E0B' : '#006B3C'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Taux d'occupation des sites</h3>
          <div className="space-y-4">
            {siteData.filter((s) => s.capacity > 0).map((site) => (
              <div key={site.fullName}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{site.fullName}</p>
                    <p className="text-xs text-gray-400">{site.current.toLocaleString('fr-FR')} / {site.capacity.toLocaleString('fr-FR')} personnes</p>
                  </div>
                  <span className={`text-sm font-bold ${site.pct > 90 ? 'text-senred-600' : site.pct > 75 ? 'text-amber-600' : 'text-green-600'}`}>
                    {site.pct}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${site.pct > 90 ? 'bg-senred-500' : site.pct > 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(site.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">KPIs par module</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(kpisByModule).map(([module, kpis]) => (
            <div key={module} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 capitalize">{module}</p>
              <div className="space-y-2">
                {kpis.slice(0, 3).map((kpi) => (
                  <div key={kpi.id}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 truncate">{kpi.name.replace(/_/g, ' ')}</p>
                      <p className="text-sm font-bold text-gray-900 ml-2">{kpi.value >= 1000 ? `${(kpi.value / 1000).toFixed(0)}K` : kpi.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
