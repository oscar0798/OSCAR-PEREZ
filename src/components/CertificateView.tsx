import React, { useRef } from 'react';
import { ApprenticeProfile, InductionProgress } from '../types/sena';
import { SenaLogo } from './SenaLogo';
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Edit3, 
  Sparkles, 
  Share2,
  Calendar,
  Award,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface CertificateViewProps {
  profile: ApprenticeProfile;
  progress: InductionProgress;
  onOpenProfile: () => void;
  onOpenVerifier: () => void;
  onGoToExam: () => void;
  onOpenSheets?: () => void;
  sheetUrl?: string | null;
  syncStatus?: string;
  showSheetsAction?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  profile,
  progress,
  onOpenProfile,
  onOpenVerifier,
  onGoToExam,
  onOpenSheets,
  sheetUrl,
  syncStatus,
  showSheetsAction = true
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isEligible = progress.finalExamPassed && progress.certificateCode;
  const certDate = progress.certificateGeneratedAt || new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Non-print controls bar */}
      <div className="no-print bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Certificado Oficial de Inducción</h2>
            {isEligible ? (
              <span className="bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
              </span>
            ) : (
              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Pendiente de Aprobación
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Documento digital verificable emitido bajo los lineamientos del Acuerdo 009 de 2024 (Mod. Ac. 002 de 2026).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenProfile}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            title="Editar los nombres o ficha que salen en el certificado"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Editar Datos</span>
          </button>

          <button
            onClick={onOpenVerifier}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/70 text-[#007832] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            title="Validar autenticidad del certificado con el código único"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Verificar Código</span>
          </button>

          {showSheetsAction && onOpenSheets && (
            <button
              onClick={() => {
                if (sheetUrl) {
                  window.open(sheetUrl, '_blank');
                } else {
                  onOpenSheets();
                }
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-[#007832] dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
              title="Ver hoja de registro en Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>
                {syncStatus === 'saving'
                  ? 'Guardando...'
                  : syncStatus === 'saved'
                  ? 'Sincronizado'
                  : sheetUrl
                  ? 'Ver en Google Sheets'
                  : 'Guardar en Drive'}
              </span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {!isEligible && (
        <div className="no-print bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Aviso de inducción:</strong> Esta es una vista previa del certificado. Para validarlo oficialmente y registrar el código de autenticidad, debes presentar y aprobar la evaluación final con un mínimo del 75%.
            </span>
          </div>
          <button
            onClick={onGoToExam}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shrink-0"
          >
            Ir a la Evaluación
          </button>
        </div>
      )}

      {/* THE CERTIFICATE SHEET */}
      <div
        ref={certificateRef}
        className="certificate-page bg-white rounded-2xl border-8 border-slate-100 dark:border-slate-800 shadow-xl p-8 sm:p-12 relative overflow-hidden text-center selection:bg-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(57, 169, 0, 0.02) 0%, rgba(255, 255, 255, 1) 70%)'
        }}
      >
        {/* Subtle decorative inner border */}
        <div className="border-2 border-[#39A900]/30 rounded-xl p-6 sm:p-10 relative">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#39A900]" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#39A900]" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#39A900]" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#39A900]" />

          {/* Watermark Logo Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
            <SenaLogo variant="symbol" className="w-96 h-96" />
          </div>

          {/* Header Institutional Identity */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <SenaLogo variant="symbol" className="w-14 h-14" />
            </div>

            <div>
              <p className="text-[11px] font-extrabold tracking-[0.25em] uppercase text-slate-500">
                REPÚBLICA DE COLOMBIA
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-[#007832] tracking-tight uppercase mt-0.5">
                SERVICIO NACIONAL DE APRENDIZAJE - SENA
              </h1>
              <p className="text-xs font-semibold text-slate-600 tracking-wide mt-0.5">
                {profile.regional.toUpperCase()} • {profile.trainingCenter.toUpperCase()}
              </p>
            </div>

            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39A900] to-transparent mx-auto mt-2" />
          </div>

          {/* Certificate Title */}
          <div className="my-7 space-y-1">
            <span className="text-xs font-bold text-amber-700 tracking-widest uppercase">
              CERTIFICADO OFICIAL DE CUMPLIMIENTO
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              INDUCCIÓN INTEGRAL AL REGLAMENTO DEL APRENDIZ
            </h2>
            <p className="text-xs font-semibold text-emerald-800 font-mono">
              Acuerdo No. 009 de 2024 (Modificado por Acuerdo 002 de 2026) del Consejo Directivo Nacional
            </p>
          </div>

          {/* Certificate Body Text */}
          <div className="space-y-4 max-w-2xl mx-auto text-slate-700 text-xs sm:text-sm leading-relaxed">
            <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">
              La Subdirección de Centro y la Coordinación de Formación Profesional certifican que:
            </p>

            {/* Apprentice Name */}
            <div className="py-2">
              <h3 className="text-2xl sm:text-3xl font-black text-[#005c24] tracking-tight underline decoration-[#39A900]/40 underline-offset-4">
                {profile.fullName.toUpperCase()}
              </h3>
              <p className="text-xs font-mono font-bold text-slate-600 mt-1">
                Identificado(a) con {profile.documentType} No. {profile.documentNumber}
              </p>
            </div>

            {/* Program details */}
            <p className="text-xs sm:text-sm text-slate-800">
              Participó activamente y aprobó con éxito el proceso de Inducción de la Formación Profesional Integral en el programa:
            </p>

            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 my-2 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">
                {profile.trainingProgram}
              </p>
              <p className="text-slate-500 font-mono font-bold text-xs mt-0.5">
                Ficha de Caracterización: #{profile.ficheNumber}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed text-justify sm:text-center">
              Acreditando pleno conocimiento y comprensión de sus <strong>Derechos</strong>, <strong>Deberes</strong>, <strong>Prohibiciones</strong>, <strong>Trámites Académicos</strong>, <strong>Modalidades de Etapa Productiva</strong> y el <strong>Debido Proceso</strong> ante el Comité de Evaluación y Seguimiento, comprometiéndose a una convivencia ética y fraterna en la comunidad SENA.
            </p>
          </div>

          {/* Date & Location */}
          <div className="mt-6 text-xs text-slate-600">
            <span>Expedido para constancia el </span>
            <strong className="text-slate-900">{certDate}</strong>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            {/* Signature 1 */}
            <div className="space-y-1 text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-base text-slate-600 tracking-wider">
                  Dra. Claudia M. Morales R.
                </span>
              </div>
              <div className="w-40 h-px bg-slate-400 mx-auto" />
              <p className="text-[11px] font-bold text-slate-900 uppercase">Subdirección de Centro</p>
              <p className="text-[10px] text-slate-500">SENA - {profile.regional}</p>
            </div>

            {/* Institutional Seal & QR Code */}
            <div className="flex flex-col items-center justify-center order-first sm:order-none space-y-1.5">
              <div
                onClick={onOpenVerifier}
                className="cursor-pointer group p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#39A900] transition flex flex-col items-center"
                title="Haz clic para verificar autenticidad"
              >
                {/* Visual QR representation */}
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shadow-2xs">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                    <rect x="10" y="10" width="30" height="30" fill="currentColor" />
                    <rect x="16" y="16" width="18" height="18" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill="currentColor" />
                    
                    <rect x="60" y="10" width="30" height="30" fill="currentColor" />
                    <rect x="66" y="16" width="18" height="18" fill="white" />
                    <rect x="70" y="20" width="10" height="10" fill="currentColor" />
                    
                    <rect x="10" y="60" width="30" height="30" fill="currentColor" />
                    <rect x="16" y="66" width="18" height="18" fill="white" />
                    <rect x="20" y="70" width="10" height="10" fill="currentColor" />

                    <rect x="45" y="15" width="8" height="8" fill="currentColor" />
                    <rect x="45" y="35" width="8" height="15" fill="currentColor" />
                    <rect x="65" y="55" width="20" height="8" fill="currentColor" />
                    <rect x="55" y="75" width="12" height="15" fill="currentColor" />
                    <rect x="75" y="75" width="15" height="15" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">
                  Verificar QR
                </span>
              </div>
              <div className="text-[10px] font-mono font-bold text-slate-500">
                {progress.certificateCode || 'SENA-IND-2024-DEMO-VAL'}
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1 text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-base text-slate-600 tracking-wider">
                  Ing. Carlos H. Giraldo S.
                </span>
              </div>
              <div className="w-40 h-px bg-slate-400 mx-auto" />
              <p className="text-[11px] font-bold text-slate-900 uppercase">Coordinación Académica</p>
              <p className="text-[10px] text-slate-500">Gestión de la Formación Profesional</p>
            </div>
          </div>

          {/* Certificate Footer info */}
          <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-slate-400">
            <span>SISTEMA DE GESTIÓN VIRTUAL DEL APRENDIZ • SOFIA PLUS / ZAJUNA</span>
            <span>REGISTRO OFICIAL ACUERDO 009 DE 2024 & ACUERDO 002 DE 2026 • VALIDEZ NACIONAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
