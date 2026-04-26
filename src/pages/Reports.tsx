import { useState } from 'react';
import { FileText, Download, Plus, User, X, Loader2 } from 'lucide-react';
import { mockReports } from '../lib/mockData';

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
  const [generatedReport, setGeneratedReport] = useState<string>('');

  const [formData, setFormData] = useState({
    type: 'incidents',
    title: '',
    period: '',
    incidents: 0,
    alerts: 0,
    sites: [] as string[],
    customData: '',
  });

  const allSites = ['Stadium Lig Diop', 'Arue Beach', 'Tennis Arena', 'Swimming Pool', 'Cycling Track', 'Basketball Court', 'Football Stadium', 'Handball Court'];

  const handleSiteToggle = (site: string) => {
    setFormData({
      ...formData,
      sites: formData.sites.includes(site)
        ? formData.sites.filter(s => s !== site)
        : [...formData.sites, site],
    });
  };

  const handleGenerateReport = async () => {
    if (!formData.title || !formData.period) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    setIsGenerating(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variables Supabase non configurées');
      }

      const url = `${supabaseUrl}/functions/v1/generate-report`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (!data.report) {
        throw new Error('Rapport vide reçu');
      }

      setGeneratedReport(data.report);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur de génération:', errorMsg);
      alert(`Erreur de génération: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedReport], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `rapport-${formData.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            onClick={() => {
              setGeneratedReport('');
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Générer un rapport
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
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {!generatedReport ? (
              <>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="text-xl font-bold text-gray-900">Générer un Rapport</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de Rapport
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                    >
                      {Object.entries(typeConfig).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du Rapport *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="ex: Rapport Sécurité - Semaine 1"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Période *
                    </label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="ex: 1er - 7 Mai 2026"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre d'Incidents
                      </label>
                      <input
                        type="number"
                        value={formData.incidents}
                        onChange={(e) => setFormData({ ...formData, incidents: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre d'Alertes
                      </label>
                      <input
                        type="number"
                        value={formData.alerts}
                        onChange={(e) => setFormData({ ...formData, alerts: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sites Concernés
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {allSites.map((site) => (
                        <label key={site} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.sites.includes(site)}
                            onChange={() => handleSiteToggle(site)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{site}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informations Additionnelles
                    </label>
                    <textarea
                      value={formData.customData}
                      onChange={(e) => setFormData({ ...formData, customData: e.target.value })}
                      placeholder="Ajoutez des détails spécifiques..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      'Générer le Rapport'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="text-xl font-bold text-gray-900">Rapport Généré</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 max-h-[50vh] overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                    {generatedReport}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={downloadReport}
                      className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                    <button
                      onClick={() => setGeneratedReport('')}
                      className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors"
                    >
                      Générer un Autre
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
