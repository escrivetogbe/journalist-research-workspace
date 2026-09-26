import { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

interface DossierCardProps {
  id: string;
  title: string;
  description: string | null;
  sourcesCount: number;
  updatedAt: string;
  onDelete?: () => void;
}

export default function DossierCard({ id, title, description, sourcesCount, updatedAt, onDelete }: DossierCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const date = new Date(updatedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/dossiers/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert("Impossible de supprimer le dossier. Veuillez réessayer.");
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  const handleShowConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(true);
  };

  const handleCancelConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(false);
  };

  return (
    <div className="relative h-full">
      <Link href={`/dossiers/${id}`} className="block h-full">
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition bg-white h-full flex flex-col group relative">
          <button 
            onClick={handleShowConfirm}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
            title="Supprimer le dossier"
          >
            <Trash2 size={18} />
          </button>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-6">{title}</h3>
          <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
            {description || "Aucune description"}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t">
            <span>{sourcesCount} source{sourcesCount > 1 ? 's' : ''}</span>
            <span>Mis à jour : {date}</span>
          </div>
        </div>
      </Link>

      {isConfirming && (
        <div className="absolute inset-0 bg-white/95 border border-gray-200 rounded-lg p-6 flex flex-col justify-center items-center text-center z-10 shadow-lg">
          <p className="text-gray-900 font-medium mb-4">
            Voulez-vous vraiment supprimer ce dossier ? Cette action supprimera également ses sources.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleCancelConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
            >
              Annuler
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-md transition"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
