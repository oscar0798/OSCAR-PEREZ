import React from 'react';
import { LearningModule } from '../types/sena';
import { 
  Building2, 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  Briefcase, 
  Gavel, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ModuleCardProps {
  module: LearningModule;
  isCompleted: boolean;
  score?: number;
  onOpen: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isCompleted,
  score,
  onOpen
}) => {
  const getIcon = () => {
    switch (module.iconName) {
      case 'Building2': return <Building2 className="w-6 h-6" />;
      case 'Scale': return <Scale className="w-6 h-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
      case 'AlertTriangle': return <AlertTriangle className="w-6 h-6" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6" />;
      case 'Gavel': return <Gavel className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  return (
    <div
      onClick={onOpen}
      className={`group relative bg-white dark:bg-slate-900/80 dark:backdrop-blur-md rounded-2xl border transition-all duration-200 p-5 cursor-pointer flex flex-col justify-between hover:shadow-lg dark:hover:shadow-emerald-950/40 hover:-translate-y-0.5 ${
        isCompleted
          ? 'border-emerald-200/90 dark:border-emerald-500/30 shadow-xs'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-[#39A900]/50 dark:hover:border-[#39A900]/50'
      }`}
    >
      <div>
        {/* Card Header with module number and completion badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${module.color}18`, color: module.color }}
          >
            {getIcon()}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              Módulo {module.number}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" />
                {score !== undefined ? `${score}%` : 'Superado'}
              </span>
            )}
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#007832] dark:group-hover:text-emerald-400 transition">
          {module.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 line-clamp-1">
          {module.tagline}
        </p>

        {/* Short description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
          {module.shortDescription}
        </p>
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{module.estimatedMinutes} min lectura</span>
        </div>

        <div className="flex items-center gap-1 text-[#39A900] dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition">
          <span>{isCompleted ? 'Repasar' : 'Iniciar'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
