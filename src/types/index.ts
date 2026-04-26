export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  site_id: number | null;
  team?: TaskCategory | null;
  role?: Role;
  site?: Site;
  created_at?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
}

export interface Site {
  id: number;
  name: string;
  type: string;
  location: string | null;
  capacity: number | null;
}

export type IncidentStatus = 'open' | 'in_progress' | 'resolved';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: number;
  title: string;
  description: string | null;
  status: IncidentStatus;
  severity: IncidentSeverity;
  site_id: number;
  created_by: number;
  assigned_to: number | null;
  started_at: string | null;
  resolved_at: string | null;
  site?: Site;
  creator?: User;
  assignee?: User;
  created_at?: string;
}

export type AlertLevel = 'info' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'resolved';

export interface Alert {
  id: number;
  title: string;
  message: string;
  level: AlertLevel;
  status: AlertStatus;
  incident_id: number | null;
  created_by: number;
  creator?: User;
  incident?: Incident;
  created_at?: string;
}

export type ImpactLevel = 'low' | 'medium' | 'high';

export interface AlertRelation {
  id: number;
  alert_id: number;
  module: string;
  related_id: number;
  impact_level: ImpactLevel;
  alert?: Alert;
}

export type TransportStatus = 'active' | 'maintenance' | 'delayed';

export interface Transport {
  id: number;
  name: string;
  type: string;
  capacity: number | null;
  status: TransportStatus;
  site_id: number;
  site?: Site;
}

export interface TransportMovement {
  id: number;
  transport_id: number;
  from_site_id: number;
  to_site_id: number;
  departure_time: string | null;
  arrival_time: string | null;
  status: string | null;
  transport?: Transport;
  from_site?: Site;
  to_site?: Site;
}

export type AccreditationStatus = 'active' | 'expired' | 'suspended';

export interface Accreditation {
  id: number;
  user_id: number;
  badge_type: string;
  status: AccreditationStatus;
  valid_from: string;
  valid_until: string;
  user?: User;
}

export interface ProtocolEvent {
  id: number;
  title: string;
  description: string | null;
  type: string;
  site_id: number;
  start_time: string;
  end_time: string | null;
  status: string | null;
  site?: Site;
}

export type MediaRequestStatus = 'pending' | 'approved' | 'rejected';

export interface MediaRequest {
  id: number;
  title: string;
  description: string | null;
  status: MediaRequestStatus;
  requested_by: number;
  site_id: number;
  event_time: string | null;
  requester?: User;
  site?: Site;
  created_at?: string;
}

export interface SiteMetric {
  id: number;
  site_id: number;
  people_count: number;
  recorded_at: string;
  site?: Site;
}

export interface Kpi {
  id: number;
  name: string;
  value: number;
  module: string;
  recorded_at: string;
}

export interface Report {
  id: number;
  title: string;
  type: string;
  generated_by: number;
  file_path: string;
  generator?: User;
  created_at?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  read_at: string | null;
  user?: User;
  created_at?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'securite' | 'transports' | 'accreditations' | 'protocole' | 'medias';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: number | null;
  site_id: number | null;
  scheduled_time: string | null;
  completed_at: string | null;
  assignee?: User;
  site?: Site;
  created_at?: string;
}

export type Page =
  | 'dashboard'
  | 'incidents'
  | 'taches'
  | 'alerts'
  | 'security'
  | 'transport'
  | 'accreditations'
  | 'protocol'
  | 'media'
  | 'metrics'
  | 'reports'
  | 'notifications'
  | 'users'
  | 'sites'
  | 'team';
