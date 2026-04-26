import type {
  User, Role, Site, Incident, Alert, Transport, TransportMovement,
  Accreditation, ProtocolEvent, MediaRequest, SiteMetric, Kpi, Report, Notification, Task
} from '../types';

export const mockRoles: Role[] = [
  { id: 1, name: 'admin', description: 'Administrateur système' },
  { id: 2, name: 'security_chief', description: 'Chef de la sécurité' },
  { id: 3, name: 'transport_manager', description: 'Responsable transport' },
  { id: 4, name: 'protocol_officer', description: 'Officier de protocole' },
  { id: 5, name: 'media_officer', description: 'Responsable médias' },
  { id: 6, name: 'operator', description: 'Opérateur terrain' },
  { id: 7, name: 'manager', description: 'Manager opérationnel' },
];

export const mockSites: Site[] = [
  { id: 1, name: 'Stade Léopold Sédar Senghor', type: 'stade', location: 'Dakar, HLM', capacity: 60000 },
  { id: 2, name: 'Complexe Sportif de Dakar', type: 'complexe', location: 'Dakar, Liberté VI', capacity: 15000 },
  { id: 3, name: 'Arène Nationale de Lutte', type: 'arène', location: 'Pikine, Dakar', capacity: 20000 },
  { id: 4, name: 'Piscine Olympique de Dakar', type: 'piscine', location: 'Dakar, Almadies', capacity: 5000 },
  { id: 5, name: 'Palais des Sports de Dakar', type: 'palais', location: 'Dakar, Corniche', capacity: 10000 },
  { id: 6, name: 'Village des Athlètes JOJ', type: 'hébergement', location: 'Diamniadio', capacity: 3000 },
  { id: 7, name: 'Centre des Médias', type: 'médias', location: 'Dakar, Plateau', capacity: 800 },
  { id: 8, name: 'Hôtel de la Paix', type: 'hôtel', location: 'Dakar, Centre-ville', capacity: 200 },
];

export const mockUsers: User[] = [
  { id: 1, name: 'Moussa Diallo', email: 'moussa.diallo@joj2026.sn', role_id: 1, site_id: null, team: null, role: mockRoles[0] },
  { id: 2, name: 'Fatou Ndiaye', email: 'fatou.ndiaye@joj2026.sn', role_id: 2, site_id: 1, team: 'securite', role: mockRoles[1], site: mockSites[0] },
  { id: 3, name: 'Ibrahima Sarr', email: 'ibrahima.sarr@joj2026.sn', role_id: 3, site_id: 2, team: 'transports', role: mockRoles[2], site: mockSites[1] },
  { id: 4, name: 'Aminata Touré', email: 'aminata.toure@joj2026.sn', role_id: 4, site_id: 3, team: 'protocole', role: mockRoles[3], site: mockSites[2] },
  { id: 5, name: 'Cheikh Mbaye', email: 'cheikh.mbaye@joj2026.sn', role_id: 5, site_id: 7, team: 'medias', role: mockRoles[4], site: mockSites[6] },
  { id: 6, name: 'Rokhaya Gueye', email: 'rokhaya.gueye@joj2026.sn', role_id: 6, site_id: 4, team: 'securite', role: mockRoles[5], site: mockSites[3] },
  { id: 7, name: 'Ousmane Faye', email: 'ousmane.faye@joj2026.sn', role_id: 2, site_id: 5, team: 'securite', role: mockRoles[1], site: mockSites[4] },
  { id: 8, name: 'Maryam Bâ', email: 'maryam.ba@joj2026.sn', role_id: 6, site_id: 6, team: 'accreditations', role: mockRoles[5], site: mockSites[5] },
  { id: 9, name: 'Abdoulaye Seck', email: 'abdoulaye.seck@joj2026.sn', role_id: 7, site_id: null, team: 'accreditations', role: mockRoles[6] },
];

