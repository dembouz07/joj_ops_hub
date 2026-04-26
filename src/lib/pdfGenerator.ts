import jsPDF from 'jspdf';

// Couleurs JOJ
const COLORS = {
  green: '#006B3C',
  gold: '#D4AF37',
  red: '#C1272D',
  darkGreen: '#004D2A',
  lightGreen: '#E8F5E9',
  gray: '#666666',
  lightGray: '#F5F5F5',
};

// Fonction pour convertir une image en base64
const getLogoBase64 = async (): Promise<string> => {
  try {
    const response = await fetch('/JOH.png');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erreur chargement logo:', error);
    return '';
  }
};

// Fonction pour ajouter l'en-tête avec logo
const addHeader = (doc: jsPDF, title: string, logoBase64?: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Fond vert en haut
  doc.setFillColor(COLORS.green);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Logo (si disponible)
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 15, 8, 20, 20);
    } catch (error) {
      console.error('Erreur ajout logo:', error);
    }
  }
  
  // Titre du rapport
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, logoBase64 ? 45 : 15, 20);
  
  // Sous-titre
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Jeux Olympiques de la Jeunesse - Dakar 2026', logoBase64 ? 45 : 15, 27);
};

// Fonction pour ajouter le pied de page
const addFooter = (doc: jsPDF, pageNumber: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Ligne de séparation
  doc.setDrawColor(COLORS.green);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
  
  // Texte du pied de page
  doc.setTextColor(COLORS.gray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('JOJ OPS HUB - Système de gestion opérationnelle', 15, pageHeight - 12);
  
  // Date de génération
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Généré le ${dateStr}`, 15, pageHeight - 8);
  
  // Numéro de page
  doc.setFont('helvetica', 'bold');
  doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 10);
  
  // Bande colorée en bas
  doc.setFillColor(COLORS.green);
  doc.rect(0, pageHeight - 3, pageWidth / 3, 3, 'F');
  doc.setFillColor(COLORS.gold);
  doc.rect(pageWidth / 3, pageHeight - 3, pageWidth / 3, 3, 'F');
  doc.setFillColor(COLORS.red);
  doc.rect((pageWidth / 3) * 2, pageHeight - 3, pageWidth / 3, 3, 'F');
};

// Fonction pour ajouter une section
const addSection = (doc: jsPDF, title: string, yPosition: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Fond de la section
  doc.setFillColor(COLORS.lightGreen);
  doc.rect(15, yPosition, pageWidth - 30, 10, 'F');
  
  // Titre de la section
  doc.setTextColor(COLORS.darkGreen);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, yPosition + 7);
  
  return yPosition + 15;
};

// Fonction pour ajouter un tableau
const addTable = (
  doc: jsPDF,
  headers: string[],
  rows: string[][],
  yPosition: number
): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const tableWidth = pageWidth - 30;
  const colWidth = tableWidth / headers.length;
  let currentY = yPosition;
  
  // En-têtes
  doc.setFillColor(COLORS.green);
  doc.rect(15, currentY, tableWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  headers.forEach((header, i) => {
    doc.text(header, 17 + i * colWidth, currentY + 5.5);
  });
  
  currentY += 8;
  
  // Lignes
  doc.setTextColor(COLORS.gray);
  doc.setFont('helvetica', 'normal');
  
  rows.forEach((row, rowIndex) => {
    // Alternance de couleurs
    if (rowIndex % 2 === 0) {
      doc.setFillColor(COLORS.lightGray);
      doc.rect(15, currentY, tableWidth, 7, 'F');
    }
    
    row.forEach((cell, colIndex) => {
      doc.text(cell, 17 + colIndex * colWidth, currentY + 5);
    });
    
    currentY += 7;
  });
  
  return currentY + 5;
};

// Fonction pour générer un rapport d'incidents
export const generateIncidentReport = async (incidents: any[]) => {
  const doc = new jsPDF();
  const logoBase64 = await getLogoBase64();
  
  // En-tête
  addHeader(doc, 'RAPPORT DES INCIDENTS', logoBase64);
  
  let yPos = 45;
  
  // Résumé
  yPos = addSection(doc, 'RÉSUMÉ EXÉCUTIF', yPos);
  
  doc.setTextColor(COLORS.gray);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const total = incidents.length;
  const resolved = incidents.filter(i => i.status === 'resolved').length;
  const inProgress = incidents.filter(i => i.status === 'in_progress').length;
  const open = incidents.filter(i => i.status === 'open').length;
  const critical = incidents.filter(i => i.severity === 'critical').length;
  
  doc.text(`Total des incidents : ${total}`, 20, yPos);
  yPos += 6;
  doc.text(`Résolus : ${resolved} | En cours : ${inProgress} | Ouverts : ${open}`, 20, yPos);
  yPos += 6;
  doc.text(`Incidents critiques : ${critical}`, 20, yPos);
  yPos += 12;
  
  // Liste des incidents
  yPos = addSection(doc, 'LISTE DES INCIDENTS', yPos);
  
  const headers = ['Titre', 'Sévérité', 'Statut', 'Site'];
  const rows = incidents.map(incident => [
    incident.title.substring(0, 30) + (incident.title.length > 30 ? '...' : ''),
    incident.severity === 'critical' ? 'Critique' : 
    incident.severity === 'high' ? 'Élevé' : 
    incident.severity === 'medium' ? 'Moyen' : 'Faible',
    incident.status === 'resolved' ? 'Résolu' : 
    incident.status === 'in_progress' ? 'En cours' : 'Ouvert',
    incident.site?.name.substring(0, 20) || 'N/A'
  ]);
  
  yPos = addTable(doc, headers, rows, yPos);
  
  // Pied de page
  addFooter(doc, 1);
  
  // Télécharger
  const fileName = `rapport_incidents_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Fonction pour générer un rapport de tâches
export const generateTaskReport = async (tasks: any[]) => {
  const doc = new jsPDF();
  const logoBase64 = await getLogoBase64();
  
  // En-tête
  addHeader(doc, 'RAPPORT DES TÂCHES', logoBase64);
  
  let yPos = 45;
  
  // Résumé
  yPos = addSection(doc, 'RÉSUMÉ EXÉCUTIF', yPos);
  
  doc.setTextColor(COLORS.gray);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const urgent = tasks.filter(t => t.priority === 'urgent').length;
  
  doc.text(`Total des tâches : ${total}`, 20, yPos);
  yPos += 6;
  doc.text(`Terminées : ${completed} | En cours : ${inProgress} | En attente : ${pending}`, 20, yPos);
  yPos += 6;
  doc.text(`Tâches urgentes : ${urgent}`, 20, yPos);
  yPos += 12;
  
  // Répartition par catégorie
  yPos = addSection(doc, 'RÉPARTITION PAR CATÉGORIE', yPos);
  
  const categories = ['securite', 'transports', 'accreditations', 'protocole', 'medias'];
  const categoryLabels: Record<string, string> = {
    securite: 'Sécurité',
    transports: 'Transports',
    accreditations: 'Accréditations',
    protocole: 'Protocole',
    medias: 'Médias'
  };
  
  categories.forEach(cat => {
    const count = tasks.filter(t => t.category === cat).length;
    doc.text(`${categoryLabels[cat]} : ${count} tâches`, 20, yPos);
    yPos += 6;
  });
  
  yPos += 6;
  
  // Liste des tâches
  yPos = addSection(doc, 'LISTE DES TÂCHES', yPos);
  
  const headers = ['Titre', 'Catégorie', 'Priorité', 'Statut'];
  const rows = tasks.slice(0, 15).map(task => [
    task.title.substring(0, 30) + (task.title.length > 30 ? '...' : ''),
    categoryLabels[task.category] || task.category,
    task.priority === 'urgent' ? 'Urgent' : 
    task.priority === 'high' ? 'Élevé' : 
    task.priority === 'medium' ? 'Moyen' : 'Faible',
    task.status === 'completed' ? 'Terminé' : 
    task.status === 'in_progress' ? 'En cours' : 'En attente'
  ]);
  
  yPos = addTable(doc, headers, rows, yPos);
  
  // Pied de page
  addFooter(doc, 1);
  
  // Télécharger
  const fileName = `rapport_taches_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Fonction pour générer un rapport général
export const generateGeneralReport = async (data: {
  incidents: any[];
  tasks: any[];
  sites: any[];
}) => {
  const doc = new jsPDF();
  const logoBase64 = await getLogoBase64();
  
  // En-tête
  addHeader(doc, 'RAPPORT OPÉRATIONNEL GÉNÉRAL', logoBase64);
  
  let yPos = 45;
  
  // Vue d'ensemble
  yPos = addSection(doc, 'VUE D\'ENSEMBLE', yPos);
  
  doc.setTextColor(COLORS.gray);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Sites actifs : ${data.sites.length}`, 20, yPos);
  yPos += 6;
  doc.text(`Incidents totaux : ${data.incidents.length}`, 20, yPos);
  yPos += 6;
  doc.text(`Tâches totales : ${data.tasks.length}`, 20, yPos);
  yPos += 12;
  
  // Incidents
  yPos = addSection(doc, 'INCIDENTS', yPos);
  
  const resolvedIncidents = data.incidents.filter(i => i.status === 'resolved').length;
  const criticalIncidents = data.incidents.filter(i => i.severity === 'critical').length;
  
  doc.text(`Résolus : ${resolvedIncidents}/${data.incidents.length}`, 20, yPos);
  yPos += 6;
  doc.text(`Critiques : ${criticalIncidents}`, 20, yPos);
  yPos += 12;
  
  // Tâches
  yPos = addSection(doc, 'TÂCHES', yPos);
  
  const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
  const urgentTasks = data.tasks.filter(t => t.priority === 'urgent').length;
  
  doc.text(`Terminées : ${completedTasks}/${data.tasks.length}`, 20, yPos);
  yPos += 6;
  doc.text(`Urgentes : ${urgentTasks}`, 20, yPos);
  yPos += 12;
  
  // Sites
  yPos = addSection(doc, 'SITES PRINCIPAUX', yPos);
  
  const headers = ['Site', 'Type', 'Capacité'];
  const rows = data.sites.slice(0, 8).map(site => [
    site.name.substring(0, 35),
    site.type.charAt(0).toUpperCase() + site.type.slice(1),
    site.capacity.toLocaleString('fr-FR')
  ]);
  
  yPos = addTable(doc, headers, rows, yPos);
  
  // Pied de page
  addFooter(doc, 1);
  
  // Télécharger
  const fileName = `rapport_general_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
