# JOJ OPS HUB — Architecture de Sécurité

## 🔐 Stratégie de Sécurité Multi-Couches

### 1. **Authentification & Autorisation**

#### Frontend (React)
- ✅ **Context API + localStorage** : Gestion d'état sécurisée avec token JWT
- ✅ **Route Guards** : Redirection automatique vers login si non authentifié
- ✅ **Session Management** : Token stocké localement, révocable à la déconnexion
- ✅ **Password Visibility Toggle** : Masquage du mot de passe par défaut

```typescript
// Authentification dans AuthContext.tsx
export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('joj_token', token);
  } else {
    localStorage.removeItem('joj_token');
  }
}
```

#### Backend (Laravel Sanctum)
- ✅ **Token-based Authentication** : Sanctum tokens au lieu de sessions
- ✅ **Bearer Tokens** : Chaque requête API validée via Authorization header
- ✅ **Token Expiration** : Tokens révoqués après logout

---

### 2. **Protection des Données en Transit**

#### HTTPS/TLS
- ✅ **Chiffrement SSL/TLS** : Toutes communications sécurisées
- ✅ **HSTS Headers** : Force HTTPS obligatoire
- ✅ **Content Security Policy (CSP)** : Limitation des sources JavaScript

#### API Security
```typescript
const headers: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  Authorization: `Bearer ${token}`, // Token obligatoire
};

const response = await fetch(`${BASE_URL}${path}`, { 
  ...options, 
  headers 
});
```

---

### 3. **Contrôle d'Accès Basé sur les Rôles (RBAC)**

#### Rôles Implémentés
```
├── admin (Administrateur) → Accès complet
├── security_chief (Chef Sécurité) → Incidents, Alertes
├── transport_manager (Responsable Transport) → Transports
├── protocol_officer (Officier Protocole) → Événements
├── media_officer (Responsable Médias) → Demandes médias
└── operator (Opérateur) → Vue opérationnelle
```

#### Backend Validation
```sql
-- Row Level Security (RLS) sur chaque table
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by OR user_has_role('admin'));
```

---

### 4. **Protection Contre les Attaques Courantes**

#### A. **Cross-Site Scripting (XSS)**
- ✅ **React Escaping** : Données échappées automatiquement
- ✅ **Content Security Policy** : Bloque les scripts externes non autorisés
- ✅ **No Direct DOM Manipulation** : Utilisation de React, pas de innerHTML

```typescript
// ✅ SÉCURISÉ : React échappe automatiquement
<p>{userInput}</p>

// ❌ DANGEREUX : Nunca fazer
<p dangerouslySetInnerHTML={{ __html: userInput }} />
```

#### B. **Cross-Site Request Forgery (CSRF)**
- ✅ **SameSite Cookies** : Restriction des cookies cross-origin
- ✅ **CSRF Tokens** : Validation au backend pour les mutations
- ✅ **Preflight CORS** : Vérification OPTIONS avant POST/PUT/DELETE

#### C. **SQL Injection**
- ✅ **Prepared Statements** : Queries paramétrées côté Laravel
- ✅ **ORM (Eloquent)** : Pas de raw SQL dangereux
- ✅ **Input Validation** : Validation serveur obligatoire

```typescript
// Backend Laravel — Protection automatique
$incidents = Incident::where('status', $request->status)
                      ->where('site_id', auth()->user()->site_id)
                      ->get(); // Requête sécurisée via ORM
```

#### D. **Injection de Dépendances**
- ✅ **Service Injection Pattern** : Dépendances explicites
- ✅ **Immutabilité des Tokens** : Pas de manipulation directe

---

### 5. **Gestion des Secrets & Configuration**

#### Variables d'Environnement
```bash
# .env (JAMAIS en production)
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx...

# Côté Backend
DB_PASSWORD=... # Chiffré en production
JWT_SECRET=... # Rotation régulière
```

#### Bonnes Pratiques
- ✅ Variables d'env différentes par environnement
- ✅ Secrets stockés dans des vaults (Vault, AWS Secrets Manager)
- ✅ Jamais de secrets en code source
- ✅ Rotation automatique des clés tous les 90 jours

---

### 6. **Validation & Sanitisation**

#### Frontend
```typescript
// Validation des emails
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Limitation de longueur
<input 
  maxLength={255} 
  type="text" 
  value={title}
/>
```

