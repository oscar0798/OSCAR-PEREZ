import React, { useState } from 'react';
import { ApprenticeProfile, InstructorProfile, UserRole } from '../types/sena';
import { SenaLogo } from './SenaLogo';
import { 
  ShieldCheck, 
  GraduationCap, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Sparkles, 
  Scale, 
  BookOpen, 
  Award, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  UserCheck, 
  School, 
  FileText, 
  Sun, 
  Moon, 
  HelpCircle,
  Hash,
  ChevronRight,
  Play,
  X
} from 'lucide-react';

interface RoleSelectionLandingProps {
  initialProfile: ApprenticeProfile;
  initialInstructor: InstructorProfile;
  prefilledFiche?: string | null;
  prefilledProgram?: string | null;
  isDark: boolean;
  onToggleDark: () => void;
  onSelectInstructor: () => void;
  onSelectApprentice: (profile: ApprenticeProfile) => void;
}

const INSTRUCTOR_SECRET_KEY = 'CSF2026';

const REGIONAL_LIST = [
  'Regional Distrito Capital',
  'Regional Antioquia',
  'Regional Valle',
  'Regional Santander',
  'Regional Atlántico',
  'Regional Bolívar',
  'Regional Caldas',
  'Regional Cundinamarca',
  'Regional Tolima',
  'Regional Huila',
  'Regional Boyacá',
  'Regional Meta',
  'Regional Risaralda',
  'Regional Nariño',
  'Regional Norte de Santander',
  'Regional Córdoba',
  'Regional Cauca',
  'Regional Cesar',
  'Regional Sucre',
  'Regional Magdalena',
  'Regional Quindío'
];