export const mockIncidents: Incident[] = [
  {
    id: 1, title: 'Intrusion périmètre nord', description: 'Individu non accrédité détecté dans le périmètre de sécurité nord du stade.', status: 'resolved', severity: 'high', site_id: 1, created_by: 2, assigned_to: 7, started_at: '2026-04-15T10:30:00Z', resolved_at: '2026-04-15T11:45:00Z', site: mockSites[0], creator: mockUsers[1], assignee: mockUsers[6], created_at: '2026-04-15T10:28:00Z',
  },
  {
    id: 2, title: 'Défaillance système de contrôle d\'accès', description: 'Les portiques d\'entrée principale sont hors service depuis 14h.', status: 'in_progress', severity: 'critical', site_id: 2, created_by: 7, assigned_to: 2, started_at: '2026-04-17T14:00:00Z', resolved_at: null, site: mockSites[1], creator: mockUsers[6], assignee: mockUsers[1], created_at: '2026-04-17T14:02:00Z',
  },
  {
    id: 3, title: 'Bagarre dans les tribunes', description: 'Altercation entre spectateurs dans le secteur B, tribune est.', status: 'resolved', severity: 'medium', site_id: 1, created_by: 2, assigned_to: 7, started_at: '2026-04-16T16:20:00Z', resolved_at: '2026-04-16T17:00:00Z', site: mockSites[0], creator: mockUsers[1], assignee: mockUsers[6], created_at: '2026-04-16T16:18:00Z',
  },
  {
    id: 4, title: 'Suspect photographiant la salle de contrôle', description: 'Personne non identifiée tentant de photographier l\'espace de contrôle des opérations.', status: 'open', severity: 'high', site_id: 5, created_by: 7, assigned_to: null, started_at: '2026-04-18T09:15:00Z', resolved_at: null, site: mockSites[4], creator: mockUsers[6], assignee: null, created_at: '2026-04-18T09:13:00Z',
  },
  {
    id: 5, title: 'Fausse alerte incendie', description: 'Déclenchement intempestif du système anti-incendie dans la zone VIP.', status: 'resolved', severity: 'low', site_id: 3, created_by: 4, assigned_to: null, started_at: '2026-04-14T19:00:00Z', resolved_at: '2026-04-14T19:30:00Z', site: mockSites[2], creator: mockUsers[3], assignee: null, created_at: '2026-04-14T19:02:00Z',
  },
  {
    id: 6, title: 'Vol de matériel technique', description: 'Disparition d\'équipements audiovisuels dans la salle de presse.', status: 'in_progress', severity: 'high', site_id: 7, created_by: 5, assigned_to: 2, started_at: '2026-04-18T07:30:00Z', resolved_at: null, site: mockSites[6], creator: mockUsers[4], assignee: mockUsers[1], created_at: '2026-04-18T07:28:00Z',
  },
];

export const mockAlerts: Alert[] = [
  { id: 1, title: 'Alerte critique – Accès compromis', message: 'Système de contrôle d\'accès principal défaillant au Complexe Sportif. Intervention immédiate requise.', level: 'critical', status: 'active', incident_id: 2, created_by: 2, creator: mockUsers[1], created_at: '2026-04-17T14:05:00Z' },
  { id: 2, title: 'Capacité maximale approche – Stade LSS', message: 'Le Stade Léopold Sédar Senghor atteint 92% de sa capacité. Régulation d\'afflux recommandée.', level: 'warning', status: 'active', incident_id: null, created_by: 1, creator: mockUsers[0], created_at: '2026-04-18T11:30:00Z' },
  { id: 3, title: 'Vol matériel médias confirmé', message: 'Équipements audiovisuels dérobés au Centre des Médias. Investigation en cours.', level: 'critical', status: 'active', incident_id: 6, created_by: 5, creator: mockUsers[4], created_at: '2026-04-18T07:35:00Z' },
  { id: 4, title: 'Navette retardée – Route Diamniadio', message: 'La navette N-07 a 45 minutes de retard sur la liaison Dakar–Village des Athlètes.', level: 'warning', status: 'resolved', incident_id: null, created_by: 3, creator: mockUsers[2], created_at: '2026-04-17T08:00:00Z' },
  { id: 5, title: 'Info – Mise à jour programme protocole', message: 'La cérémonie d\'ouverture est avancée de 30 minutes. Coordination sécurité/protocole requise.', level: 'info', status: 'resolved', incident_id: null, created_by: 4, creator: mockUsers[3], created_at: '2026-04-16T14:00:00Z' },
];

