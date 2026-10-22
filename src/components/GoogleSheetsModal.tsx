import React, { useState, useEffect } from 'react';
import { ApprenticeProfile, InductionProgress } from '../types/sena';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken 
} from '../services/firebaseAuth';
import { 
  findOrCreateInductionSheet, 
  saveApprenticeToSheet, 
  readApprenticeRecords,
  SpreadsheetInfo,
  SHEET_HEADERS,
  INDUCTION_SPREADSHEET_TITLE
} from '../services/googleSheetsService';
import { User } from 'firebase/auth';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  HardDrive, 
  LogOut, 
  UserCheck, 
  Send,
  Database,
  ArrowRight,
  ShieldCheck,
  Table,
  Copy,
  Check
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  progress: InductionProgress;
  user: User | null;
  onUserChange: (user: User | null, token: string | null) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  profile,
  progress,
  user,
  onUserChange
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sheetInfo, setSheetInfo] = useState<SpreadsheetInfo | null>(null);
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showConfirmSync, setShowConfirmSync] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedUrl, setSavedUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('sena_induction_sheet_url') || '';
    } catch {
      return '';
    }
  });

  // When modal opens and user is logged in, try to discover or load the sheet
  useEffect(() => {
    if (isOpen && user) {
      loadSheetData();
    }
  }, [isOpen, user]);

  const loadSheetData = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      setLoading(true);
      setStatusMessage({ text: 'Buscando hoja de cálculo en Google Drive...', type: 'info' });

      const info = await findOrCreateInductionSheet(token);
      setSheetInfo(info);
      setSavedUrl(info.url);
      try {
        localStorage.setItem('sena_induction_sheet_url', info.url);
        localStorage.setItem('sena_induction_sheet_name', info.name);
      } catch (e) {
        console.warn('Storage unavailable', e);
      }

      const rows = await readApprenticeRecords(token, info.id);
      setSheetRows(rows);

      setStatusMessage({
        text: 'Hoja de cálculo vinculada correctamente con Google Drive.',
        type: 'success'
      });
    } catch (err: any) {
      console.error('Error al cargar hoja:', err);
      setStatusMessage({
        text: `No se pudo sincronizar con Google Drive: ${err.message || 'Error desconocido'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);
      const res = await googleSignIn();
      if (res) {
        onUserChange(res.user, res.accessToken);
        // Automatically load or create sheet
        const info = await findOrCreateInductionSheet(res.accessToken);
        setSheetInfo(info);
        setSavedUrl(info.url);
        try {
          localStorage.setItem('sena_induction_sheet_url', info.url);
          localStorage.setItem('sena_induction_sheet_name', info.name);
        } catch (e) {
          console.warn('Storage unavailable', e);
        }
        const rows = await readApprenticeRecords(res.accessToken, info.id);
        setSheetRows(rows);
        setStatusMessage({
          text: `Sesión iniciada como ${res.user.displayName || res.user.email}. Hoja lista.`,
          type: 'success'
        });
      }
    } catch (err: any) {
      console.error('Error al conectar Google:', err);
      setStatusMessage({
        text: `No fue posible conectar con Google: ${err.message || 'Proceso cancelado'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGoogle();
      onUserChange(null, null);
      setSheetInfo(null);
      setSheetRows([]);
      setStatusMessage({ text: 'Sesión de Google cerrada correctamente.', type: 'info' });
    } catch (err: any) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Triggered when user confirms the sync operation
  const executeSync = async () => {
    try {
      setIsSyncing(true);
      setShowConfirmSync(false);

      const token = await getAccessToken();
      if (!token || !sheetInfo) {
        throw new Error('Debes iniciar sesión con Google para sincronizar');
      }

      setStatusMessage({ text: 'Escribiendo registro en Google Sheets...', type: 'info' });

      const result = await saveApprenticeToSheet(token, sheetInfo.id, profile, progress);

      // Refresh records list
      const updatedRows = await readApprenticeRecords(token, sheetInfo.id);
      setSheetRows(updatedRows);

      setStatusMessage({
        text: result.action === 'updated'
          ? `¡Datos actualizados exitosamente en la fila ${result.rowNumber} de Google Sheets!`
          : `¡Aprendiz registrado con éxito en la fila ${result.rowNumber} de Google Sheets!`,
        type: 'success'
      });
    } catch (err: any) {
      console.error('Error al sincronizar aprendiz:', err);
      setStatusMessage({
        text: `Fallo al guardar en la hoja: ${err.message || 'Error de permisos o conexión'}`,
        type: 'error'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007832] text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Almacenamiento en Google Drive & Sheets
                </h2>
                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <HardDrive className="w-3 h-3" /> Drive
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centraliza y exporta los registros de inducción en tu hoja de cálculo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2.5 border transition ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />}
                {statusMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-xs opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}

          {/* Section 1: Authentication */}
          {!user ? (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Conecta tu cuenta de Google
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Para crear la hoja de cálculo o registrar datos en tu Google Drive, inicia sesión con Google. El sistema solo solicitará acceso a los archivos que crea esta aplicación.
                </p>
              </div>

              {/* Official Google Sign-in Button */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md transition text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{loading ? 'Conectando...' : 'Acceder con Google'}</span>
                </button>
              </div>

              {/* Direct links to Drive & Sheets */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`https://drive.google.com/drive/search?q=title:%22${encodeURIComponent(INDUCTION_SPREADSHEET_TITLE)}%22`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#007832] dark:text-emerald-400 hover:underline font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buscar hoja en Google Drive</span>
                </a>
                <span>•</span>
                <a
                  href="https://docs.google.com/spreadsheets/u/0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:underline font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Abrir Google Sheets</span>
                </a>
              </div>

              {savedUrl && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 text-left space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#007832] dark:text-emerald-400 block">
                    Hoja vinculada recientemente en este navegador:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={savedUrl}
                      className="text-xs bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-mono text-slate-700 dark:text-slate-300 flex-1 truncate"
                    />
                    <a
                      href={savedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-[#007832] hover:bg-[#39A900] text-white text-xs font-semibold inline-flex items-center gap-1 transition shrink-0"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Google User'} className="w-10 h-10 rounded-full border border-emerald-400" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    {user.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {user.displayName || 'Cuenta de Google'}
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-[#007832] dark:text-emerald-400 text-[10px] px-2 py-0.2 rounded-full font-semibold">
                      Conectado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={loadSheetData}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5 transition"
                  title="Recargar datos de la hoja"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Recargar</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Active Spreadsheet Info */}
          {user && sheetInfo && (
            <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#007832] dark:text-emerald-400 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" />
                    Hoja de Cálculo en tu Google Drive
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {sheetInfo.name}
                  </h4>
                </div>

                <a
                  href={sheetInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-[#007832] dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-xs font-bold shadow-2xs transition self-start sm:self-auto"
                >
                  <span>Abrir en Google Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Exact Clickable & Copyable URL Box */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Enlace directo al documento:
                  </span>
                  <a
                    href={sheetInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#007832] dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Ver documento</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={sheetInfo.url}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 select-all truncate"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(sheetInfo.url);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs"
                    title="Copiar URL al portapapeles"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Apprentice Current Status Preview to Save */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Datos del Aprendiz a Almacenar:
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Ficha #{profile.ficheNumber}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Aprendiz:</span>{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{profile.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Identificación:</span>{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{profile.documentType} {profile.documentNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Programa:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300 truncate inline-block max-w-[200px] align-bottom">{profile.trainingProgram}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Estado de Inducción:</span>{' '}
                    <span className={`font-bold ${progress.finalExamPassed ? 'text-[#007832] dark:text-emerald-400' : 'text-amber-600'}`}>
                      {progress.finalExamPassed ? 'Aprobado y Certificado' : 'En Curso (Etapa Formativa)'}
                    </span>
                  </div>
                </div>

                {/* Save to Sheets Trigger Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowConfirmSync(true)}
                    disabled={isSyncing}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSyncing ? 'Guardando en Drive...' : 'Guardar / Actualizar en Google Sheets'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Records Table Preview */}
          {user && sheetRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-slate-500" />
                  Registros en la Hoja ({Math.max(0, sheetRows.length - 1)} aprendices)
                </span>
                <span className="text-[11px] text-slate-400">
                  Pestaña: "{sheetRows[0] ? 'Aprendices' : ''}"
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden overflow-x-auto max-h-56">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="bg-[#007832] text-white font-semibold sticky top-0">
                    <tr>
                      <th className="p-2 border-b border-emerald-800 whitespace-nowrap">#</th>
                      <th className="p-2 border-b border-emerald-800 whitespace-nowrap">Documento</th>
                      <th className="p-2 border-b border-emerald-800 whitespace-nowrap">Nombre</th>
                      <th className="p-2 border-b border-emerald-800 whitespace-nowrap">Ficha</th>
                      <th className="p-2 border-b border-emerald-800 whitespace-nowrap">Módulos</th>
                      <th className="p-2 border-b border-emerald-800 whitespace-nowrap">Estado</th>
                      <th className="p-2 border-b border-emerald-800 whitespace-nowrap">Certificado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {sheetRows.slice(1).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                        <td className="p-2 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-2 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {row[1]} {row[2]}
                        </td>
                        <td className="p-2 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {row[3]}
                        </td>
                        <td className="p-2 font-mono text-slate-600 dark:text-slate-400">{row[4]}</td>
                        <td className="p-2 text-slate-600 dark:text-slate-400">{row[8]}</td>
                        <td className="p-2 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row[10]?.includes('Aprobado')
                                ? 'bg-emerald-100 text-[#007832] dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {row[10] || 'En Curso'}
                          </span>
                        </td>
                        <td className="p-2 font-mono text-[10px] text-slate-500">{row[11]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Guidelines Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
              Estructura Segura de Almacenamiento
            </p>
            <p>
              Los datos se guardan directamente en el archivo <strong>"SENA - Registro Oficial de Inducción de Aprendices"</strong> creado en la raíz de tu Google Drive. Cada registro incluye marca de tiempo, cédula/TI, ficha, programa, módulos completados y código de verificación criptográfico del certificado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center text-xs">
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
            API de Google Drive v3 y Google Sheets v4
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold transition"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Mandatory User Confirmation Modal before writing/updating data to Google Sheets */}
      {showConfirmSync && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  ¿Confirmar guardado en Google Sheets?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Esta acción registrará o actualizará los datos del aprendiz en tu Google Drive.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
              <p>
                <strong>Aprendiz:</strong> {profile.fullName}
              </p>
              <p>
                <strong>Documento:</strong> {profile.documentType} {profile.documentNumber}
              </p>
              <p>
                <strong>Ficha:</strong> {profile.ficheNumber}
              </p>
              <p>
                <strong>Destino:</strong> Hoja "{INDUCTION_SPREADSHEET_TITLE}" en Google Drive.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSync(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeSync}
                className="px-4 py-2 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar y Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
