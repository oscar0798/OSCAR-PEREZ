export interface ApprenticeProfile {
  fullName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PPT';
  documentNumber: string;
  trainingProgram: string;
  ficheNumber: string; // Ficha de caracterización
  regional: string;
  trainingCenter: string;
  avatarSeed: string;
  joinedDate: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  scenario?: string; // Situación contextualizada en el SENA
  options: string[];
  correctAnswer: number;
  explanation: string;
  articleReference: string; // Referencia al Acuerdo 009 de 2024
  points: number;
}

export interface ModuleSection {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  content: string[];
  keyPoints: {
    title: string;
    description: string;
    icon: string;
    type?: 'neutral' | 'positive' | 'warning' | 'danger';
  }[];
}

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  tagline: string;
  shortDescription: string;
  iconName: string;
  color: string;
  accentBg: string;
  estimatedMinutes: number;
  sections: ModuleSection[];
  quiz: QuizQuestion[];
  badgeId: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  unlockedAt?: string;
}

export interface CommitteeCase {
  id: string;
  title: string;
  category: 'académica' | 'disciplinaria';
  severity: 'leve' | 'grave' | 'gravísima';
  description: string;
  apprenticeContext: string;
  options: {
    label: string;
    action: string;
    isCorrect: boolean;
    feedback: string;
    legalBasis: string;
  }[];
}

export interface InductionProgress {
  completedModules: string[];
  quizScores: Record<string, number>; // moduleId -> score %
  earnedBadges: string[];
  xp: number;
  level: number;
  finalExamScore: number | null;
  finalExamPassed: boolean;
  certificateGeneratedAt: string | null;
  certificateCode: string | null;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

export type UserRole = 'instructor' | 'aprendiz';

export interface InstructorProfile {
  fullName: string;
  email: string;
  regional: string;
  trainingCenter: string;
  fiches: string[]; // List of fiches managed, e.g. ['2874910', '2893120']
  assignedProgram: string;
}

export interface ApprenticeRecord {
  timestamp: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  ficheNumber: string;
  trainingProgram: string;
  regional: string;
  trainingCenter: string;
  completedModules: string;
  finalExamScore: string;
  certificationStatus: string;
  certificateCode: string;
  certificateDate: string;
  xp: string;
  level: string;
}