// Video Tutorial Modal
const VideoTutorialModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-2 relative shadow-2xl border border-slate-700">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300 transition"
        >
          <X className="w-8 h-8" />
        </button>
        <video 
          controls 
          autoPlay
          className="w-full rounded-2xl"
          src="/public/assets/aistudio/2026__16_27_0bb340ee.mp4"
        >
          Tu navegador no soporta la reproducción de video.
        </video>
      </div>
    </div>
  );
};

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  initialProfile,
  initialInstructor,
  prefilledFiche,
  prefilledProgram,
  isDark,
  onToggleDark,
  onSelectInstructor,
  onSelectApprentice
}) => {
  // Selected tab or modal state: 'none' | 'instructor' | 'aprendiz'
  const [activeModal, setActiveModal] = useState<'none' | 'instructor' | 'aprendiz'>('none');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);


  // Instructor Authentication State
  const [instructorKey, setInstructorKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Apprentice Characterization Form State
  const [formData, setFormData] = useState<ApprenticeProfile>({
    fullName: initialProfile.fullName || '',
    documentType: initialProfile.documentType || 'CC',
    documentNumber: initialProfile.documentNumber || '',
    trainingProgram: prefilledProgram || initialProfile.trainingProgram || 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    ficheNumber: prefilledFiche || initialProfile.ficheNumber || '2874910',
    regional: initialProfile.regional || 'Regional Distrito Capital',
    trainingCenter: initialProfile.trainingCenter || 'Centro de Servicios Financieros (CSF)',
    avatarSeed: initialProfile.avatarSeed || 'aprendiz-sena',
    joinedDate: initialProfile.joinedDate || new Date().toISOString().slice(0, 10)
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Instructor Login Submit Handler
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError(null);

    const cleanKey = instructorKey.trim();

    if (!cleanKey) {
      setKeyError('Por favor ingrese la clave de instructor.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      if (cleanKey === INSTRUCTOR_SECRET_KEY) {
        setIsAuthenticating(false);
        onSelectInstructor();
      } else {
        setIsAuthenticating(false);
        setKeyError('Clave incorrecta. Por favor verifique e intente nuevamente.');
      }
    }, 350);
  };

  // Apprentice Characterization Submit Handler
  const handleApprenticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errors.fullName = 'Por favor ingresa tus nombres y apellidos completos.';
    }

    if (!formData.documentNumber.trim() || formData.documentNumber.trim().length < 5) {
      errors.documentNumber = 'Ingresa un número de documento válido.';
    }

    if (!formData.ficheNumber.trim() || formData.ficheNumber.trim().length < 4) {
      errors.ficheNumber = 'Ingresa el número de tu Ficha de caracterización SENA.';
    }

    if (!formData.trainingProgram.trim()) {
      errors.trainingProgram = 'Ingresa o selecciona el programa de formación.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Submit validated profile
    onSelectApprentice({
      ...formData,
      avatarSeed: formData.fullName.toLowerCase().replace(/\s+/g, '-')
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden selection:bg-[#39A900] selection:text-white">
      {/* Background Institutional Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-70" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-[#39A900]/15 dark:bg-[#39A900]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] bg-teal-800/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header / Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="bg-gradient-to-r from-[#005c24] via-[#39A900] to-[#007832] dark:from-[#003816] dark:via-[#216b00] dark:to-[#00471c] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide">
              COLOMBIA
            </span>
            <span className="truncate">
              Servicio Nacional de Aprendizaje SENA • Portal de Acceso a Inducción
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-white/90 text-xs">
              Acuerdo 009 de 2024 • Ac. 002 de 2026
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SenaLogo />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="hidden sm:block leading-tight">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                Plataforma de Inducción Integral
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Reglamento del Aprendiz SENA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-[#007832] dark:text-emerald-300 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Tutorial</span>
            </button>
            <button
              onClick={onToggleDark}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition cursor-pointer"
              title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span className="hidden sm:inline">{isDark ? 'Claro' : 'Oscuro'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Role Selection Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 my-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[#007832] dark:text-emerald-300 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selección de Rol de Acceso Oficial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Bienvenido a la Inducción <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007832] via-[#39A900] to-emerald-500">
              del Aprendiz SENA
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Para garantizar la seguridad de la información y separar las funciones de monitoreo y formación, selecciona el perfil con el que ingresarás al sistema.
          </p>
        </div>

        {/* The Two Distinct Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* CARD 1: INSTRUCTOR PORTAL */}
          <div className="group bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/90 text-[#007832] dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-xs group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  Requiere Clave
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Portal del Instructor
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Espacio exclusivo para instructores y coordinadores. Permite gestionar la sincronización con Google Drive, monitorear el progreso de las fichas y generar enlaces para los aprendices.
                </p>
              </div>

              {/* Privilege list */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Sincronización y enlace oficial de Google Sheets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Monitoreo en tiempo real de aprendices por Ficha</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Generador y copiado de enlaces para compartir</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Descarga de reportes consolidados en CSV</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => {
                  setActiveModal('instructor');
                  setKeyError(null);
                  setInstructorKey('');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white hover:bg-[#007832] dark:hover:bg-emerald-500 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-emerald-400 dark:text-white" />
                <span>Ingresar como Instructor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2 font-mono">
                Autenticación segura mediante clave institucional
              </p>
            </div>
          </div>

          {/* CARD 2: APPRENTICE PORTAL */}
          <div className="group bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 hover:border-[#39A900] dark:hover:border-[#39A900] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-xs group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
                  <Unlock className="w-3.5 h-3.5" />
                  Sin Clave • Datos Personales
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Portal del Aprendiz
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Acceso directo a la ruta de inducción institucional. Completa tus módulos formativos, practica con casos en el simulador del comité y obtén tu certificación oficial sin distracciones.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>5 Módulos interactivos del Reglamento (Acuerdo 009)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Simulador de Casos del Comité de Evaluación</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Evaluación final y Certificado Oficial con código UUID</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Autoguardado transparente en la hoja de tu instructor</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => setActiveModal('aprendiz')}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#007832] to-[#39A900] hover:from-[#005c24] hover:to-[#007832] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Registrar Datos e Iniciar Inducción</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Llena tus datos de caracterización para generar tu certificado
              </p>
            </div>
          </div>
        </div>

        {/* Important Clarification Banner */}
        <div className="max-w-5xl mx-auto mt-8 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#39A900] shrink-0" />
            <span>
              <strong>Nota de Seguridad:</strong> Los aprendices <strong>no tienen acceso</strong> a la configuración ni visualización de Google Drive. Su información se envía de forma transparente y segura.
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400 shrink-0">
            SENA CSF • 2026
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#39A900]">SENA</span>
            <span>•</span>
            <span>Servicio Nacional de Aprendizaje • Dirección de Formación Profesional</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Acuerdo 009 de 2024 (Modificado por Acuerdo 002 de 2026)
          </p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL 1: INSTRUCTOR AUTHENTICATION WITH KEY CSF2026                       */}
      {/* ========================================================================= */}
      {activeModal === 'instructor' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#007832] dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#39A900]">
                  Acceso Restringido
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  Clave del Instructor
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ingresa la clave autorizada de instructor para acceder a las opciones de sincronización con Google Drive, monitoreo de aprendices y emisión de enlaces.
            </p>

            <form onSubmit={handleInstructorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Clave de Acceso de Instructor:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={instructorKey}
                    onChange={e => {
                      setInstructorKey(e.target.value);
                      if (keyError) setKeyError(null);
                    }}
                    placeholder="Ingresa la clave..."
                    autoFocus
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {keyError && (
                  <div className="mt-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2 animate-in shake duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{keyError}</span>
                  </div>
                )}
              </div>


              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#007832] hover:bg-[#39A900] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <span>Verificando...</span>
                  ) : (
                    <>
                      <span>Validar y Entrar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: APPRENTICE CHARACTERIZATION FORM (NO PASSWORD REQUIRED)           */}
      {/* ========================================================================= */}
      {activeModal === 'aprendiz' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8 relative"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                  Caracterización Oficial SENA
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  Datos del Aprendiz
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Diligencia tus datos de formación. Estos datos aparecerán en tu <strong>Certificado Oficial de Inducción</strong> y se guardarán automáticamente en el reporte del instructor. <em>No se requiere ninguna clave.</em>
            </p>

            <form onSubmit={handleApprenticeSubmit} className="space-y-4">
              {/* Nombres y Apellidos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombres y Apellidos Completos:
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                  }}
                  placeholder="ej. Andrés Felipe Gómez Sánchez"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Document Type & Number */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo Doc:
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={e => setFormData({ ...formData, documentType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                  >
                    <option value="CC">C.C. - Cédula</option>
                    <option value="TI">T.I. - Tarjeta Identidad</option>
                    <option value="CE">C.E. - Cédula Extranjería</option>
                    <option value="PPT">PPT - Protección Temp.</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Documento:
                  </label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={e => {
                      setFormData({ ...formData, documentNumber: e.target.value });
                      if (formErrors.documentNumber) setFormErrors({ ...formErrors, documentNumber: '' });
                    }}
                    placeholder="ej. 1024589312"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                  />
                  {formErrors.documentNumber && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.documentNumber}</p>
                  )}
                </div>
              </div>

              {/* Ficha & Programa */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ficha de Caracterización:
                  </label>
                  <input
                    type="text"
                    value={formData.ficheNumber}
                    onChange={e => {
                      setFormData({ ...formData, ficheNumber: e.target.value });
                      if (formErrors.ficheNumber) setFormErrors({ ...formErrors, ficheNumber: '' });
                    }}
                    placeholder="ej. 2874910"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                  />
                  {formErrors.ficheNumber && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.ficheNumber}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Programa de Formación:
                  </label>
                  <input
                    type="text"
                    value={formData.trainingProgram}
                    onChange={e => {
                      setFormData({ ...formData, trainingProgram: e.target.value });
                      if (formErrors.trainingProgram) setFormErrors({ ...formErrors, trainingProgram: '' });
                    }}
                    placeholder="ej. Tecnólogo en Análisis y Desarrollo de Software (ADSO)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                  />
                  {formErrors.trainingProgram && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.trainingProgram}</p>
                  )}
                </div>
              </div>

              {/* Regional & Centro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Regional SENA:
                  </label>
                  <select
                    value={formData.regional}
                    onChange={e => setFormData({ ...formData, regional: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                  >
                    {REGIONAL_LIST.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Centro de Formación:
                  </label>
                  <input
                    type="text"
                    value={formData.trainingCenter}
                    onChange={e => setFormData({ ...formData, trainingCenter: e.target.value })}
                    placeholder="ej. Centro de Servicios Financieros (CSF)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#39A900] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-2 py-2.5 px-4 rounded-xl bg-[#007832] hover:bg-[#39A900] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Comenzar mi Inducción SENA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <VideoTutorialModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
    </div>
  );
};