export const mockTransports: Transport[] = [
  { id: 1, name: 'Bus officiel JOJ-01', type: 'bus', capacity: 55, status: 'active', site_id: 6, site: mockSites[5] },
  { id: 2, name: 'Navette athlètes N-03', type: 'navette', capacity: 30, status: 'active', site_id: 6, site: mockSites[5] },
  { id: 3, name: 'Véhicule VIP VP-02', type: 'berline', capacity: 4, status: 'active', site_id: 1, site: mockSites[0] },
  { id: 4, name: 'Navette médias N-07', type: 'navette', capacity: 25, status: 'delayed', site_id: 7, site: mockSites[6] },
  { id: 5, name: 'Bus sécurité SEC-05', type: 'bus', capacity: 40, status: 'active', site_id: 1, site: mockSites[0] },
  { id: 6, name: 'Minibus MB-09', type: 'minibus', capacity: 16, status: 'maintenance', site_id: 2, site: mockSites[1] },
  { id: 7, name: 'Navette presse NP-04', type: 'navette', capacity: 30, status: 'active', site_id: 7, site: mockSites[6] },
];

export const mockMovements: TransportMovement[] = [
  { id: 1, transport_id: 1, from_site_id: 6, to_site_id: 1, departure_time: '2026-04-18T07:00:00Z', arrival_time: '2026-04-18T08:15:00Z', status: 'completed', transport: mockTransports[0], from_site: mockSites[5], to_site: mockSites[0] },
  { id: 2, transport_id: 2, from_site_id: 6, to_site_id: 2, departure_time: '2026-04-18T07:30:00Z', arrival_time: '2026-04-18T08:30:00Z', status: 'completed', transport: mockTransports[1], from_site: mockSites[5], to_site: mockSites[1] },
  { id: 3, transport_id: 4, from_site_id: 7, to_site_id: 6, departure_time: '2026-04-18T09:00:00Z', arrival_time: null, status: 'delayed', transport: mockTransports[3], from_site: mockSites[6], to_site: mockSites[5] },
  { id: 4, transport_id: 5, from_site_id: 1, to_site_id: 3, departure_time: '2026-04-18T10:00:00Z', arrival_time: '2026-04-18T10:45:00Z', status: 'completed', transport: mockTransports[4], from_site: mockSites[0], to_site: mockSites[2] },
  { id: 5, transport_id: 3, from_site_id: 8, to_site_id: 1, departure_time: '2026-04-18T11:30:00Z', arrival_time: null, status: 'en_route', transport: mockTransports[2], from_site: mockSites[7], to_site: mockSites[0] },
];

