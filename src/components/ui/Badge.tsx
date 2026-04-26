import type { IncidentSeverity, IncidentStatus, AlertLevel, AlertStatus, TransportStatus, AccreditationStatus, MediaRequestStatus } from '../../types';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-senred-50 text-senred-700 border border-senred-200',
  info: 'bg-sky-50 text-sky-700 border border-sky-200',
  neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
  gold: 'bg-gold-50 text-gold-700 border border-gold-200',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'neutral', dot = false, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          variant === 'success' ? 'bg-green-500' :
          variant === 'warning' ? 'bg-amber-500' :
          variant === 'danger' ? 'bg-senred-500' :
          variant === 'info' ? 'bg-sky-500' :
          variant === 'gold' ? 'bg-gold-500' :
          'bg-gray-400'
        }`} />
      )}
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  const map: Record<IncidentSeverity, { variant: BadgeVariant; label: string }> = {
    low: { variant: 'success', label: 'Faible' },
    medium: { variant: 'warning', label: 'Moyen' },
    high: { variant: 'danger', label: 'Élevé' },
    critical: { variant: 'danger', label: 'Critique' },
  };
  const { variant, label } = map[severity];
  return (
    <Badge variant={variant} dot>
      {severity === 'critical' ? <span className="font-bold">{label}</span> : label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const map: Record<IncidentStatus, { variant: BadgeVariant; label: string }> = {
    open: { variant: 'danger', label: 'Ouvert' },
    in_progress: { variant: 'warning', label: 'En cours' },
    resolved: { variant: 'success', label: 'Résolu' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant} dot>{label}</Badge>;
}

export function AlertLevelBadge({ level }: { level: AlertLevel }) {
  const map: Record<AlertLevel, { variant: BadgeVariant; label: string }> = {
    info: { variant: 'info', label: 'Info' },
    warning: { variant: 'warning', label: 'Avertissement' },
    critical: { variant: 'danger', label: 'Critique' },
  };
  const { variant, label } = map[level];
  return <Badge variant={variant} dot>{label}</Badge>;
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return (
    <Badge variant={status === 'active' ? 'danger' : 'success'} dot>
      {status === 'active' ? 'Active' : 'Résolue'}
    </Badge>
  );
}

export function TransportStatusBadge({ status }: { status: TransportStatus }) {
  const map: Record<TransportStatus, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Actif' },
    maintenance: { variant: 'warning', label: 'Maintenance' },
    delayed: { variant: 'danger', label: 'Retardé' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant} dot>{label}</Badge>;
}

export function AccreditationStatusBadge({ status }: { status: AccreditationStatus }) {
  const map: Record<AccreditationStatus, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    expired: { variant: 'neutral', label: 'Expirée' },
    suspended: { variant: 'danger', label: 'Suspendue' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant} dot>{label}</Badge>;
}

export function MediaStatusBadge({ status }: { status: MediaRequestStatus }) {
  const map: Record<MediaRequestStatus, { variant: BadgeVariant; label: string }> = {
    pending: { variant: 'warning', label: 'En attente' },
    approved: { variant: 'success', label: 'Approuvée' },
    rejected: { variant: 'danger', label: 'Rejetée' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant} dot>{label}</Badge>;
}
