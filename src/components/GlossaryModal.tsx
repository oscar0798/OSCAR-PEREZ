import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/senaData';
import { X, HelpCircle, Search, Tag } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  if (!isOpen) return null;

  const categories = ['todos', ...Array.from(new Set(GLOSSARY_TERMS.map(t => t.category)))];

  const filteredTerms = GLOSSARY_TERMS.filter(t => {
    const matchesQuery = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'todos' || t.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Glosario del Aprendiz SENA</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Términos clave de la inducción, Acuerdo 009 de 2024 y Acuerdo 002 de 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar término o definición..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap capitalize font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-[#39A900] text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Term List */}
        <div className="mt-4 space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {filteredTerms.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.term}</h4>
                <span className="text-[10px] font-bold text-[#007832] dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No se encontraron términos para "{searchTerm}"
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
