import React, { useState, useEffect, useMemo } from 'react';
import { 
  ApprenticeRecord, 
  InstructorProfile, 
  ApprenticeProfile, 
  InductionProgress 
} from '../types/sena';
import { SpreadsheetInfo, fetchApprenticeRecords } from '../services/googleSheetsService';
import { User } from 'firebase/auth';
import { 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Share2, 
  Link as LinkIcon, 
  Award, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  GraduationCap, 
  Sparkles, 
  AlertCircle,
  Eye,
  School,
  HelpCircle,
  MessageCircle,
  FileCheck,
  LogOut
} from 'lucide-react';

import { 
  getOfficialRegistry, 
  saveOfficialRegistry, 
  upsertApprenticeInOfficialRegistry,
  syncAllOfficialRecordsToSheet 
} from '../services/inductionRegistryService';

interface InstructorDashboardProps {
  instructor: InstructorProfile;
  onUpdateInstructor: (instructor: InstructorProfile) => void;
  currentApprenticeProfile?: ApprenticeProfile;
  currentApprenticeProgress?: InductionProgress;
  googleUser: User | null;
  googleToken: string | null;
  sheetInfo: SpreadsheetInfo | null;
  syncStatus: 'idle' | 'saving' | 'saved' | 'error' | 'disconnected';
  lastSyncTime: Date | null;
  onConnectGoogle: () => void;
  onManualSync: () => void;
  onSwitchToLearnerView: () => void;
  onOpenSheetsModal: () => void;
  onExitToLanding?: () => void;
}

