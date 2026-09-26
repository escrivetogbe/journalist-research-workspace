import { FileText, Link as LinkIcon, Trash2 } from 'lucide-react';

interface SourceCardProps {
  id: string;
  title: string;
  url: string | null;
  content: string;
  onDelete: (id: string) => void;
}

export default function SourceCard({ id, title, url, content, onDelete }: SourceCardProps) {
  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm relative group">
      <button 
        onClick={() => onDelete(id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        title="Supprimer la source"
      >
        <Trash2 size={18} />
      </button>
      
      <h4 className="font-medium text-lg pr-8 flex items-start gap-2">
        <FileText size={20} className="text-blue-500 mt-1 shrink-0" />
        {title}
      </h4>
      
      {url && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2 ml-7"
        >
          <LinkIcon size={14} />
          {url}
        </a>
      )}
      
      <div className="mt-4 ml-7 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 max-h-32 overflow-y-auto">
        <p className="line-clamp-3 italic">"{content.substring(0, 150)}{content.length > 150 ? '...' : ''}"</p>
      </div>
    </div>
  );
}
