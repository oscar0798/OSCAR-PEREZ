import React, { useState } from 'react';
import { FINAL_EXAM_QUESTIONS } from '../data/senaData';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  FileCheck2, 
  Award, 
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface FinalExamProps {
  onExamPassed: (score: number, certCode: string) => void;
  onGoToCertificate: () => void;
  passedScore: number | null;
  certCode: string | null;
}

export const FinalExam: React.FC<FinalExamProps> = ({
  onExamPassed,
  onGoToCertificate,
  passedScore,
  certCode
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | null>(passedScore);

  const handleSelect = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const generateCertCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let part1 = '';
    let part2 = '';
    for (let i = 0; i < 4; i++) {
      part1 += chars.charAt(Math.floor(Math.random() * chars.length));
      part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SENA-IND-2024-${part1}-${part2}`;
  };

  const handleSubmit = () => {
    let correct = 0;
    FINAL_EXAM_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const percent = Math.round((correct / FINAL_EXAM_QUESTIONS.length) * 100);
    setCurrentScore(percent);
    setIsSubmitted(true);

    if (percent >= 75) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
      const newCode = certCode || generateCertCode();
      onExamPassed(percent, newCode);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentScore(null);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === FINAL_EXAM_QUESTIONS.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-300 font-mono border border-emerald-200 dark:border-emerald-800/60">
                Evaluación Certificable
              </span>
              <span className="text-xs text-slate-400">• 10 Preguntas</span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">• Mínimo 75% para aprobar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Evaluación Integral de Inducción SENA
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Valida tu dominio sobre derechos, deberes, prohibiciones, novedades y debido proceso según el Acuerdo 009 de 2024 y Acuerdo 002 de 2026.
            </p>
          </div>

          {certCode && (
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[11px] font-bold text-[#007832] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
                <span>Inducción Aprobada</span>
              </span>
              <button
                onClick={onGoToCertificate}
                className="mt-2 text-xs font-bold text-[#39A900] dark:text-emerald-400 hover:text-[#2d8500] flex items-center gap-1"
              >
                <span>Ver tu Certificado</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Preguntas respondidas: {answeredCount} de {FINAL_EXAM_QUESTIONS.length}
          </span>
          <div className="w-48 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#39A900] h-full transition-all duration-300"
              style={{ width: `${(answeredCount / FINAL_EXAM_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {FINAL_EXAM_QUESTIONS.map((q, idx) => {
          const userAns = selectedAnswers[q.id];
          const hasAnswered = userAns !== undefined;
          const isCorrect = userAns === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl border p-5 transition shadow-2xs space-y-3 ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 dark:border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/30'
                    : 'border-rose-200 dark:border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/30'
                  : hasAnswered
                  ? 'border-[#39A900]/50 dark:border-[#39A900]/50'
                  : 'border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {q.question}
                  </h3>
                </div>

                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="text-[11px] font-bold text-[#007832] dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +10 Pts
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> 0 Pts
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200';

                  if (isSubmitted) {
                    if (optIdx === q.correctAnswer) {
                      optStyle = 'border-emerald-500 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
                    } else if (userAns === optIdx) {
                      optStyle = 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100 font-medium';
                    } else {
                      optStyle = 'border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-850 text-slate-400 dark:text-slate-500';
                    }
                  } else if (userAns === optIdx) {
                    optStyle = 'border-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/70 text-slate-900 dark:text-emerald-100 font-semibold ring-1 ring-[#39A900]';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs transition flex items-start gap-2.5 ${optStyle}`}
                    >
                      <span className="font-mono text-slate-400 dark:text-slate-500 font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Post-submit explanation */}
              {isSubmitted && (
                <div className="pt-2 text-xs border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Fundamento: </span>
                    <span>{q.explanation}</span>
                    <span className="block text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      {q.articleReference}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission action bar */}
      <div className="bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {!isSubmitted ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              {!isComplete ? (
                <span>Por favor responde todas las {FINAL_EXAM_QUESTIONS.length} preguntas antes de enviar la evaluación.</span>
              ) : (
                <span className="font-bold text-[#007832] dark:text-emerald-400">¡Todas las preguntas respondidas! Listo para calificar.</span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                isComplete
                  ? 'bg-[#39A900] hover:bg-[#2d8500] text-white shadow-emerald-700/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Calificar Evaluación de Inducción</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-xs ${
                (currentScore ?? 0) >= 75
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}>
                {currentScore}%
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {(currentScore ?? 0) >= 75
                    ? '¡Felicitaciones! Has completado exitosamente la Inducción SENA'
                    : 'Puntaje insuficiente para certificación (mínimo 75%)'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {(currentScore ?? 0) >= 75
                    ? 'Tu certificado oficial ha sido generado y avalado digitalmente.'
                    : 'Revisa las justificaciones normativas y vuelve a intentarlo.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleRetry}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Examen</span>
              </button>

              {(currentScore ?? 0) >= 75 && (
                <button
                  onClick={onGoToCertificate}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Ver Mi Certificado Oficial</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
