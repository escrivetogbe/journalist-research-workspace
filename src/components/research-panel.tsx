import { useState } from 'react';
import { Search, AlertTriangle, FileText } from 'lucide-react';

interface Citation {
  sourceId: string;
  sourceTitle: string;
  excerpt: string;
}

interface ResearchResponse {
  answer: string;
  sufficient: boolean;
  citations: Citation[];
}

interface ResearchPanelProps {
  dossierId: string;
  sourcesCount: number;
}

export default function ResearchPanel({ dossierId, sourcesCount }: ResearchPanelProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState('');

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/dossiers/${dossierId}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error('Impossible d\'obtenir une réponse.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-slate-800 text-white p-5 flex items-center gap-3">
        <Search size={22} className="text-blue-400" />
        <h3 className="font-semibold text-lg">Recherche IA dans le dossier</h3>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleResearch} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ex: Quels sont les impacts de l'IA sur l'emploi ?"
              className="flex-grow px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-lg"
              disabled={loading || sourcesCount === 0}
            />
            <button
              type="submit"
              disabled={loading || !question.trim() || sourcesCount === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              {loading ? 'Analyse...' : 'Analyser'}
            </button>
          </div>
          {sourcesCount === 0 && (
            <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
              <AlertTriangle size={14} />
              Ajoutez des sources au dossier pour pouvoir utiliser la recherche IA.
            </p>
          )}
        </form>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p>Analyse des sources en cours...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error} Veuillez réessayer.</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8">
            <div className={`p-5 rounded-lg border mb-6 ${result.sufficient ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-200'}`}>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                Réponse
              </h4>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result.answer}</p>
            </div>

            {result.citations && result.citations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 uppercase text-sm tracking-wider">Sources utilisées</h4>
                <div className="space-y-4">
                  {result.citations.map((cit, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-start gap-3">
                      <FileText size={18} className="text-gray-400 mt-1 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm mb-1">{cit.sourceTitle}</p>
                        <p className="text-gray-600 text-sm italic border-l-2 border-blue-400 pl-3 py-1">"{cit.excerpt}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