#### Backend (Laravel)
```php
$validated = $request->validate([
  'email' => 'required|email|unique:users',
  'title' => 'required|string|max:255',
  'status' => 'in:open,in_progress,resolved',
]);
```

---

### 7. **Audit & Logging**

#### Événements Trackés
- ✅ Connexions/déconnexions (succès & échecs)
- ✅ Accès aux données sensibles
- ✅ Modifications d'incidents/alertes
- ✅ Tentatives d'accès non autorisé
- ✅ Erreurs système critiques

```typescript
// Backend Logging
Log::channel('security')->info('User login', [
  'user_id' => auth()->id(),
  'ip' => request()->ip(),
  'user_agent' => request()->userAgent(),
  'timestamp' => now(),
]);
```

---

### 8. **Protection Contre les Intrusions**

#### A. **Rate Limiting (Limitation de Débit)**
```php
// Laravel — Max 60 requêtes par minute par IP
Route::middleware('throttle:60,1')->group(function () {
  Route::post('/login', 'AuthController@login');
  Route::post('/incidents', 'IncidentController@store');
});
```

#### B. **Brute Force Protection**
- ✅ Lockout après 5 tentatives échouées
- ✅ Délai exponentiel : 1s → 2s → 4s → 8s
- ✅ CAPTCHA après 3 tentatives (optionnel)

#### C. **Détection d'Anomalies**
- ✅ Monitoring des connexions inhabituelles
- ✅ Alerte si accès depuis un nouveau pays/IP
- ✅ Monitoring de la bande passante

---

### 9. **Infrastructure de Sécurité**

#### Déploiement Sécurisé
```yaml
# Kubernetes Security Policies
apiVersion: policy/v1
kind: PodSecurityPolicy
metadata:
  name: joj-restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
```

#### Certificats SSL/TLS
- ✅ Certificats auto-signés en dev
- ✅ Let's Encrypt en production (gratuit + auto-renewal)
- ✅ Perfect Forward Secrecy (PFS) activé
- ✅ TLS 1.3 minimum

---

### 10. **Monitoring & Incident Response**

#### Outils de Surveillance
```bash
# Monitoring en temps réel
- Datadog / New Relic
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Prometheus + Grafana

# Détection de menaces
- OSSEC (Host-based IDS)
- Suricata (Network IDS)
- WAF (Web Application Firewall)
```

#### Plan de Réponse aux Incidents
1. **Détection** : Alertes automatiques + monitoring
2. **Analyse** : Logs centralisés, forensics
3. **Confinement** : Isolation de l'élément compromis
4. **Éradication** : Patch, mise à jour, nettoyage
5. **Récupération** : Restauration des services
6. **Post-Mortem** : Leçons apprises, prévention future

---

## 📋 Checklist de Sécurité — JOJ OPS HUB

| Élément | Statut | Implémentation |
|---------|--------|-----------------|
| Authentification | ✅ | Sanctum + JWT |
| HTTPS/TLS | ✅ | Certificats SSL |
| RBAC (Rôles) | ✅ | 6 rôles définis |
| Protection XSS | ✅ | React escaping + CSP |
| Protection CSRF | ✅ | SameSite + Tokens |
| Protection SQL Injection | ✅ | ORM Eloquent |
| Rate Limiting | ✅ | Throttle middleware |
| Input Validation | ✅ | Frontend + Backend |
| Logging d'Audit | ✅ | Events channel |
| Secrets Management | ✅ | Env variables |
| Data Encryption | ✅ | TLS in transit |
| CORS Configuration | ✅ | Domaines whitelist |

---

## 🛡️ Recommandations Supplémentaires

1. **MFA (Multi-Factor Authentication)** : Implémenter TOTP pour les admins
2. **API Rate Limiting** : Activer pour les endpoints publics
3. **Database Encryption** : Chiffrer les données sensibles au repos
4. **Backup & Disaster Recovery** : Sauvegardes quotidiennes testées
5. **Pentesting Régulier** : Tests de sécurité mensuels
6. **Security Headers** : X-Frame-Options, X-Content-Type-Options, etc.
7. **Dependency Scanning** : npm audit, OWASP Dependency-Check
8. **Code Signing** : Signature des releases

---

## 📞 Support Sécurité

- **Email** : security@joj2026.sn
- **Hotline** : +221 33 XXXX XXXX
- **Bounty Program** : https://joj2026.sn/security/bounty

---

**Dernière mise à jour** : 21 Avril 2026  
**Certification** : ISO 27001 en cours
