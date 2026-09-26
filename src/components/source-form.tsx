import { useState } from 'react';

interface SourceFormProps {
  dossierId: string;
  onSuccess: () => void;
}

export default function SourceForm({ dossierId, onSuccess }: SourceFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/dossiers/${dossierId}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url, content }),
      });

      if (res.ok) {
        setTitle('');
        setUrl('');
        setContent('');
        setIsOpen(false);
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <span>+ Ajouter une source</span>
      </button>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <h4 className="font-semibold mb-4 text-gray-800">Nouvelle source</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input
            required
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Ex: Rapport France Travail sur l'IA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL (optionnel)</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu texte *</label>
          <textarea
            required
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Collez ici le texte de la source..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={loading || !title || !content}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition"
          >
            {loading ? 'Ajout...' : 'Ajouter la source'}
          </button>
        </div>
      </form>
    </div>
  );
}
