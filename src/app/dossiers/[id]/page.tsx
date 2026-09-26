"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, FileText } from 'lucide-react';
import SourceCard from '@/components/source-card';
import SourceForm from '@/components/source-form';
import ResearchPanel from '@/components/research-panel';

interface Dossier {
  id: string;
  title: string;
  description: string | null;
}

interface Source {
  id: string;
  title: string;
  url: string | null;
  content: string;
}

export default function DossierPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dossierRes, sourcesRes] = await Promise.all([
        fetch(`/api/dossiers/${id}`),
        fetch(`/api/dossiers/${id}/sources`)
      ]);
      
      if (dossierRes.ok) setDossier(await dossierRes.json());
      if (sourcesRes.ok) setSources(await sourcesRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteSource = async (sourceId: string) => {
    if (!confirm('Supprimer cette source ?')) return;
    try {
      const res = await fetch(`/api/sources/${sourceId}`, { method: 'DELETE' });
      if (res.ok) {
        setSources(sources.filter(s => s.id !== sourceId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Dossier introuvable</h2>
        <Link href="/" className="text-blue-600 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition">
        <ArrowLeft size={16} />
        Retour aux dossiers
      </Link>

      {/* Header */}
      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{dossier.title}</h1>
        {dossier.description && (
          <p className="text-gray-600 text-lg">{dossier.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Sources */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText size={20} className="text-gray-500" />
              Sources ({sources.length})
            </h2>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
            {sources.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm mb-4">Ce dossier ne contient aucune source pour le moment.</p>
              </div>
            ) : (
              sources.map(source => (
                <SourceCard 
                  key={source.id} 
                  {...source} 
                  onDelete={handleDeleteSource} 
                />
              ))
            )}
            
            <SourceForm dossierId={id} onSuccess={fetchData} />
          </div>
        </div>

        {/* Right Column - Research */}
        <div className="lg:col-span-2">
          <ResearchPanel dossierId={id} sourcesCount={sources.length} />
        </div>

      </div>
    </div>
  );
}
