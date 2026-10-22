import React, { useState } from 'react';
import { COMMITTEE_SIMULATION_CASES } from '../data/senaData';
import { CommitteeCase } from '../types/sena';
import confetti from 'canvas-confetti';
import { 
  Scale, 
  Users, 
  Gavel, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface CommitteeSimulatorProps {
  onUnlockBadge: (badgeId: string, xpReward: number) => void;
  isUnlocked: boolean;
}

export const CommitteeSimulator: React.FC<CommitteeSimulatorProps> = ({
  onUnlockBadge,
  isUnlocked
}) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [userDecisions, setUserDecisions] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedCases, setCompletedCases] = useState<string[]>([]);

  const currentCase: CommitteeCase = COMMITTEE_SIMULATION_CASES[currentCaseIndex];
  const selectedOptionIndex = userDecisions[currentCase.id];

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setUserDecisions(prev => ({ ...prev, [currentCase.id]: idx }));
  };

  const handleConfirmDecision = () => {
    if (selectedOptionIndex === undefined) return;
    setShowFeedback(true);

    const isCorrect = currentCase.options[selectedOptionIndex].isCorrect;
    if (isCorrect && !completedCases.includes(currentCase.id)) {
      const updated = [...completedCases, currentCase.id];
      setCompletedCases(updated);

      if (updated.length === COMMITTEE_SIMULATION_CASES.length) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
        onUnlockBadge('badge-comite', 60);
      }
    }
  };

  const handleNextCase = () => {
    setShowFeedback(false);
    if (currentCaseIndex < COMMITTEE_SIMULATION_CASES.length - 1) {
      setCurrentCaseIndex(currentCaseIndex + 1);
    }
  };

  const handlePrevCase = () => {
    setShowFeedback(false);
    if (currentCaseIndex > 0) {
      setCurrentCaseIndex(currentCaseIndex - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden border border-slate-700/50">
        <div className="absolute right-0 top-0 w-80 h-full bg-[#39A900]/10 rounded-l-full pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#39A900] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
              <Scale className="w-3 h-3" />
              Simulador Interactivo
            </span>
            <span className="text-emerald-300 text-xs font-mono">
              Debido Proceso • Acuerdo 009 de 2024 & Acuerdo 002 de 2026
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Comité de Evaluación y Seguimiento en Acción
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Asume el rol deliberativo en el Comité del Centro de Formación. Analiza expedientes reales de aprendices, sopesa atenuantes, agravantes y principios constitucionales, y toma la medida formativa justa.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#39A900]" />
              <span>Instancia Colegiada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>5 Días de Descargos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>Garantía de Reposición</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Navigation dots */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900/90 dark:backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          {COMMITTEE_SIMULATION_CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setShowFeedback(false);
                setCurrentCaseIndex(i);
              }}
              className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center ${
                currentCaseIndex === i
                  ? 'bg-[#39A900] text-white shadow-2xs'
                  : completedCases.includes(c.id)
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-[#007832] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
            Caso {currentCaseIndex + 1} de {COMMITTEE_SIMULATION_CASES.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Casos Resueltos: {completedCases.length}/{COMMITTEE_SIMULATION_CASES.length}
          </span>
          {completedCases.length === COMMITTEE_SIMULATION_CASES.length && (
            <span className="text-xs font-bold text-[#007832] dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              ¡Simulación Completa!
            </span>
          )}
        </div>
      </div>

      {/* Current Case Sheet */}
      <div className="bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono border ${
                currentCase.severity === 'gravísima'
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  : currentCase.severity === 'grave'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              }`}>
                Falta {currentCase.category} • {currentCase.severity}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{currentCase.title}</h2>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            Mesa del Comité: Coord. Académica + Instructores + Vocero
          </div>
        </div>

        {/* Facts & Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Hechos Notificados</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentCase.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#007832] dark:text-emerald-400" />
              <span>Contexto del Aprendiz & Descargos</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentCase.apprenticeContext}
            </p>
          </div>
        </div>

        {/* Deliberation choices */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            ¿Cuál es la recomendación jurídica y pedagógica que debe emitir el Comité?
          </h3>

          <div className="space-y-2.5">
            {currentCase.options.map((opt, oIdx) => {
              const isSelected = selectedOptionIndex === oIdx;
              let style = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200';

              if (showFeedback) {
                if (opt.isCorrect) {
                  style = 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500 font-semibold';
                } else if (isSelected) {
                  style = 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100 font-medium';
                } else {
                  style = 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-slate-400 dark:text-slate-500';
                }
              } else if (isSelected) {
                style = 'border-[#39A900] bg-emerald-50/50 dark:bg-emerald-950/60 text-slate-900 dark:text-emerald-100 ring-1 ring-[#39A900] font-semibold';
              }

              return (
                <button
                  key={oIdx}
                  disabled={showFeedback}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-start justify-between gap-3 ${style}`}
                >
                  <div className="space-y-1">
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-[11px] opacity-75 italic">{opt.action}</p>
                  </div>
                  {showFeedback && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-[#007832] dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {showFeedback && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback block */}
        {showFeedback && selectedOptionIndex !== undefined && (
          <div className={`p-4 rounded-xl border space-y-2 ${
            currentCase.options[selectedOptionIndex].isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80 text-amber-950 dark:text-amber-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-xs">
              {currentCase.options[selectedOptionIndex].isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#007832] dark:text-emerald-400" />
                  <span>Decisión Fundamentada Correcta</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Análisis de la Decisión</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed">
              {currentCase.options[selectedOptionIndex].feedback}
            </p>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              Sustento Normativo: {currentCase.options[selectedOptionIndex].legalBasis}
            </div>
          </div>
        )}

        {/* Case Actions Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrevCase}
            disabled={currentCaseIndex === 0}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Anterior
          </button>

          {!showFeedback ? (
            <button
              onClick={handleConfirmDecision}
              disabled={selectedOptionIndex === undefined}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs ${
                selectedOptionIndex !== undefined
                  ? 'bg-[#39A900] hover:bg-[#2d8500] text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>Emitir Concepto del Comité</span>
            </button>
          ) : (
            <button
              onClick={handleNextCase}
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <span>{currentCaseIndex < COMMITTEE_SIMULATION_CASES.length - 1 ? 'Siguiente Caso' : 'Finalizar Simulación'}</span>
            </button>
          )}

          <button
            onClick={handleNextCase}
            disabled={currentCaseIndex === COMMITTEE_SIMULATION_CASES.length - 1}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