export const mockAccreditations: Accreditation[] = [
  { id: 1, user_id: 1, badge_type: 'ALL_ACCESS', status: 'active', valid_from: '2026-04-01T00:00:00Z', valid_until: '2026-05-01T00:00:00Z', user: mockUsers[0] },
  { id: 2, user_id: 2, badge_type: 'SECURITY', status: 'active', valid_from: '2026-04-01T00:00:00Z', valid_until: '2026-04-25T00:00:00Z', user: mockUsers[1] },
  { id: 3, user_id: 3, badge_type: 'TRANSPORT', status: 'active', valid_from: '2026-04-01T00:00:00Z', valid_until: '2026-04-22T00:00:00Z', user: mockUsers[2] },
  { id: 4, user_id: 4, badge_type: 'PROTOCOL', status: 'active', valid_from: '2026-04-01T00:00:00Z', valid_until: '2026-05-01T00:00:00Z', user: mockUsers[3] },
  { id: 5, user_id: 5, badge_type: 'MEDIA', status: 'active', valid_from: '2026-04-01T00:00:00Z', valid_until: '2026-04-20T00:00:00Z', user: mockUsers[4] },
  { id: 6, user_id: 6, badge_type: 'OPERATIONS', status: 'active', valid_from: '2026-04-01T00:00:00Z', valid_until: '2026-05-01T00:00:00Z', user: mockUsers[5] },
  { id: 7, user_id: 7, badge_type: 'SECURITY', status: 'suspended', valid_from: '2026-04-01T00:00:00Z', valid_until: '2026-04-30T00:00:00Z', user: mockUsers[6] },
  { id: 8, user_id: 8, badge_type: 'OPERATIONS', status: 'expired', valid_from: '2026-03-01T00:00:00Z', valid_until: '2026-04-10T00:00:00Z', user: mockUsers[7] },
];

export const mockProtocolEvents: ProtocolEvent[] = [
  { id: 1, title: 'Cérémonie d\'ouverture officielle', description: 'Cérémonie inaugurale des Jeux Olympiques de la Jeunesse 2026 Dakar.', type: 'ceremonie', site_id: 1, start_time: '2026-04-19T18:00:00Z', end_time: '2026-04-19T21:00:00Z', status: 'upcoming', site: mockSites[0] },
  { id: 2, title: 'Réception diplomatique', description: 'Réception des délégations officielles au Palais des Sports.', type: 'reception', site_id: 5, start_time: '2026-04-20T12:00:00Z', end_time: '2026-04-20T14:00:00Z', status: 'upcoming', site: mockSites[4] },
  { id: 3, title: 'Remise de médailles – Lutte', description: 'Cérémonie de remise des médailles d\'or, argent et bronze pour les épreuves de lutte.', type: 'medailles', site_id: 3, start_time: '2026-04-18T16:00:00Z', end_time: '2026-04-18T17:30:00Z', status: 'ongoing', site: mockSites[2] },
  { id: 4, title: 'Conférence de presse – Comité Olympique', description: 'Point de presse officiel du Comité National Olympique du Sénégal.', type: 'conference', site_id: 7, start_time: '2026-04-18T10:00:00Z', end_time: '2026-04-18T11:30:00Z', status: 'completed', site: mockSites[6] },
  { id: 5, title: 'Cocktail des sponsors', description: 'Soirée de networking avec les partenaires officiels des JOJ.', type: 'reception', site_id: 8, start_time: '2026-04-21T19:00:00Z', end_time: '2026-04-21T22:00:00Z', status: 'upcoming', site: mockSites[7] },
];

export const mockMediaRequests: MediaRequest[] = [
  { id: 1, title: 'Accès zone technique – Canal+ Afrique', description: 'Demande d\'accès à la zone technique du stade pour équipe de tournage.', status: 'approved', requested_by: 5, site_id: 1, event_time: '2026-04-19T17:00:00Z', requester: mockUsers[4], site: mockSites[0], created_at: '2026-04-15T09:00:00Z' },
  { id: 2, title: 'Accréditation photographes RTS', description: 'Accréditation pour 3 photographes de la Radio Télévision Sénégalaise.', status: 'pending', requested_by: 5, site_id: 1, event_time: '2026-04-19T18:00:00Z', requester: mockUsers[4], site: mockSites[0], created_at: '2026-04-17T11:00:00Z' },
  { id: 3, title: 'Drone filmique – Village athlètes', description: 'Autorisation de survol par drone pour reportage documentaire international.', status: 'rejected', requested_by: 5, site_id: 6, event_time: null, requester: mockUsers[4], site: mockSites[5], created_at: '2026-04-16T14:30:00Z' },
  { id: 4, title: 'Accès mixte – AFP', description: 'Demande d\'accès zone mixte pour correspondant de l\'Agence France-Presse.', status: 'pending', requested_by: 5, site_id: 3, event_time: '2026-04-18T15:00:00Z', requester: mockUsers[4], site: mockSites[2], created_at: '2026-04-17T16:00:00Z' },
  { id: 5, title: 'Transmission en direct – Al Jazeera Sport', description: 'Installation équipement de transmission pour diffusion en direct des épreuves de natation.', status: 'approved', requested_by: 5, site_id: 4, event_time: '2026-04-20T09:00:00Z', requester: mockUsers[4], site: mockSites[3], created_at: '2026-04-14T10:00:00Z' },
];

