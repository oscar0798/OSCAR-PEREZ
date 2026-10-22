import React from 'react';
import { Badge } from '../types/sena';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Flag,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  Gavel
} from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  currentXp: number;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  badges,
  currentXp
}) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flag': return <Flag className="w-5 h-5" />;
      case 'Scale': return <Scale className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Gavel': return <Gavel className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Insignias y Logros de Inducción</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Has desbloqueado {earnedCount} de {badges.length} insignias del reglamento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                b.earned
                  ? 'border-amber-200 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 opacity-70'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  b.earned
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                {b.earned ? getIcon(b.icon) : <Lock className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.name}</h4>
                  {b.earned && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#007832] dark:text-emerald-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total XP acumulada: <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{currentXp} XP</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
