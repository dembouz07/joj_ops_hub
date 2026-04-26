import {
  AlertTriangle, Bell, Bus, CreditCard, Users, MapPin,
  TrendingUp, Activity, ShieldAlert, Clock, ListTodo,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import { SeverityBadge, StatusBadge, AlertLevelBadge } from '../components/ui/Badge';
import {
  mockIncidents, mockAlerts, mockSites, mockSiteMetrics,
  attendanceChartData, incidentChartData, mockTransports, mockTasks,
} from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import type { Page } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const isManager = user?.role?.name === 'manager';
  const userTeam = user?.team;

  // Filtrer les tâches selon l'équipe du manager
  const tasksToShow = isManager && userTeam
    ? mockTasks.filter(task => task.category === userTeam)
    : mockTasks;

  const openIncidents = mockIncidents.filter((i) => i.status !== 'resolved').length;
  const criticalIncidents = mockIncidents.filter((i) => i.severity === 'critical').length;
  const activeAlerts = mockAlerts.filter((a) => a.status === 'active').length;
  const delayedTransports = mockTransports.filter((t) => t.status === 'delayed').length;
  const totalAttendance = mockSiteMetrics.reduce((s, m) => s + m.people_count, 0);

  const recentIncidents = mockIncidents.slice(0, 5);
  const recentAlerts = mockAlerts.filter((a) => a.status === 'active').slice(0, 4);
  
  // Tâches urgentes (priorité urgent ou high, non terminées) - filtrées par équipe
  const urgentTasks = tasksToShow
    .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => {
      // Trier par priorité (urgent d'abord) puis par date
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
      return new Date(a.scheduled_time || '').getTime() - new Date(b.scheduled_time || '').getTime();
    })
    .slice(0, 5);

  const siteOccupancy = mockSites.map((site) => {
    const metric = mockSiteMetrics.find((m) => m.site_id === site.id);
    const pct = site.capacity && metric ? Math.round((metric.people_count / site.capacity) * 100) : 0;
    return { ...site, current: metric?.people_count || 0, pct };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Incidents actifs"
          value={openIncidents}
          subtitle={`${criticalIncidents} critique(s)`}
          icon={AlertTriangle}
          iconColor="text-senred-600"
          iconBg="bg-senred-50"
          trend="up"
          trendValue="+2 aujourd'hui"
          onClick={() => onNavigate('incidents')}
          alert={criticalIncidents > 0}
        />
        <StatCard
          title="Alertes actives"
          value={activeAlerts}
          subtitle="Nécessitent une attention"
          icon={Bell}
          iconColor="text-terra-600"
          iconBg="bg-terra-50"
          onClick={() => onNavigate('alerts')}
          alert={activeAlerts > 2}
        />
        <StatCard
          title="Fréquentation totale"
          value={totalAttendance.toLocaleString('fr-FR')}
          subtitle="Visiteurs sur tous les sites"
          icon={Users}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          trend="up"
          trendValue="+12%"
          onClick={() => onNavigate('metrics')}
        />
        <StatCard
          title="Transports retardés"
          value={delayedTransports}
          subtitle="Sur 7 véhicules actifs"
          icon={Bus}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          onClick={() => onNavigate('transport')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Fréquentation — Aujourd'hui</h3>
              <p className="text-xs text-gray-400 mt-0.5">Nombre total de visiteurs par heure</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +12% vs hier
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceChartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006B3C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#006B3C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(value) => {
                  if (value === undefined || value === null) return ['', ''];
                  const numValue = typeof value === 'string' ? parseFloat(value as string) : (typeof value === 'number' ? value : 0);
                  return [numValue.toLocaleString('fr-FR'), 'Visiteurs'];
                }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="total" stroke="#006B3C" strokeWidth={2.5} fill="url(#colorTotal)" dot={false} activeDot={{ r: 5, fill: '#006B3C' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Incidents — 7 jours</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={incidentChartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }}
              />
              <Bar dataKey="open" name="Ouverts" fill="#CE1126" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="resolved" name="Résolus" fill="#006B3C" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-senred-500" />
              <h3 className="text-base font-semibold text-gray-900">Incidents récents</h3>
            </div>
            <button onClick={() => onNavigate('incidents')} className="text-xs text-green-600 hover:text-green-700 font-medium">
              Voir tout →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{incident.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {incident.site?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <SeverityBadge severity={incident.severity} />
                    <StatusBadge status={incident.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-gray-900">Tâches urgentes</h3>
              </div>
              <button onClick={() => onNavigate('taches')} className="text-xs text-green-600 font-medium">
                Voir →
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {urgentTasks.map((task) => (
                <div key={task.id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-start gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      task.priority === 'urgent' ? 'bg-senred-100 text-senred-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {task.priority === 'urgent' ? 'Urgent' : 'Élevé'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 line-clamp-2">{task.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {task.assignee?.name || 'Non assigné'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-terra-500" />
                <h3 className="text-sm font-semibold text-gray-900">Alertes actives</h3>
              </div>
              <button onClick={() => onNavigate('alerts')} className="text-xs text-green-600 font-medium">
                Voir →
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-start gap-2">
                    <AlertLevelBadge level={alert.level} />
                    <p className="text-xs text-gray-700 line-clamp-2 flex-1">{alert.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sites actifs', value: mockSites.length, icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Transports actifs', value: mockTransports.filter(t => t.status === 'active').length, icon: Bus, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Accréditations', value: 6, icon: CreditCard, color: 'text-gold-600', bg: 'bg-gold-50' },
          { label: 'Utilisateurs', value: 8, icon: Users, color: 'text-terra-600', bg: 'bg-terra-50' },
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
    </div>
  );
}