export const mockSiteMetrics: SiteMetric[] = [
  { id: 1, site_id: 1, people_count: 55200, recorded_at: '2026-04-18T12:00:00Z', site: mockSites[0] },
  { id: 2, site_id: 1, people_count: 48000, recorded_at: '2026-04-18T10:00:00Z', site: mockSites[0] },
  { id: 3, site_id: 2, people_count: 8700, recorded_at: '2026-04-18T12:00:00Z', site: mockSites[1] },
  { id: 4, site_id: 3, people_count: 16500, recorded_at: '2026-04-18T12:00:00Z', site: mockSites[2] },
  { id: 5, site_id: 4, people_count: 3200, recorded_at: '2026-04-18T12:00:00Z', site: mockSites[3] },
  { id: 6, site_id: 5, people_count: 7800, recorded_at: '2026-04-18T12:00:00Z', site: mockSites[4] },
  { id: 7, site_id: 6, people_count: 2100, recorded_at: '2026-04-18T12:00:00Z', site: mockSites[5] },
  { id: 8, site_id: 7, people_count: 620, recorded_at: '2026-04-18T12:00:00Z', site: mockSites[6] },
];

export const mockKpis: Kpi[] = [
  { id: 1, name: 'incidents_total', value: 6, module: 'incident', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 2, name: 'incidents_resolved', value: 3, module: 'incident', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 3, name: 'incidents_critical', value: 2, module: 'incident', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 4, name: 'transport_active', value: 5, module: 'transport', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 5, name: 'transport_delayed', value: 1, module: 'transport', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 6, name: 'accreditations_active', value: 6, module: 'accreditation', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 7, name: 'accreditations_expiring', value: 2, module: 'accreditation', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 8, name: 'total_attendance', value: 94120, module: 'site', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 9, name: 'alerts_active', value: 3, module: 'alert', recorded_at: '2026-04-18T12:00:00Z' },
  { id: 10, name: 'media_requests_pending', value: 2, module: 'media', recorded_at: '2026-04-18T12:00:00Z' },
];

export const mockReports: Report[] = [
  { id: 1, title: 'Rapport sécurité – Journée 1', type: 'securite', generated_by: 2, file_path: '/reports/securite_j1.pdf', generator: mockUsers[1], created_at: '2026-04-15T22:00:00Z' },
  { id: 2, title: 'Rapport transport – Semaine 1', type: 'transport', generated_by: 3, file_path: '/reports/transport_s1.pdf', generator: mockUsers[2], created_at: '2026-04-17T20:00:00Z' },
  { id: 3, title: 'Rapport fréquentation – Sites', type: 'frequentation', generated_by: 1, file_path: '/reports/frequentation.pdf', generator: mockUsers[0], created_at: '2026-04-18T08:00:00Z' },
  { id: 4, title: 'Rapport accréditations actives', type: 'accreditation', generated_by: 1, file_path: '/reports/accreditations.pdf', generator: mockUsers[0], created_at: '2026-04-17T10:00:00Z' },
  { id: 5, title: 'Rapport incidents critiques', type: 'incidents', generated_by: 2, file_path: '/reports/incidents_critiques.pdf', generator: mockUsers[1], created_at: '2026-04-18T09:30:00Z' },
];

