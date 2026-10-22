import React from 'react';
import { X, Layers, Sparkles } from 'lucide-react';

interface StructuredPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StructuredPlanModal: React.FC<StructuredPlanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const planPhases = [
    {
      phase: 'Fase 1',
      title: 'Contextualización e Identidad Institucional',
      norm: 'Ley 119 de 1994 & Acuerdo 009 de 2024 (Cap. I, Art. 1-4)',
      objective: 'Apropiar la historia, misión, valores éticos y el modelo de Formación Profesional Integral (FPI) por competencias.',
      activities: [
        'Módulo interactivo sobre la gratuidad absoluta, cobertura nacional y principios humanistas.',
        'Reto evaluativo de conceptos básicos (Saber, Saber Hacer, Saber Ser).'
      ],
      xp: '40 XP + Insignia Identidad y Principios'
    },
    {
      phase: 'Fase 2',
      title: 'Apropiación de Derechos y Representatividad',
      norm: 'Acuerdo 009 de 2024 - Cap. II (Art. 5, 6 y 7)',
      objective: 'Garantizar que todo aprendiz conozca los 24 derechos específicos, calificación en máximo 8 días hábiles, EPP e inclusión.',
      activities: [
        'Exploración de garantías formativas, elementos de protección personal (EPP) y ajustes razonables por discapacidad.',
        'Servicios de Bienestar al Aprendiz, reconocimientos a la excelencia y elección de voceros de ficha.'
      ],
      xp: '50 XP + Insignia Defensor de Derechos'
    },
    {
      phase: 'Fase 3',
      title: 'Deberes del Aprendiz y Prohibiciones Expresas',
      norm: 'Acuerdo 009 de 2024 - Cap. III (Art. 8 y 9)',
      objective: 'Consolidar el acta de compromiso, porte visible de carné, justificación en 3 días hábiles y cero tolerancia a armas o drogas.',
      activities: [
        'Términos reglamentarios de justificación de inasistencias (máximo 3 días hábiles ante EPS o fuerza mayor).',
        'Cuidado de bienes, honestidad académica (antiplagio) y prohibición de proselitismo político o sustancias.'
      ],
      xp: '50 XP + Insignia Guardián del Deber'
    },
    {
      phase: 'Fase 4',
      title: 'Novedades, Permanencia y las 5 Modalidades de Etapa Productiva',
      norm: 'Acuerdo 009 de 2024 - Cap. IV (Art. 10 al 35)',
      objective: 'Gestionar trámites oportunos para evitar deserción y conocer las 5 opciones para desarrollar la etapa práctica.',
      activities: [
        'Trámites preventivos: traslados, aplazamiento (hasta por 6 meses) y reingreso antes del vencimiento.',
        'Las 5 modalidades de etapa productiva: Contrato de Aprendizaje, Vínculo Laboral, Proyecto Emprender, Pasantía y Monitoría SENA.'
      ],
      xp: '50 XP + Insignia Gestor de Novedades'
    },
    {
      phase: 'Fase 5',
      title: 'Debido Proceso, Régimen de Faltas y Reforma del Art. 48',
      norm: 'Acuerdo 009 de 2024 (Cap. V) & Acuerdo 002 de 2026',
      objective: 'Comprender la actuación del Equipo Ejecutor del Programa vs el Comité de Centro y los 5 días de descargos.',
      activities: [
        'Distinción pedagógica: Medidas formativas (llamado verbal y plan de mejoramiento) vs Sanciones formales del Subdirector.',
        'Reforma del Art. 48: Equipo Ejecutor de Programa (acompañamiento directo) y Comité de Centro (debido proceso formal).',
        'Simulador interactivo del Comité resolviendo casos reales con 5 días hábiles para descargos.'
      ],
      xp: '80 XP + Insignia Garante del Debido Proceso'
    },
    {
      phase: 'Fase 6',
      title: 'Evaluación Integral Gamificada y Certificación Institucional',
      norm: 'Acreditación Oficial de Inducción',
      objective: 'Evaluar holísticamente las competencias del reglamento y emitir el Certificado Oficial Verificable con QR.',
      activities: [
        'Examen de 10 casos prácticos con mínimo del 75% de aprobación.',
        'Emisión de Certificado Institucional con código único, firmas y validez nacional.'
      ],
      xp: '100 XP + Insignia Aprendiz Certificado'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Plan Estructurado de Inducción SENA</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Diseño pedagógico basado en el Acuerdo 009 de 2024 y Acuerdo 002 de 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Body */}
        <div className="mt-4 space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
          {planPhases.map((phase, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#39A900] text-white font-mono">
                    {phase.phase}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{phase.title}</h4>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                  {phase.norm}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                <strong>Objetivo:</strong> {phase.objective}
              </p>

              <div className="bg-white dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-750 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] block">Actividades y Evidencias:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {phase.activities.map((act, aIdx) => (
                    <li key={aIdx}>{act}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> {phase.xp}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Servicio Nacional de Aprendizaje • Dirección de Formación Profesional</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold transition"
          >
            Cerrar Plan
          </button>
        </div>
      </div>
    </div>
  );
};
