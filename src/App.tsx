import React, { useState, useEffect } from 'react';
import { 
  ApprenticeProfile, 
  InductionProgress, 
  Badge, 
  LearningModule,
  UserRole,
  InstructorProfile
} from './types/sena';
import { 
  SENA_MODULES, 
  INITIAL_BADGES 
} from './data/senaData';
import { Header } from './components/Header';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { InstructorDashboard } from './components/InstructorDashboard';
import { ModuleCard } from './components/ModuleCard';
import { ModuleViewer } from './components/ModuleViewer';
import { CommitteeSimulator } from './components/CommitteeSimulator';
import { FinalExam } from './components/FinalExam';
import { CertificateView } from './components/CertificateView';
import { ProfileModal } from './components/ProfileModal';
import { BadgesModal } from './components/BadgesModal';
import { GlossaryModal } from './components/GlossaryModal';
import { CertificateVerifierModal } from './components/CertificateVerifierModal';
import { StructuredPlanModal } from './components/StructuredPlanModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { initAuth } from './services/firebaseAuth';
import { User } from 'firebase/auth';
import { useAutoSync } from './hooks/useAutoSync';
import { upsertApprenticeInOfficialRegistry } from './services/inductionRegistryService';
import { 
  BookOpen, 
  Award, 
  FileCheck2, 
  Scale, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Flame,
  Search,
  Moon,
  Sun,
  FileSpreadsheet,
  ShieldCheck,
  Eye,
  GraduationCap
} from 'lucide-react';

const DEFAULT_INSTRUCTOR: InstructorProfile = {
  fullName: 'Oscar Pérez',
  email: 'oscar0798@gmail.com',
  regional: 'Regional Distrito Capital',
  trainingCenter: 'Centro de Servicios Financieros (CSF)',
  fiches: ['2874910', '2893120'],
  assignedProgram: 'ADSO - Análisis y Desarrollo de Software'
};

const DEFAULT_PROFILE: ApprenticeProfile = {
  fullName: 'Andrés Felipe Gómez Sánchez',
  documentType: 'CC',
  documentNumber: '1024589312',
  trainingProgram: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  ficheNumber: '2874910',
  regional: 'Regional Distrito Capital',
  trainingCenter: 'Centro de Servicios Financieros (CSF)',
  avatarSeed: 'andres-sena',
  joinedDate: '2024-03-01'
};

const DEFAULT_PROGRESS: InductionProgress = {
  completedModules: [],
  quizScores: {},
  earnedBadges: ['badge-identidad'], // First welcoming achievement
  xp: 40,
  level: 1,
  finalExamScore: null,
  finalExamPassed: false,
  certificateGeneratedAt: null,
  certificateCode: null
};