export const mockNotifications: Notification[] = [
  { id: 1, user_id: 1, title: 'Incident critique signalé', message: 'Un incident critique a été ouvert au Complexe Sportif de Dakar. Intervention requise.', read_at: null, user: mockUsers[0], created_at: '2026-04-17T14:05:00Z' },
  { id: 2, user_id: 1, title: 'Vol confirmé – Centre des Médias', message: 'Vol de matériel confirmé au Centre des Médias. Rapport d\'incident créé.', read_at: null, user: mockUsers[0], created_at: '2026-04-18T07:40:00Z' },
  { id: 3, user_id: 1, title: 'Accréditation expirée', message: 'L\'accréditation de Maryam Bâ a expiré. Renouvellement nécessaire.', read_at: '2026-04-18T09:00:00Z', user: mockUsers[0], created_at: '2026-04-18T08:00:00Z' },
  { id: 4, user_id: 1, title: 'Rapport généré', message: 'Le rapport de fréquentation des sites a été généré avec succès.', read_at: '2026-04-18T09:15:00Z', user: mockUsers[0], created_at: '2026-04-18T08:05:00Z' },
  { id: 5, user_id: 1, title: 'Cérémonie d\'ouverture – Rappel', message: 'La cérémonie d\'ouverture est prévue dans 6 heures. Coordination sécurité en cours.', read_at: null, user: mockUsers[0], created_at: '2026-04-19T12:00:00Z' },
];

