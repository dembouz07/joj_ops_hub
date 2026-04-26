import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Trend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  trend?: Trend;
  trendValue?: string;
  onClick?: () => void;
  alert?: boolean;
}

export default function StatCard({
  title, value, subtitle, icon: Icon, iconColor = 'text-green-600',
  iconBg = 'bg-green-50', trend, trendValue, onClick, alert = false,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-5 shadow-card transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5' : ''}
        ${alert ? 'ring-2 ring-senred-300' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-50 text-green-600' :
            trend === 'down' ? 'bg-senred-50 text-senred-600' :
            'bg-gray-100 text-gray-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