// Sample fallback records for demonstration if sheet has no records yet
const DEMO_RECORDS: ApprenticeRecord[] = [
  {
    timestamp: '21/10/2026 09:15:32',
    documentType: 'CC',
    documentNumber: '1024589312',
    fullName: 'Andrés Felipe Gómez Sánchez',
    ficheNumber: '2874910',
    trainingProgram: 'ADSO - Análisis y Desarrollo de Software',
    regional: 'Distrito Capital',
    trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
    completedModules: '5 de 5 módulos',
    finalExamScore: '92%',
    certificationStatus: 'Aprobado y Certificado',
    certificateCode: 'SENA-IND-2026-A4B7C9',
    certificateDate: '21 de octubre de 2026',
    xp: '480',
    level: 'Nivel 4: Maestro del Reglamento'
  },
  {
    timestamp: '21/10/2026 08:40:11',
    documentType: 'TI',
    documentNumber: '1098456123',
    fullName: 'Valentina Rodríguez Peña',
    ficheNumber: '2874910',
    trainingProgram: 'ADSO - Análisis y Desarrollo de Software',
    regional: 'Distrito Capital',
    trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
    completedModules: '4 de 5 módulos',
    finalExamScore: 'No presentado',
    certificationStatus: 'En Curso',
    certificateCode: 'Pendiente',
    certificateDate: 'No emitido',
    xp: '290',
    level: 'Nivel 3: Líder de Ficha'
  },
  {
    timestamp: '20/10/2026 16:22:04',
    documentType: 'CC',
    documentNumber: '1032489567',
    fullName: 'Carlos Eduardo Ramírez Mora',
    ficheNumber: '2874910',
    trainingProgram: 'ADSO - Análisis y Desarrollo de Software',
    regional: 'Distrito Capital',
    trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
    completedModules: '5 de 5 módulos',
    finalExamScore: '86%',
    certificationStatus: 'Aprobado y Certificado',
    certificateCode: 'SENA-IND-2026-X8K2M1',
    certificateDate: '20 de octubre de 2026',
    xp: '440',
    level: 'Nivel 4: Maestro del Reglamento'
  },
  {
    timestamp: '20/10/2026 14:10:55',
    documentType: 'CC',
    documentNumber: '1018945623',
    fullName: 'Laura Daniela Ortiz Castro',
    ficheNumber: '2893120',
    trainingProgram: 'Tecnólogo en Animación 3D',
    regional: 'Distrito Capital',
    trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
    completedModules: '2 de 5 módulos',
    finalExamScore: 'No presentado',
    certificationStatus: 'En Curso',
    certificateCode: 'Pendiente',
    certificateDate: 'No emitido',
    xp: '140',
    level: 'Nivel 2: Aprendiz Comprometido'
  }
];

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  instructor,
  onUpdateInstructor,
  currentApprenticeProfile,
  currentApprenticeProgress,
  googleUser,
  googleToken,
  sheetInfo,
  syncStatus,
  lastSyncTime,
  onConnectGoogle,
  onManualSync,
  onSwitchToLearnerView,
  onOpenSheetsModal,
  onExitToLanding
}) => {
  const [records, setRecords] = useState<ApprenticeRecord[]>(() => {
    if (currentApprenticeProfile && currentApprenticeProgress) {
      const { records: updated } = upsertApprenticeInOfficialRegistry(currentApprenticeProfile, currentApprenticeProgress);
      return updated;
    }
    return getOfficialRegistry();
  });
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false);
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [recordsSource, setRecordsSource] = useState<'sheet' | 'registry'>('registry');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFicheFilter, setSelectedFicheFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Keep records reactive to live apprentice changes
  useEffect(() => {
    if (currentApprenticeProfile && currentApprenticeProgress) {
      const { records: updated } = upsertApprenticeInOfficialRegistry(currentApprenticeProfile, currentApprenticeProgress);
      setRecords(updated);
    } else {
      setRecords(getOfficialRegistry());
    }
  }, [
    currentApprenticeProfile?.documentNumber,
    currentApprenticeProfile?.fullName,
    currentApprenticeProfile?.ficheNumber,
    currentApprenticeProfile?.trainingProgram,
    currentApprenticeProfile?.regional,
    currentApprenticeProfile?.trainingCenter,
    currentApprenticeProgress?.completedModules.length,
    currentApprenticeProgress?.finalExamPassed,
    currentApprenticeProgress?.finalExamScore,
    currentApprenticeProgress?.certificateCode,
    currentApprenticeProgress?.xp
  ]);

  // Share link customization state
  const [shareFiche, setShareFiche] = useState<string>(instructor.fiches[0] || '2874910');
  const [shareProgram, setShareProgram] = useState<string>(instructor.assignedProgram || 'ADSO');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [selectedApprenticeModal, setSelectedApprenticeModal] = useState<ApprenticeRecord | null>(null);

  // Compute shareable URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareableLearnerUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('role', 'aprendiz');
    if (shareFiche.trim()) params.set('ficha', shareFiche.trim());
    if (shareProgram.trim()) params.set('programa', shareProgram.trim());
    return `${baseUrl}?${params.toString()}`;
  }, [baseUrl, shareFiche, shareProgram]);

  // Load and merge records from Google Sheet if connected
  const refreshRecordsFromSheet = async () => {
    if (!googleToken || !sheetInfo?.id) return;
    setIsLoadingRecords(true);
    try {
      const sheetRecords = await fetchApprenticeRecords(googleToken, sheetInfo.id);
      if (sheetRecords && sheetRecords.length > 0) {
        // Merge with local registry, preserving active apprentice live updates
        const local = getOfficialRegistry();
        const mergedMap = new Map<string, ApprenticeRecord>();
        
        sheetRecords.forEach(r => {
          if (r.documentNumber) mergedMap.set(r.documentNumber.trim(), r);
        });

        local.forEach(r => {
          if (r.documentNumber) mergedMap.set(r.documentNumber.trim(), r);
        });

        const mergedList = Array.from(mergedMap.values());
        saveOfficialRegistry(mergedList);
        setRecords(mergedList);
        setRecordsSource('sheet');
      } else {
        setRecords(getOfficialRegistry());
        setRecordsSource('registry');
      }
    } catch (err) {
      console.error('Error al cargar aprendices de Google Sheets:', err);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  // Push all official records to Google Sheets
  const handleSyncAllToGoogleSheets = async () => {
    if (!googleToken || !sheetInfo?.id) {
      onConnectGoogle();
      return;
    }
    setIsSyncingAll(true);
    setSyncFeedback(null);
    try {
      const result = await syncAllOfficialRecordsToSheet(googleToken, sheetInfo.id, records);
      setSyncFeedback(`Sincronizados ${result.success} aprendices en Google Sheets`);
      setRecordsSource('sheet');
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch (err: any) {
      console.error('Error al sincronizar registros:', err);
      setSyncFeedback('Error al sincronizar con Google Sheets');
      setTimeout(() => setSyncFeedback(null), 4000);
    } finally {
      setIsSyncingAll(false);
    }
  };

  useEffect(() => {
    if (googleToken && sheetInfo?.id) {
      refreshRecordsFromSheet();
    }
  }, [googleToken, sheetInfo?.id]);

  // Metrics computation
  const metrics = useMemo(() => {
    const total = records.length;
    if (total === 0) {
      return { total: 0, completedCount: 0, certifiedCount: 0, completionRate: 0, avgExamScore: 0 };
    }

    const certifiedCount = records.filter(
      r => r.certificationStatus.toLowerCase().includes('aprobado') || 
           r.certificationStatus.toLowerCase().includes('certificado')
    ).length;

    const completedCount = records.filter(
      r => r.completedModules.includes('5 de 5') || r.completedModules.includes('5/5')
    ).length;

    const scores = records
      .map(r => {
        const match = r.finalExamScore.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((s): s is number => s !== null);

    const avgExamScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    const completionRate = Math.round((certifiedCount / total) * 100);

    return {
      total,
      completedCount,
      certifiedCount,
      completionRate,
      avgExamScore
    };
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        !searchTerm ||
        rec.fullName.toLowerCase().includes(searchLower) ||
        rec.documentNumber.includes(searchLower) ||
        rec.ficheNumber.includes(searchLower) ||
        rec.trainingProgram.toLowerCase().includes(searchLower);

      // Fiche filter
      const matchesFiche = selectedFicheFilter === 'all' || rec.ficheNumber === selectedFicheFilter;

      // Status filter
      const matchesStatus = 
        selectedStatusFilter === 'all' ||
        (selectedStatusFilter === 'certified' && (rec.certificationStatus.includes('Aprobado') || rec.certificationStatus.includes('Certificado'))) ||
        (selectedStatusFilter === 'in_progress' && rec.certificationStatus.includes('En Curso'));

      return matchesSearch && matchesFiche && matchesStatus;
    });
  }, [records, searchTerm, selectedFicheFilter, selectedStatusFilter]);

  // Unique fiches from records
  const availableFiches = useMemo(() => {
    const fiches = new Set<string>(instructor.fiches);
    records.forEach(r => {
      if (r.ficheNumber) fiches.add(r.ficheNumber);
    });
    return Array.from(fiches);
  }, [instructor.fiches, records]);

  // Copy link handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLearnerUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (records.length === 0) return;
    const headers = [
      'Marca Temporal', 'Tipo Doc', 'Documento', 'Nombre', 'Ficha',
      'Programa', 'Regional', 'Centro', 'Módulos', 'Examen', 'Estado',
      'Código Certificado', 'Fecha Certificado', 'XP', 'Nivel'
    ];
    const rows = records.map(r => [
      `"${r.timestamp}"`,
      `"${r.documentType}"`,
      `"${r.documentNumber}"`,
      `"${r.fullName}"`,
      `"${r.ficheNumber}"`,
      `"${r.trainingProgram}"`,
      `"${r.regional}"`,
      `"${r.trainingCenter}"`,
      `"${r.completedModules}"`,
      `"${r.finalExamScore}"`,
      `"${r.certificationStatus}"`,
      `"${r.certificateCode}"`,
      `"${r.certificateDate}"`,
      `"${r.xp}"`,
      `"${r.level}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SENA_Induccion_Aprendices_Ficha_${shareFiche}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Instructor Identity & Role Notice */}
      <div className="bg-gradient-to-br from-slate-900 via-[#005c24] to-[#007832] dark:from-slate-950 dark:via-[#003816] dark:to-[#0f3d17] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Perfil de Instructor • Privilegios Administrativos
              </span>
              <span className="text-emerald-200/80 text-xs font-mono font-medium">
                {instructor.email}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Panel de Control y Monitoreo del Instructor
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Administra la sincronización automática con Google Drive, genera los enlaces limpios de inducción para tus aprendices y haz seguimiento en tiempo real de los avances, evaluaciones y certificaciones.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-200 font-medium">
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                <School className="w-3.5 h-3.5" />
                {instructor.trainingCenter}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                <Users className="w-3.5 h-3.5" />
                Fichas: {instructor.fiches.join(', ')}
              </span>
            </div>
          </div>

          {/* Quick Action Switcher */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={onSwitchToLearnerView}
              className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-emerald-50 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Eye className="w-4 h-4 text-[#39A900]" />
              <span>Vista Previa del Aprendiz</span>
            </button>

            <button
              onClick={onOpenSheetsModal}
              className="px-5 py-3 rounded-2xl bg-black/30 hover:bg-black/50 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Configuración Avanzada Hoja</span>
            </button>

            {onExitToLanding && (
              <button
                onClick={onExitToLanding}
                className="px-5 py-2.5 rounded-2xl bg-black/20 hover:bg-black/40 text-emerald-200 hover:text-white font-semibold text-xs border border-white/10 transition flex items-center justify-center gap-2 cursor-pointer"
                title="Volver a la pantalla de selección de rol"
              >
                <LogOut className="w-3.5 h-3.5 text-emerald-300" />
                <span>Salir / Cambiar de Rol</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Section: Google Drive Status & Share Link Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: Google Sheets & Drive Connection Privileges */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Sincronización con Google Drive
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Control exclusivo del Instructor para almacenar registros
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                googleUser 
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${googleUser ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {googleUser ? 'Drive Vinculado' : 'Sin Conectar'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Los aprendices que ingresen a la plataforma registrarán automáticamente su avance en tu hoja de cálculo sin que ellos vean botones de conexión ni requieran credenciales.
            </p>

            {sheetInfo?.url ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Hoja de Registro Oficial:</span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Activa y recibiendo datos</span>
                </div>
                
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {sheetInfo.name}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={sheetInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#007832] hover:bg-[#39A900] text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                  >
                    <span>Abrir Hoja en Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={refreshRecordsFromSheet}
                    disabled={isLoadingRecords}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    title="Recargar datos de la hoja"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingRecords ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-200 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Conecta tu cuenta de Google Drive
                </p>
                <p className="text-[11px] leading-relaxed">
                  Para que las respuestas y certificaciones de los aprendices se guarden automáticamente en tu Drive, pulsa el botón de abajo.
                </p>
                <button
                  onClick={onConnectGoogle}
                  className="mt-1 w-full py-2.5 px-4 rounded-xl bg-[#007832] hover:bg-[#39A900] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Conectar Cuenta de Google (Drive & Sheets)</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Última sincronización: {lastSyncTime ? lastSyncTime.toLocaleTimeString('es-CO') : 'Al completar hitos'}</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Autoguardado transparente</span>
          </div>
        </div>

        {/* CARD 2: Shareable Apprentice Link Generator */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Compartir Enlace con los Aprendices
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Genera el enlace directo para que realicen la inducción
                </p>
              </div>
            </div>

            {/* Customization options */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Ficha a Inducir:
                </label>
                <input
                  type="text"
                  value={shareFiche}
                  onChange={e => setShareFiche(e.target.value)}
                  placeholder="ej. 2874910"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Programa de Formación:
                </label>
                <input
                  type="text"
                  value={shareProgram}
                  onChange={e => setShareProgram(e.target.value)}
                  placeholder="ej. ADSO"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                />
              </div>
            </div>

            {/* Generated URL Box */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                Enlace Generado para Aprendices (Sin accesos de Instructor):
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 truncate select-all">
                  {shareableLearnerUrl}
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0 ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#39A900] hover:bg-[#007832] text-white'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Estimados aprendices SENA de la Ficha ${shareFiche}: Los invito a realizar la Inducción Integral y Certificación en la plataforma oficial: ${shareableLearnerUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-[#007832] dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Compartir por WhatsApp</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(`Inducción Integral SENA - Ficha ${shareFiche}`)}&body=${encodeURIComponent(`Estimados aprendices:\n\nPor favor completen los módulos de inducción y su certificación ingresando a:\n${shareableLearnerUrl}\n\nCordialmente,\n${instructor.fullName}`)}`}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Enviar por Correo</span>
              </a>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            * Al abrir este enlace, el aprendiz entra en modo estudiante y no tendrá acceso a tus hojas ni a las opciones del instructor.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Aprendices</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {metrics.total}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Registrados en la plataforma</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Certificados Emitidos</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {metrics.certifiedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Evaluación final aprobada</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tasa de Finalización</span>
            <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {metrics.completionRate}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{metrics.certifiedCount} de {metrics.total} aprendices</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Promedio Evaluación</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {metrics.avgExamScore}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Reglamento Acuerdo 009</p>
        </div>
      </div>

      {/* Main Apprentice Monitoring Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Seguimiento de Aprendices en Tiempo Real
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  recordsSource === 'sheet'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-[#007832] dark:text-emerald-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#007832] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}>
                  {recordsSource === 'sheet' ? 'Sincronizado con Google Sheets' : 'Registro Oficial Centralizado (En Vivo)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Consulta los avances individuales, notas de evaluación y códigos de certificado generados.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {syncFeedback && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-[#007832] dark:text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>{syncFeedback}</span>
                </div>
              )}

              <button
                onClick={handleExportCsv}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Descargar reporte en archivo CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>

              {sheetInfo?.url ? (
                <button
                  onClick={handleSyncAllToGoogleSheets}
                  disabled={isSyncingAll}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-xs"
                  title="Sincronizar todos los registros a la hoja oficial de Google Sheets"
                >
                  <FileSpreadsheet className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-bounce' : ''}`} />
                  <span>{isSyncingAll ? 'Guardando...' : 'Guardar Todo en Sheets'}</span>
                </button>
              ) : (
                <button
                  onClick={onConnectGoogle}
                  className="px-3 py-2 rounded-xl bg-[#007832] hover:bg-[#39A900] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Conectar Google Drive para sincronizar automáticamente"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Conectar a Sheets</span>
                </button>
              )}

              {sheetInfo?.url && (
                <button
                  onClick={refreshRecordsFromSheet}
                  disabled={isLoadingRecords}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  title="Recargar datos desde la hoja de Google Sheets"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecords ? 'animate-spin' : ''}`} />
                  <span>Recargar</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, cédula o ficha..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
              />
            </div>

            {/* Fiche Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedFicheFilter}
                onChange={e => setSelectedFicheFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
              >
                <option value="all">Todas las fichas ({availableFiches.length})</option>
                {availableFiches.map(f => (
                  <option key={f} value={f}>Ficha #{f}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="certified">Solo Certificados</option>
                <option value="in_progress">Solo En Curso</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Aprendiz</th>
                <th className="py-3 px-4">Ficha & Programa</th>
                <th className="py-3 px-4">Módulos</th>
                <th className="py-3 px-4">Evaluación</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Certificado</th>
                <th className="py-3 px-4">XP / Nivel</th>
                <th className="py-3 px-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec, idx) => {
                  const isCertified = 
                    rec.certificationStatus.toLowerCase().includes('aprobado') ||
                    rec.certificationStatus.toLowerCase().includes('certificado');
                  const isActiveApprentice = 
                    currentApprenticeProfile && 
                    rec.documentNumber.trim() === currentApprenticeProfile.documentNumber.trim();

                  return (
                    <tr 
                      key={`${rec.documentNumber}-${idx}`}
                      className={`transition-colors ${
                        isActiveApprentice
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
                          : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Name & Doc */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {rec.fullName}
                          </span>
                          {isActiveApprentice && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#007832] text-white font-extrabold uppercase tracking-wide shrink-0">
                              Aprendiz Actual
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {rec.documentType} {rec.documentNumber}
                        </div>
                      </td>

                      {/* Fiche & Program */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          #{rec.ficheNumber}
                        </span>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {rec.trainingProgram}
                        </div>
                      </td>

                      {/* Modules */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {rec.completedModules}
                        </span>
                      </td>

                      {/* Exam Score */}
                      <td className="py-3 px-4 font-mono font-bold">
                        {rec.finalExamScore !== 'No presentado' ? (
                          <span className="text-[#007832] dark:text-emerald-400">
                            {rec.finalExamScore}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-normal">
                            Pendiente
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isCertified
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-[#007832] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {isCertified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isCertified ? 'Certificado' : 'En Curso'}
                        </span>
                      </td>

                      {/* Certificate Code */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {rec.certificateCode && rec.certificateCode !== 'Pendiente' ? (
                          <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {rec.certificateCode}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Sin emitir</span>
                        )}
                      </td>

                      {/* XP & Level */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                          {rec.xp} XP
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {rec.level}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedApprenticeModal(rec)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No se encontraron aprendices con los filtros seleccionados.</p>
                    <p className="text-xs mt-1">Comparte el enlace de inducción para registrar a tus primeros aprendices.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <span>Mostrando {filteredRecords.length} de {records.length} aprendices registrados</span>
          <span>Actualización sincrónica según hitos formativos</span>
        </div>
      </div>

      {/* Apprentice Details Modal */}
      {selectedApprenticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#39A900] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Ficha #{selectedApprenticeModal.ficheNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedApprenticeModal.fullName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedApprenticeModal.documentType} {selectedApprenticeModal.documentNumber}
                </p>
              </div>

              <button
                onClick={() => setSelectedApprenticeModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Programa:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedApprenticeModal.trainingProgram}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Centro:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedApprenticeModal.trainingCenter}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Módulos Completados:</span>
                <span className="text-[#007832] dark:text-emerald-400 font-bold">{selectedApprenticeModal.completedModules}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Evaluación Final:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedApprenticeModal.finalExamScore}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Estado:</span>
                <span className="font-bold text-[#007832] dark:text-emerald-400">{selectedApprenticeModal.certificationStatus}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Código de Certificado:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedApprenticeModal.certificateCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Fecha de Certificación:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedApprenticeModal.certificateDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Experiencia y Rango:</span>
                <span className="text-amber-600 font-bold">{selectedApprenticeModal.xp} XP • {selectedApprenticeModal.level}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedApprenticeModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