export const mockTasks: Task[] = [
  { id: 1, title: 'Inspection périmètre de sécurité', description: 'Vérification complète du périmètre de sécurité nord du stade avant la cérémonie d\'ouverture.', category: 'securite', status: 'completed', priority: 'high', assigned_to: 2, site_id: 1, scheduled_time: '2026-04-18T06:00:00Z', completed_at: '2026-04-18T08:30:00Z', assignee: mockUsers[1], site: mockSites[0], created_at: '2026-04-17T10:00:00Z' },
  { id: 2, title: 'Coordination transport VIP', description: 'Organiser le transport des délégations officielles depuis l\'Hôtel de la Paix vers le stade.', category: 'transports', status: 'in_progress', priority: 'urgent', assigned_to: 3, site_id: 8, scheduled_time: '2026-04-19T15:00:00Z', completed_at: null, assignee: mockUsers[2], site: mockSites[7], created_at: '2026-04-18T09:00:00Z' },
  { id: 3, title: 'Test système anti-incendie', description: 'Vérification et test complet du système anti-incendie dans toutes les zones du Palais des Sports.', category: 'securite', status: 'pending', priority: 'medium', assigned_to: 7, site_id: 5, scheduled_time: '2026-04-19T08:00:00Z', completed_at: null, assignee: mockUsers[6], site: mockSites[4], created_at: '2026-04-18T11:00:00Z' },
  { id: 4, title: 'Briefing équipe protocole', description: 'Réunion de briefing avec l\'équipe protocole pour la cérémonie d\'ouverture et la réception diplomatique.', category: 'protocole', status: 'completed', priority: 'high', assigned_to: 4, site_id: 1, scheduled_time: '2026-04-18T14:00:00Z', completed_at: '2026-04-18T15:30:00Z', assignee: mockUsers[3], site: mockSites[0], created_at: '2026-04-18T08:00:00Z' },
  { id: 5, title: 'Installation équipement médias', description: 'Installation et configuration des équipements de transmission pour les diffuseurs internationaux.', category: 'medias', status: 'in_progress', priority: 'high', assigned_to: 5, site_id: 7, scheduled_time: '2026-04-18T10:00:00Z', completed_at: null, assignee: mockUsers[4], site: mockSites[6], created_at: '2026-04-17T16:00:00Z' },
  { id: 6, title: 'Contrôle accréditations', description: 'Vérification des accréditations expirées et renouvellement pour le personnel opérationnel.', category: 'accreditations', status: 'pending', priority: 'medium', assigned_to: 1, site_id: null, scheduled_time: '2026-04-19T09:00:00Z', completed_at: null, assignee: mockUsers[0], site: null, created_at: '2026-04-18T12:00:00Z' },
  { id: 7, title: 'Maintenance portiques d\'accès', description: 'Réparation urgente des portiques de contrôle d\'accès au Complexe Sportif de Dakar.', category: 'securite', status: 'in_progress', priority: 'urgent', assigned_to: 6, site_id: 2, scheduled_time: '2026-04-18T14:00:00Z', completed_at: null, assignee: mockUsers[5], site: mockSites[1], created_at: '2026-04-18T14:05:00Z' },
  { id: 8, title: 'Préparation zone mixte', description: 'Aménagement et sécurisation de la zone mixte pour les interviews post-compétition à l\'Arène Nationale.', category: 'medias', status: 'pending', priority: 'low', assigned_to: 8, site_id: 3, scheduled_time: '2026-04-19T12:00:00Z', completed_at: null, assignee: mockUsers[7], site: mockSites[2], created_at: '2026-04-18T10:30:00Z' },
  { id: 9, title: 'Rapport quotidien sécurité', description: 'Compilation et rédaction du rapport de sécurité quotidien pour la direction des opérations.', category: 'securite', status: 'completed', priority: 'medium', assigned_to: 2, site_id: null, scheduled_time: '2026-04-18T20:00:00Z', completed_at: '2026-04-18T21:15:00Z', assignee: mockUsers[1], site: null, created_at: '2026-04-18T18:00:00Z' },
  { id: 10, title: 'Inspection piscine olympique', description: 'Inspection de sécurité et vérification des équipements de la Piscine Olympique avant les épreuves de natation.', category: 'securite', status: 'pending', priority: 'high', assigned_to: 7, site_id: 4, scheduled_time: '2026-04-19T07:00:00Z', completed_at: null, assignee: mockUsers[6], site: mockSites[3], created_at: '2026-04-18T13:00:00Z' },
  { id: 11, title: 'Coordination navettes athlètes', description: 'Planification et coordination des navettes entre le Village des Athlètes et les différents sites de compétition.', category: 'transports', status: 'in_progress', priority: 'high', assigned_to: 3, site_id: 6, scheduled_time: '2026-04-19T06:00:00Z', completed_at: null, assignee: mockUsers[2], site: mockSites[5], created_at: '2026-04-18T15:00:00Z' },
  { id: 12, title: 'Gestion demandes médias', description: 'Traitement des demandes d\'accréditation médias en attente et coordination avec les équipes de tournage.', category: 'medias', status: 'pending', priority: 'medium', assigned_to: 5, site_id: 7, scheduled_time: '2026-04-19T10:00:00Z', completed_at: null, assignee: mockUsers[4], site: mockSites[6], created_at: '2026-04-18T16:00:00Z' },
  { id: 13, title: 'Audit badges d\'accès VIP', description: 'Vérification et audit complet de tous les badges VIP émis pour la cérémonie d\'ouverture. Contrôle de sécurité et validation des autorisations.', category: 'accreditations', status: 'pending', priority: 'urgent', assigned_to: null, site_id: 1, scheduled_time: '2026-04-26T08:00:00Z', completed_at: null, assignee: null, site: mockSites[0], created_at: '2026-04-25T14:00:00Z' },
];

export const attendanceChartData = [
  { time: '06h', total: 12000 },
  { time: '08h', total: 28000 },
  { time: '10h', total: 56000 },
  { time: '12h', total: 94120 },
  { time: '14h', total: 88000 },
  { time: '16h', total: 102000 },
  { time: '18h', total: 75000 },
  { time: '20h', total: 45000 },
];

export const incidentChartData = [
  { day: 'Lun', open: 2, resolved: 1 },
  { day: 'Mar', open: 3, resolved: 2 },
  { day: 'Mer', open: 1, resolved: 3 },
  { day: 'Jeu', open: 4, resolved: 2 },
  { day: 'Ven', open: 2, resolved: 4 },
  { day: 'Sam', open: 5, resolved: 3 },
  { day: 'Dim', open: 3, resolved: 5 },
];
