import React from 'react';
import { 
  ApprenticeProfile, 
  InductionProgress, 
  Badge, 
  UserRole, 
  InstructorProfile 
} from '../types/sena';
import { SenaLogo } from './SenaLogo';
import { 
  Award, 
  BookOpen, 
  HelpCircle, 
  UserCheck, 
  Flame, 
  FileCheck2,
  Scale,
  Moon,
  Sun,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  Cloud,
  ShieldCheck,
  LayoutDashboard,
  ArrowRightLeft,
  GraduationCap,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onExitToLanding: () => void;
  instructor: InstructorProfile;
  profile: ApprenticeProfile;
  progress: InductionProgress;
  badges: Badge[];
  activeTab: 'instructor' | 'modules' | 'committee' | 'exam' | 'certificate';
  setActiveTab: (tab: 'instructor' | 'modules' | 'committee' | 'exam' | 'certificate') => void;
  onOpenProfile: () => void;
  onOpenBadges: () => void;
  onOpenGlossary: () => void;
  onOpenSheets: () => void;
  isGoogleConnected?: boolean;
  isDark: boolean;
  onToggleDark: () => void;
  syncStatus?: 'idle' | 'saving' | 'saved' | 'error' | 'disconnected';
  lastSyncTime?: Date | null;
  sheetUrl?: string | null;
  onConnectGoogle?: () => void;
  onManualSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSwitchRole,
  onExitToLanding,
  instructor,
  profile,
  progress,
  badges,
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenBadges,
  onOpenGlossary,
  onOpenSheets,
  isGoogleConnected = false,
  isDark,
  onToggleDark,
  syncStatus = 'disconnected',
  lastSyncTime = null,
  sheetUrl = null,
  onConnectGoogle,
  onManualSync
}) => {
  const [isSyncPopoverOpen, setIsSyncPopoverOpen] = React.useState(false);
  const [isRolePopoverOpen, setIsRolePopoverOpen] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const earnedCount = badges.filter(b => b.earned).length;

  const getLevelInfo = (xp: number) => {
    if (xp >= 350) return { title: 'Maestro del Reglamento', level: 4, nextXp: 500, color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' };
    if (xp >= 200) return { title: 'Líder de Ficha', level: 3, nextXp: 350, color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' };
    if (xp >= 80) return { title: 'Aprendiz Comprometido', level: 2, nextXp: 200, color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' };
    return { title: 'Aprendiz Novato', level: 1, nextXp: 80, color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' };
  };

  const levelInfo = getLevelInfo(progress.xp);
  const xpPercent = Math.min(100, Math.round((progress.xp / 450) * 100));

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300 no-print">
      {/* Top institutional strip */}
      <div className="bg-gradient-to-r from-[#005c24] via-[#39A900] to-[#007832] dark:from-[#003816] dark:via-[#216b00] dark:to-[#00471c] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide">
            COLOMBIA
          </span>
          <span className="truncate">
            Servicio Nacional de Aprendizaje • Inducción Integral • Acuerdo 009 de 2024 (Mod. Ac. 002 de 2026)
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-3">
            <span className="text-white/80">Regional: {profile.regional.replace('Regional ', '')}</span>
            <span className="h-3 w-px bg-white/30" />
            <span className="text-white/90 font-mono">Ficha #{profile.ficheNumber}</span>
          </div>

          {/* Role Indicator / Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRolePopoverOpen(prev => !prev)}
              className="flex items-center gap-1.5 bg-black/30 hover:bg-black/50 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/25 transition cursor-pointer"
              title="Cambiar entre perfil de Instructor y Aprendiz"
            >
              {currentRole === 'instructor' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-blue-200" />
              )}
              <span>{currentRole === 'instructor' ? 'Rol: Instructor' : 'Rol: Aprendiz'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isRolePopoverOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRolePopoverOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsRolePopoverOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 text-slate-800 dark:text-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Cambiar Perfil de Usuario
                  </div>

                  <button
                    onClick={() => {
                      onSwitchRole('instructor');
                      setActiveTab('instructor');
                      setIsRolePopoverOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between text-xs cursor-pointer ${
                      currentRole === 'instructor'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#007832] dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                      <div>
                        <div className="font-bold">Instructor</div>
                        <div className="text-[10px] text-slate-400">Control total, Google Drive y monitoreo</div>
                      </div>
                    </div>
                    {currentRole === 'instructor' && <Check className="w-4 h-4 text-[#39A900]" />}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRole('aprendiz');
                      if (activeTab === 'instructor') setActiveTab('modules');
                      setIsRolePopoverOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between text-xs cursor-pointer ${
                      currentRole === 'aprendiz'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#007832] dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="font-bold">Aprendiz</div>
                        <div className="text-[10px] text-slate-400">Inducción, retos y certificado</div>
                      </div>
                    </div>
                    {currentRole === 'aprendiz' && <Check className="w-4 h-4 text-[#39A900]" />}
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
                    <button
                      onClick={() => {
                        setIsRolePopoverOpen(false);
                        onExitToLanding();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-500" />
                      <span>Volver al Portal de Roles</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Dedicated Salir / Cambiar Rol Button on top bar */}
          <button
            onClick={onExitToLanding}
            className="flex items-center gap-1.5 bg-black/25 hover:bg-black/45 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-white/20 transition cursor-pointer"
            title="Salir al portal principal de roles"
          >
            <span className="hidden sm:inline">Inicio</span>
          </button>

          {/* Quick theme indicator on top bar */}
          <button
            onClick={onToggleDark}
            className="flex items-center gap-1.5 bg-black/25 hover:bg-black/40 text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/20 transition cursor-pointer"
            title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDark ? <Sun className="w-3 h-3 text-amber-300" /> : <Moon className="w-3 h-3 text-emerald-200" />}
            <span className="hidden sm:inline">{isDark ? 'Oscuro' : 'Claro'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation & stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & User quick view */}
        <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 shrink-0">
          <div 
            className="cursor-pointer shrink-0" 
            onClick={() => setActiveTab(currentRole === 'instructor' ? 'instructor' : 'modules')}
          >
            <SenaLogo />
          </div>

          {/* Profile Badge based on Current Role */}
          {currentRole === 'instructor' ? (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-left shrink-0 ml-2 sm:ml-4">
              <div className="w-8 h-8 rounded-full bg-[#007832] text-white flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <span>{instructor.fullName}</span>
                  <span className="text-[10px] bg-[#39A900] text-white px-1.5 py-0.2 rounded font-semibold">Instructor</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {instructor.email}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition text-left group shrink-0 ml-2 sm:ml-4 cursor-pointer"
              title="Editar mis datos de aprendiz"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#007832] dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition">
                {profile.fullName.substring(0, 2) || 'AP'}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  <span className="truncate max-w-[110px] sm:max-w-[160px] md:max-w-[180px]">{profile.fullName}</span>
                  <UserCheck className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[120px] sm:max-w-[140px]">
                  {profile.documentType} {profile.documentNumber}
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Gamification status bar & Controls */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 overflow-x-auto py-1">
          {/* XP & Level (visible in both modes, especially for learners) */}
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex items-center gap-1.5 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500 animate-pulse" />
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-mono">
                {progress.xp} <span className="text-[10px] text-slate-400 font-normal">XP</span>
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${levelInfo.color}`}>
                  Nvl {levelInfo.level}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
                  {levelInfo.title}
                </span>
              </div>
              <div className="w-16 sm:w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                <div
                  className="bg-[#39A900] h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Badges Counter */}
          <button
            onClick={onOpenBadges}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 text-xs font-bold transition shrink-0 cursor-pointer"
            title="Ver insignias obtenidas"
          >
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{earnedCount}/{badges.length}</span>
            <span className="hidden sm:inline font-normal text-amber-700 dark:text-amber-400">Insignias</span>
          </button>

          {/* Glossary */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition shrink-0 cursor-pointer"
            title="Glosario del Aprendiz"
          >
            <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Glosario</span>
          </button>

          {/* APPRENTICE: DISCREET AUTO-SAVE INDICATOR TO OFFICIAL REGISTRY */}
          {currentRole === 'aprendiz' && (
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-200/90 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-xs text-[#007832] dark:text-emerald-300 shrink-0 font-medium select-none shadow-2xs"
              title="Tu progreso se guarda automáticamente en el Registro Oficial de Inducción"
            >
              {syncStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
                  <span className="hidden sm:inline text-blue-700 dark:text-blue-300 font-semibold">Guardando en Registro...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#39A900] ring-2 ring-emerald-300 dark:ring-emerald-800 animate-pulse" />
                  <FileCheck2 className="w-3.5 h-3.5 text-[#007832] dark:text-emerald-400" />
                  <span className="hidden sm:inline">Registro Oficial al día</span>
                </>
              )}
            </div>
          )}

          {/* ONLY INSTRUCTOR SEES THE GOOGLE DRIVE & SHEETS CONTROL POPUP */}
          {currentRole === 'instructor' && (
            <div className="relative">
              <button
                onClick={() => setIsSyncPopoverOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 cursor-pointer ${
                  syncStatus === 'saving'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 animate-pulse'
                    : syncStatus === 'saved' || syncStatus === 'idle'
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-[#007832] dark:text-emerald-300 shadow-2xs'
                    : syncStatus === 'error'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                title="Panel de Sincronización con Google Drive (Exclusivo Instructor)"
              >
                {syncStatus === 'saving' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
                    <span className="hidden sm:inline text-blue-700 dark:text-blue-300 font-medium">Sincronizando...</span>
                  </>
                ) : syncStatus === 'saved' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="hidden sm:inline font-medium">Hoja Conectada</span>
                  </>
                ) : syncStatus === 'idle' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#39A900] ring-2 ring-emerald-300 dark:ring-emerald-800 animate-pulse" />
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#007832] dark:text-emerald-400" />
                    <span className="hidden md:inline">Google Drive</span>
                  </>
                ) : syncStatus === 'error' ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="hidden md:inline text-amber-700 dark:text-amber-300">Reintentar</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden md:inline">Conectar Drive</span>
                  </>
                )}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-60 ${isSyncPopoverOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Discreet Popover Menu */}
              {isSyncPopoverOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsSyncPopoverOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-80 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#007832] dark:text-emerald-400 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${syncStatus === 'disconnected' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                          {syncStatus === 'disconnected' ? 'Desconectado' : 'Google Drive Vinculado'}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {syncStatus === 'disconnected' 
                            ? 'Conecta tu Google Drive para que los aprendices guarden automáticamente su progreso.' 
                            : 'Todos los aprendices que completen módulos guardarán aquí su registro.'}
                        </p>
                      </div>
                    </div>

                    {syncStatus !== 'disconnected' ? (
                      <div className="space-y-2 text-xs">
                        {sheetUrl && (
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                            <span className="text-[10px] text-slate-400 font-semibold block">Hoja de cálculo en tu Drive:</span>
                            <div className="flex items-center gap-1.5">
                              <input 
                                type="text" 
                                readOnly 
                                value={sheetUrl} 
                                className="text-[11px] font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex-1 truncate text-slate-700 dark:text-slate-300 select-all"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(sheetUrl);
                                  setCopiedUrl(true);
                                  setTimeout(() => setCopiedUrl(false), 2000);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
                                title="Copiar URL"
                              >
                                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <a
                                href={sheetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                                title="Abrir hoja en Google Sheets"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        )}

                        {lastSyncTime && (
                          <p className="text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Última sincronización:</span>
                            <span className="font-mono text-slate-600 dark:text-slate-300">
                              {lastSyncTime.toLocaleTimeString('es-CO')}
                            </span>
                          </p>
                        )}

                        <div className="pt-1 flex items-center gap-2">
                          {sheetUrl && (
                            <a
                              href={sheetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-3 rounded-xl bg-[#007832] hover:bg-[#39A900] text-white font-semibold text-xs text-center inline-flex items-center justify-center gap-1.5 transition shadow-2xs"
                            >
                              <span>Abrir Sheets</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setIsSyncPopoverOpen(false);
                              onOpenSheets();
                            }}
                            className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
                          >
                            Configurar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-1 space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSyncPopoverOpen(false);
                            if (onConnectGoogle) {
                              onConnectGoogle();
                            } else {
                              onOpenSheets();
                            }
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-[#007832] hover:bg-[#39A900] text-white font-semibold text-xs inline-flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Conectar Google Drive</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDark}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 border border-emerald-200/90 dark:border-emerald-500/30 text-emerald-900 dark:text-amber-300 text-xs font-bold transition-all duration-200 shrink-0 shadow-2xs hover:scale-105 active:scale-95 group cursor-pointer"
            title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-slate-100 hidden lg:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700 dark:text-slate-200 group-hover:-rotate-12 transition-transform duration-300" />
                <span className="text-slate-800 hidden lg:inline">Modo Oscuro</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Role-Sensitive Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800/90 py-1.5 text-xs sm:text-sm font-semibold">
        {/* INSTRUCTOR EXCLUSIVE TAB: PANEL DE INSTRUCTOR */}
        {currentRole === 'instructor' && (
          <button
            onClick={() => setActiveTab('instructor')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'instructor'
                ? 'bg-slate-900 text-white shadow-xs font-bold dark:bg-emerald-700'
                : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Panel del Instructor</span>
            <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              Monitoreo
            </span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-[#39A900] text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{currentRole === 'instructor' ? 'Contenido de Inducción' : 'Módulos de Inducción'}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-1 ${
            activeTab === 'modules' ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}>
            {progress.completedModules.length}/6
          </span>
        </button>

        <button
          onClick={() => setActiveTab('committee')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 cursor-pointer ${
            activeTab === 'committee'
              ? 'bg-[#39A900] text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Simulador del Comité</span>
          <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
            Casos
          </span>
        </button>

        <button
          onClick={() => setActiveTab('exam')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 cursor-pointer ${
            activeTab === 'exam'
              ? 'bg-[#39A900] text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Evaluación Final</span>
          {progress.finalExamPassed && (
            <span className="bg-emerald-100 dark:bg-emerald-950 text-[#007832] dark:text-emerald-400 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {progress.finalExamScore}%
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('certificate')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 cursor-pointer ${
            activeTab === 'certificate'
              ? 'bg-[#39A900] text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Certificado</span>
          {progress.certificateCode && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          )}
        </button>
      </div>
    </header>
  );
};
