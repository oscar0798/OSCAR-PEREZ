import React, { useState } from 'react';
import { LearningModule } from '../types/sena';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Flame, 
  Sparkles, 
  HelpCircle, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

interface ModuleViewerProps {
  module: LearningModule;
  onBack: () => void;
  onCompleteModule: (moduleId: string, score: number, earnedXp: number, badgeId: string) => void;
  onGoToNextModule?: () => void;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({
  module,
  onBack,
  onCompleteModule,
  onGoToNextModule
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinishQuiz = () => {
    let correctCount = 0;
    let earnedXp = 0;

    module.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
        earnedXp += q.points;
      }
    });

    const percent = Math.round((correctCount / module.quiz.length) * 100);
    setQuizScore(percent);
    setShowResults(true);

    if (percent >= 50) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onCompleteModule(module.id, percent, earnedXp + 20, module.badgeId);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setQuizScore(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al plan de módulos</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'content'
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guía y Reglamento</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-[#39A900] text-white shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reto Evaluativo ({module.quiz.length})</span>
          </button>
        </div>
      </div>

      {/* Module Banner */}
      <div className="bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div
          className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full opacity-10 dark:opacity-20 pointer-events-none"
          style={{ backgroundColor: module.color }}
        />
        
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${module.color}20`, color: module.color }}
          >
            Módulo {module.number} • Formación Integral
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-400">• {module.estimatedMinutes} min</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {module.title}
        </h1>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
          {module.tagline}
        </p>
      </div>

      {/* TAB 1: CONTENT */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {module.sections.map((section, idx) => (
            <div
              key={section.id}
              className="bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-[#39A900] dark:text-emerald-400 uppercase tracking-wider">
                    {section.badge}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{section.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{section.subtitle}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center font-mono">
                  {idx + 1}
                </div>
              </div>

              {/* Text paragraphs */}
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Key points cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {section.keyPoints.map((point, kIdx) => {
                  let borderStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100';
                  let iconColor = 'text-slate-600 dark:text-slate-300';

                  if (point.type === 'positive') {
                    borderStyle = 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200';
                    iconColor = 'text-[#007832] dark:text-emerald-400';
                  } else if (point.type === 'warning') {
                    borderStyle = 'border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200';
                    iconColor = 'text-amber-600 dark:text-amber-400';
                  } else if (point.type === 'danger') {
                    borderStyle = 'border-rose-200 dark:border-rose-800/50 bg-rose-50/40 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200';
                    iconColor = 'text-rose-600 dark:text-rose-400';
                  }

                  return (
                    <div
                      key={kIdx}
                      className={`p-3.5 rounded-xl border ${borderStyle} flex items-start gap-3 transition hover:shadow-2xs`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-2xs ${iconColor} shrink-0`}>
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{point.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{point.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Prompt to take the quiz */}
          <div className="bg-gradient-to-r from-emerald-50 via-[#39A900]/10 to-emerald-50 dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#39A900] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">¿Listo para poner a prueba tus conocimientos?</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Responde las preguntas del módulo, acumula XP y desbloquea la insignia de este tema.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('quiz')}
              className="px-5 py-2.5 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Comenzar Reto</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: QUIZ / RETO */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Reto de Preguntas: {module.title}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                {Object.keys(selectedAnswers).length}/{module.quiz.length} respondidas
              </span>
            </div>

            <div className="space-y-6">
              {module.quiz.map((q, qIndex) => {
                const userChoice = selectedAnswers[q.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center font-mono">
                          {qIndex + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {q.question}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 shrink-0 font-mono border border-amber-200 dark:border-amber-800/60">
                        +{q.points} XP
                      </span>
                    </div>

                    {q.scenario && (
                      <div className="text-xs bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 p-2.5 rounded-lg text-amber-900 dark:text-amber-200 italic">
                        <strong>Caso: </strong>{q.scenario}
                      </div>
                    )}

                    {/* Options */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        let btnStyle = 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200';

                        if (showResults) {
                          if (optIndex === q.correctAnswer) {
                            btnStyle = 'border-emerald-500 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-500';
                          } else if (userChoice === optIndex) {
                            btnStyle = 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-medium';
                          } else {
                            btnStyle = 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-slate-400 dark:text-slate-500';
                          }
                        } else if (userChoice === optIndex) {
                          btnStyle = 'border-[#39A900] bg-emerald-50/60 dark:bg-emerald-950/60 text-slate-900 dark:text-emerald-100 font-semibold ring-1 ring-[#39A900]';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={showResults}
                            onClick={() => handleSelectAnswer(q.id, optIndex)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between gap-3 ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {showResults && optIndex === q.correctAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-[#007832] dark:text-emerald-400 shrink-0" />
                            )}
                            {showResults && userChoice === optIndex && optIndex !== q.correctAnswer && (
                              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if show results */}
                    {showResults && (
                      <div className="pt-2 text-xs border-t border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Fundamento (Acuerdo 009 de 2024):</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 pl-5">{q.explanation}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 pl-5 font-mono">
                          {q.articleReference}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Action Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              {!showResults ? (
                <button
                  onClick={handleFinishQuiz}
                  disabled={Object.keys(selectedAnswers).length < module.quiz.length}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                    Object.keys(selectedAnswers).length === module.quiz.length
                      ? 'bg-[#39A900] hover:bg-[#2d8500] text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enviar Respuestas y Calificar</span>
                </button>
              ) : (
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      (quizScore ?? 0) >= 50 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}>
                      {quizScore}%
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {(quizScore ?? 0) >= 50 ? '¡Reto Superado!' : 'Sigue practicando'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {(quizScore ?? 0) >= 50
                          ? 'Insignia desbloqueada y experiencia sumada.'
                          : 'Puedes reiniciar el reto para mejorar tu calificación.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleRetakeQuiz}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
                    >
                      Reintentar
                    </button>
                    {onGoToNextModule && (
                      <button
                        onClick={onGoToNextModule}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>Siguiente Módulo</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
