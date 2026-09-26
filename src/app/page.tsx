"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DossierCard from '@/components/dossier-card';
import { PlusCircle, FolderOpen } from 'lucide-react';

interface Dossier {
  id: string;
  title: string;
  description: string | null;
  updatedAt: string;
  _count: {
    sources: number;
  };
}

export default function Home() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dossiers')
      .then(res => res.json())
      .then(data => {
        setDossiers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journalist Research Workspace</h1>
          <p className="text-gray-500 mt-2">Gérez vos dossiers et interrogez vos sources via l'IA.</p>
        </div>
        <Link 
          href="/dossiers/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md flex items-center gap-2 font-medium transition"
        >
          <PlusCircle size={20} />
          Nouveau dossier
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">Vous n'avez encore aucun dossier.</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Créez un dossier pour commencer à organiser vos sources et utiliser l'assistant de recherche IA.</p>
          <Link 
            href="/dossiers/new" 
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
          >
            <PlusCircle size={20} />
            Créer mon premier dossier
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FolderOpen size={20} className="text-gray-500" />
            Mes dossiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dossiers.map(dossier => (
              <DossierCard 
                key={dossier.id}
                id={dossier.id}
                title={dossier.title}
                description={dossier.description}
                sourcesCount={dossier._count.sources}
                updatedAt={dossier.updatedAt}
                onDelete={() => setDossiers(dossiers.filter(d => d.id !== dossier.id))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
