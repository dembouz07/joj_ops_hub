import { useState } from 'react';
import { FileText, Download, Plus, User, X, Loader2 } from 'lucide-react';
import { mockReports, mockIncidents, mockTasks, mockSites } from '../lib/mockData';
import { generateIncidentReport, generateTaskReport, generateGeneralReport } from '../lib/pdfGenerator';

const typeConfig: Record<string, { label: string; color: string }> = {
  securite: { label: 'Sécurité', color: 'bg-senred-50 text-senred-700' },
  transport: { label: 'Transport', color: 'bg-sky-50 text-sky-700' },
  frequentation: { label: 'Fréquentation', color: 'bg-green-50 text-green-700' },
  accreditation: { label: 'Accréditations', color: 'bg-gold-100 text-gold-800' },
  incidents: { label: 'Incidents', color: 'bg-terra-50 text-terra-700' },
};

export default function Reports() {
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');

  const handleGeneratePDF = async (type: string) => {
    setIsGenerating(true);
    try {
      switch (type) {
        case 'incidents':
          await generateIncidentReport(mockIncidents);
          break;
        case 'taches':
          await generateTaskReport(mockTasks);
          break;
        case 'general':
          await generateGeneralReport({
            incidents: mockIncidents,
            tasks: mockTasks,
            sites: mockSites
          });
          break;
        default:
          alert('Type de rapport non supporté');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };
  const formatDate = (d: string) =>
    new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(typeConfig).map(([type, cfg]) => (
          <div key={type} className={`rounded-xl p-3 ${cfg.color}`}>
            <p className="text-xl font-bold">{mockReports.filter(r => r.type === type).length}</p>
            <p className="text-xs font-medium">{cfg.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            {mockReports.length} rapports disponibles
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Générer un rapport PDF
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {mockReports.map((report) => {
            const tc = typeConfig[report.type] || { label: report.type, color: 'bg-gray-100 text-gray-600' };
            return (
              <div key={report.id} className="px-5 py-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{report.title}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tc.color}`}>
                      {tc.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {report.generator?.name}
                    <span>·</span>
                    {formatDate(report.created_at!)}
                  </p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0">
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Générer un Rapport PDF</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Sélectionnez le type de rapport à générer. Le PDF sera téléchargé automatiquement avec le logo JOJ et un design professionnel.
              </p>

              <button
                onClick={() => handleGeneratePDF('general')}
                disabled={isGenerating}
                className="w-full p-4 border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-600 flex items-center justify-center transition-colors">
                    <FileText className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Rapport Général</h3>
                    <p className="text-sm text-gray-500">Vue d'ensemble complète : incidents, tâches, sites</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleGeneratePDF('incidents')}
                disabled={isGenerating}
                className="w-full p-4 border-2 border-gray-200 hover:border-senred-500 hover:bg-senred-50 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-senred-100 group-hover:bg-senred-500 flex items-center justify-center transition-colors">
                    <FileText className="w-6 h-6 text-senred-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Rapport des Incidents</h3>
                    <p className="text-sm text-gray-500">Liste détaillée de tous les incidents de sécurité</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleGeneratePDF('taches')}
                disabled={isGenerating}
                className="w-full p-4 border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 group-hover:bg-sky-500 flex items-center justify-center transition-colors">
                    <FileText className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Rapport des Tâches</h3>
                    <p className="text-sm text-gray-500">Suivi complet des tâches par catégorie et priorité</p>
                  </div>
                </div>
              </button>

              {isGenerating && (
                <div className="flex items-center justify-center gap-2 py-4 text-green-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Génération du PDF en cours...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