export default function App() {
  // Check if landing page should be shown
  const [isLandingOpen, setIsLandingOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('sena_session_active');
      if (active === 'instructor' || active === 'aprendiz') {
        return false;
      }
    }
    return true; // Show landing page by default
  });

  // Current active role
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('sena_session_active');
      if (active === 'instructor' || active === 'aprendiz') return active;
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      if (roleParam === 'aprendiz' || roleParam === 'instructor') {
        return roleParam;
      }
      const saved = localStorage.getItem('sena_user_role');
      if (saved === 'aprendiz' || saved === 'instructor') {
        return saved;
      }
    }
    return 'instructor';
  });

  const [instructor, setInstructor] = useState<InstructorProfile>(() => {
    const saved = localStorage.getItem('sena_instructor_profile');
    return saved ? JSON.parse(saved) : DEFAULT_INSTRUCTOR;
  });

  const [profile, setProfile] = useState<ApprenticeProfile>(() => {
    const saved = localStorage.getItem('sena_apprentice_profile');
    const base = saved ? JSON.parse(saved) : DEFAULT_PROFILE;

    // Check if URL params provide initial ficha or training program
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ficheParam = params.get('ficha');
      const programParam = params.get('programa');
      if (ficheParam) base.ficheNumber = ficheParam;
      if (programParam) base.trainingProgram = programParam;
    }

    return base;
  });

  const [progress, setProgress] = useState<InductionProgress>(() => {
    const saved = localStorage.getItem('sena_induction_progress');
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    return INITIAL_BADGES.map(b => ({
      ...b,
      earned: progress.earnedBadges?.includes(b.id) || b.id === 'badge-identidad'
    }));
  });

  // Dark Mode state with screen blur effect
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_induction_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  const [isBlurring, setIsBlurring] = useState<boolean>(false);

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<'instructor' | 'modules' | 'committee' | 'exam' | 'certificate'>(() => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('sena_session_active');
      if (active === 'aprendiz') return 'modules';
      if (active === 'instructor') return 'instructor';
      const params = new URLSearchParams(window.location.search);
      if (params.get('role') === 'aprendiz') return 'modules';
    }
    const savedRole = localStorage.getItem('sena_user_role');
    return savedRole === 'aprendiz' ? 'modules' : 'instructor';
  });

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);

  // Google Authentication State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  // Automatic Background Synchronization with Google Sheets
  const {
    syncStatus,
    lastSyncTime,
    sheetInfo,
    performSync,
    connectGoogle
  } = useAutoSync({
    profile,
    progress,
    user: googleUser,
    token: googleToken,
    onUserConnect: (user, token) => {
      setGoogleUser(user);
      setGoogleToken(token);
      if (user.email) {
        setInstructor(prev => ({
          ...prev,
          email: user.email || prev.email,
          fullName: user.displayName || prev.fullName
        }));
      }
    }
  });

  // Firebase auth initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        if (user.email) {
          setInstructor(prev => ({
            ...prev,
            email: user.email || prev.email,
            fullName: user.displayName || prev.fullName
          }));
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Sync theme changes to document and localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('sena_induction_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsBlurring(true);
    setIsDark(prev => !prev);
    setTimeout(() => {
      setIsBlurring(false);
    }, 650);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sena_user_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('sena_instructor_profile', JSON.stringify(instructor));
  }, [instructor]);

  useEffect(() => {
    localStorage.setItem('sena_apprentice_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sena_induction_progress', JSON.stringify(progress));
  }, [progress]);

  // Handler: Instructor enters successfully with key CSF2026
  const handleInstructorLoginSuccess = () => {
    setCurrentRole('instructor');
    setActiveTab('instructor');
    setIsLandingOpen(false);
    localStorage.setItem('sena_session_active', 'instructor');
    localStorage.setItem('sena_user_role', 'instructor');

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('role', 'instructor');
    window.history.replaceState({}, '', currentUrl.toString());
  };

  // Handler: Apprentice submits characterization form without password
  const handleApprenticeCharacterizationSuccess = (newProfile: ApprenticeProfile) => {
    setProfile(newProfile);
    setCurrentRole('aprendiz');
    setActiveTab('modules');
    setIsLandingOpen(false);
    localStorage.setItem('sena_session_active', 'aprendiz');
    localStorage.setItem('sena_user_role', 'aprendiz');

    // Instantly save in official induction registry and trigger sync
    upsertApprenticeInOfficialRegistry(newProfile, progress);
    performSync();

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('role', 'aprendiz');
    window.history.replaceState({}, '', currentUrl.toString());
  };

  // Handler: Return to landing page to switch role or log out
  const handleExitToLanding = () => {
    setIsLandingOpen(true);
    localStorage.removeItem('sena_session_active');
    
    // Clear search param role
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('role');
    window.history.replaceState({}, '', currentUrl.toString());
  };

  // Handle switching roles inside the app
  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === 'instructor') {
      // If switching to instructor, require authentication via landing
      handleExitToLanding();
      return;
    }

    setCurrentRole(newRole);
    localStorage.setItem('sena_user_role', newRole);
    localStorage.setItem('sena_session_active', newRole);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('role', newRole);
    window.history.replaceState({}, '', currentUrl.toString());

    if (activeTab === 'instructor') {
      setActiveTab('modules');
    }
  };

  // Handler for module completion
  const handleCompleteModule = (moduleId: string, score: number, earnedXp: number, badgeId: string) => {
    const alreadyCompleted = progress.completedModules.includes(moduleId);
    const newCompleted = alreadyCompleted ? progress.completedModules : [...progress.completedModules, moduleId];
    const newEarnedBadges = progress.earnedBadges.includes(badgeId)
      ? progress.earnedBadges
      : [...progress.earnedBadges, badgeId];
    const newXp = progress.xp + earnedXp;

    const nextProgress: InductionProgress = {
      ...progress,
      completedModules: newCompleted,
      quizScores: {
        ...progress.quizScores,
        [moduleId]: Math.max(score, progress.quizScores[moduleId] || 0)
      },
      earnedBadges: newEarnedBadges,
      xp: newXp
    };

    setProgress(nextProgress);
    upsertApprenticeInOfficialRegistry(profile, nextProgress);
    performSync();

    setBadges(prev => prev.map(b => (b.id === badgeId ? { ...b, earned: true } : b)));
  };

  // Handler for Committee simulation badge
  const handleUnlockBadge = (badgeId: string, xpReward: number) => {
    const nextProgress: InductionProgress = {
      ...progress,
      xp: progress.xp + xpReward,
      earnedBadges: progress.earnedBadges.includes(badgeId) ? progress.earnedBadges : [...progress.earnedBadges, badgeId]
    };
    setProgress(nextProgress);
    upsertApprenticeInOfficialRegistry(profile, nextProgress);
    performSync();

    setBadges(prev => prev.map(b => (b.id === badgeId ? { ...b, earned: true } : b)));
  };

  // Handler for final exam approval
  const handleExamPassed = (score: number, certCode: string) => {
    const todayStr = new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const nextProgress: InductionProgress = {
      ...progress,
      finalExamScore: score,
      finalExamPassed: true,
      certificateCode: certCode,
      certificateGeneratedAt: todayStr,
      xp: progress.xp + 100,
      earnedBadges: progress.earnedBadges.includes('badge-certificacion')
        ? progress.earnedBadges
        : [...progress.earnedBadges, 'badge-certificacion']
    };

    setProgress(nextProgress);
    upsertApprenticeInOfficialRegistry(profile, nextProgress);
    performSync();

    setBadges(prev =>
      prev.map(b => (b.id === 'badge-certificacion' ? { ...b, earned: true } : b))
    );
  };

  // If landing page is active, show the RoleSelectionLanding component
  if (isLandingOpen) {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return (
      <RoleSelectionLanding
        initialProfile={profile}
        initialInstructor={instructor}
        prefilledFiche={urlParams?.get('ficha')}
        prefilledProgram={urlParams?.get('programa')}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
        onSelectInstructor={handleInstructorLoginSuccess}
        onSelectApprentice={handleApprenticeCharacterizationSuccess}
      />
    );
  }

  const selectedModule = SENA_MODULES.find(m => m.id === selectedModuleId);

  const filteredModules = SENA_MODULES.filter(m => 
    m.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.shortDescription.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.tagline.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* Screen Blur Wave Effect when Dark Mode is toggled */}
      {isBlurring && (
        <div 
          className="fixed inset-0 z-[100] screen-blur-effect pointer-events-none flex items-center justify-center bg-slate-950/20 backdrop-blur-2xl transition-all"
          aria-hidden="true"
        >
          <div className="bg-slate-900/90 dark:bg-emerald-950/90 border border-emerald-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-3xl animate-in zoom-in-95 duration-200">
            {isDark ? (
              <Moon className="w-5 h-5 text-amber-400 animate-pulse" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400 animate-spin" />
            )}
            <div className="text-left">
              <p className="text-xs font-bold leading-none">
                {isDark ? 'Modo Oscuro Aplicado' : 'Modo Claro Aplicado'}
              </p>
              <p className="text-[10px] text-emerald-300/80 mt-0.5 font-medium">
                Efecto blur y atmósfera visual institucional
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ambient glowing blur orbs in Dark Mode */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-80" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#39A900]/12 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-teal-800/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Institutional Header with Role Adaptation & Exit Button */}
      <Header
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
        onExitToLanding={handleExitToLanding}
        instructor={instructor}
        profile={profile}
        progress={progress}
        badges={badges}
        activeTab={activeTab}
        setActiveTab={tab => {
          setSelectedModuleId(null);
          setActiveTab(tab);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenSheets={() => setIsSheetsOpen(true)}
        isGoogleConnected={!!googleUser}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
        syncStatus={syncStatus}
        lastSyncTime={lastSyncTime}
        sheetUrl={sheetInfo?.url}
        onConnectGoogle={connectGoogle}
        onManualSync={performSync}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* VIEW 0: INSTRUCTOR DASHBOARD (EXCLUSIVE TO INSTRUCTOR) */}
        {activeTab === 'instructor' && currentRole === 'instructor' && (
          <InstructorDashboard
            instructor={instructor}
            onUpdateInstructor={setInstructor}
            currentApprenticeProfile={profile}
            currentApprenticeProgress={progress}
            googleUser={googleUser}
            googleToken={googleToken}
            sheetInfo={sheetInfo}
            syncStatus={syncStatus}
            lastSyncTime={lastSyncTime}
            onConnectGoogle={connectGoogle}
            onManualSync={performSync}
            onSwitchToLearnerView={() => {
              setCurrentRole('aprendiz');
              setActiveTab('modules');
            }}
            onOpenSheetsModal={() => setIsSheetsOpen(true)}
            onExitToLanding={handleExitToLanding}
          />
        )}

        {/* VIEW 1: MODULES LIST OR MODULE VIEWER */}
        {activeTab === 'modules' && (
          <>
            {selectedModule ? (
              <ModuleViewer
                module={selectedModule}
                onBack={() => setSelectedModuleId(null)}
                onCompleteModule={handleCompleteModule}
                onGoToNextModule={() => {
                  const currentIndex = SENA_MODULES.findIndex(m => m.id === selectedModule.id);
                  if (currentIndex < SENA_MODULES.length - 1) {
                    setSelectedModuleId(SENA_MODULES[currentIndex + 1].id);
                  } else {
                    setSelectedModuleId(null);
                    setActiveTab('committee');
                  }
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Hero Banner */}
                <div className="bg-gradient-to-br from-[#005c24] via-[#007832] to-[#39A900] dark:from-[#003816] dark:via-[#1e5d00] dark:to-[#00471c] text-white rounded-3xl p-6 sm:p-8 shadow-md dark:shadow-emerald-950/50 border dark:border-emerald-800/50 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

                  <div className="relative z-10 max-w-3xl space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Normatividad Vigente
                      </span>
                      <span className="text-emerald-200 text-xs font-semibold">
                        Acuerdo 009 de 2024 (Mod. Acuerdo 002 de 2026) • Consejo Directivo Nacional
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                      Inducción Gamificada del Aprendiz SENA
                    </h1>

                    <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-2xl">
                      Bienvenido, <strong className="text-white font-bold">{profile.fullName}</strong>. Descubre de forma interactiva tus derechos, deberes, prohibiciones y las normas de convivencia que te acompañarán durante tu etapa lectiva y productiva en la Ficha #{profile.ficheNumber}.
                    </p>

                    {/* Quick Action buttons - Role differentiated */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setSelectedModuleId(SENA_MODULES[0].id)}
                        className="px-4 py-2 rounded-xl bg-white text-[#005c24] hover:bg-emerald-50 font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-[#39A900]" />
                        <span>Iniciar Inducción (Módulo 1)</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('committee')}
                        className="px-4 py-2 rounded-xl bg-black/25 hover:bg-black/40 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2 cursor-pointer"
                      >
                        <Scale className="w-4 h-4 text-emerald-300" />
                        <span>Simulador del Comité</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('exam')}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Ir a la Certificación</span>
                      </button>

                      {/* Instructor exclusive shortcuts in hero banner */}
                      {currentRole === 'instructor' && (
                        <>
                          <button
                            onClick={() => setActiveTab('instructor')}
                            className="px-4 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-300" />
                            <span>Panel de Instructor</span>
                          </button>

                          <button
                            onClick={() => {
                              if (sheetInfo?.url) {
                                window.open(sheetInfo.url, '_blank');
                              } else {
                                setIsSheetsOpen(true);
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/90 text-white font-bold text-xs border border-emerald-400/40 transition flex items-center gap-2 cursor-pointer shadow-xs"
                            title="Gestionar Google Drive"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                            <span>{sheetInfo?.url ? 'Abrir Google Sheets' : 'Configurar Drive'}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar overview */}
                <div className="bg-white dark:bg-slate-900/90 dark:backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Progreso de la Ruta de Inducción
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {progress.completedModules.length} de {SENA_MODULES.length} módulos completados con éxito
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <div className="w-full md:w-48 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#39A900] h-full transition-all duration-500"
                        style={{ width: `${(progress.completedModules.length / SENA_MODULES.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      {Math.round((progress.completedModules.length / SENA_MODULES.length) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Search & Header for modules */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Módulos de Aprendizaje
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Explora cada temática, aprende los conceptos clave y resuelve los retos para ganar experiencia.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={e => setSearchFilter(e.target.value)}
                      placeholder="Filtrar temas (ej. deberes)..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredModules.map(module => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isCompleted={progress.completedModules.includes(module.id)}
                      score={progress.quizScores[module.id]}
                      onOpen={() => setSelectedModuleId(module.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* VIEW 2: COMMITTEE SIMULATOR */}
        {activeTab === 'committee' && (
          <CommitteeSimulator
            onUnlockBadge={handleUnlockBadge}
            isUnlocked={progress.earnedBadges.includes('badge-comite')}
          />
        )}

        {/* VIEW 3: FINAL EXAM */}
        {activeTab === 'exam' && (
          <FinalExam
            passedScore={progress.finalExamScore}
            certCode={progress.certificateCode}
            onExamPassed={handleExamPassed}
            onGoToCertificate={() => setActiveTab('certificate')}
          />
        )}

        {/* VIEW 4: OFFICIAL CERTIFICATE */}
        {activeTab === 'certificate' && (
          <CertificateView
            profile={profile}
            progress={progress}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenVerifier={() => setIsVerifierOpen(true)}
            onGoToExam={() => setActiveTab('exam')}
            onOpenSheets={() => setIsSheetsOpen(true)}
            sheetUrl={sheetInfo?.url}
            syncStatus={syncStatus}
            showSheetsAction={currentRole === 'instructor'}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="no-print mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#39A900]">SENA</span>
            <span>•</span>
            <span>Servicio Nacional de Aprendizaje • República de Colombia</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium">
            <button
              onClick={handleExitToLanding}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>Cambiar Rol / Salir</span>
            </button>
            <span>•</span>

            {/* Instructor role shortcut in footer */}
            {currentRole === 'instructor' && (
              <>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>Panel de Monitoreo</span>
                </button>
                <span>•</span>
                <button
                  onClick={() => setIsSheetsOpen(true)}
                  className="hover:text-[#39A900] dark:hover:text-emerald-400 transition flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>Google Drive & Sheets</span>
                </button>
                <span>•</span>
              </>
            )}

            <button
              onClick={() => setIsPlanOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Plan de Inducción
            </button>
            <span>•</span>
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Glosario Normativo
            </button>
            <span>•</span>
            <button
              onClick={() => setIsVerifierOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Verificar Certificado
            </button>
            <span>•</span>
            <button
              onClick={toggleDarkMode}
              className="hover:text-[#39A900] dark:hover:text-amber-400 transition flex items-center gap-1 font-semibold cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={updated => {
          setProfile(updated);
          upsertApprenticeInOfficialRegistry(updated, progress);
          performSync();
        }}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        badges={badges}
        currentXp={progress.xp}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <CertificateVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
        currentProfile={profile}
        currentProgress={progress}
      />

      <StructuredPlanModal
        isOpen={isPlanOpen}
        onClose={() => setIsPlanOpen(false)}
      />

      {/* Only openable by instructor */}
      <GoogleSheetsModal
        isOpen={isSheetsOpen}
        onClose={() => setIsSheetsOpen(false)}
        profile={profile}
        progress={progress}
        user={googleUser}
        onUserChange={(usr, token) => {
          setGoogleUser(usr);
          setGoogleToken(token);
        }}
      />
    </div>
  );
}
