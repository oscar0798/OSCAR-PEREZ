import { ApprenticeProfile, InductionProgress, ApprenticeRecord } from '../types/sena';
import { 
  readApprenticeRecords, 
  saveApprenticeToSheet, 
  SHEET_NAME,
  SHEET_HEADERS
} from './googleSheetsService';

export const OFFICIAL_REGISTRY_STORAGE_KEY = 'sena_official_induction_registry';

export const INITIAL_OFFICIAL_REGISTRY: ApprenticeRecord[] = [
  {
    timestamp: '21/10/2026 09:15:32',
    documentType: 'CC',
    documentNumber: '1024589312',
    fullName: 'Andrés Felipe Gómez Sánchez',
    ficheNumber: '2874910',
    trainingProgram: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Servicios Financieros (CSF)',
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
    trainingProgram: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Servicios Financieros (CSF)',
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
    trainingProgram: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Servicios Financieros (CSF)',
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
    trainingProgram: 'Tecnólogo en Gestión Financiera',
    regional: 'Regional Distrito Capital',
    trainingCenter: 'Centro de Servicios Financieros (CSF)',
    completedModules: '2 de 5 módulos',
    finalExamScore: 'No presentado',
    certificationStatus: 'En Curso',
    certificateCode: 'Pendiente',
    certificateDate: 'No emitido',
    xp: '140',
    level: 'Nivel 2: Aprendiz Comprometido'
  }
];

export function getLevelLabel(xp: number): string {
  if (xp >= 350) return 'Nivel 4: Maestro del Reglamento';
  if (xp >= 200) return 'Nivel 3: Líder de Ficha';
  if (xp >= 80) return 'Nivel 2: Aprendiz Comprometido';
  return 'Nivel 1: Aprendiz Novato';
}

/**
 * Builds a structured ApprenticeRecord from the live ApprenticeProfile and InductionProgress.
 */
export function buildApprenticeRecord(
  profile: ApprenticeProfile,
  progress: InductionProgress,
  customTimestamp?: string
): ApprenticeRecord {
  const nowStr = customTimestamp || new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const completedModulesCount = `${progress.completedModules.length} de 5 módulos`;
  const examScore = progress.finalExamScore !== null ? `${progress.finalExamScore}%` : 'No presentado';
  const certificationStatus = progress.finalExamPassed ? 'Aprobado y Certificado' : 'En Curso';
  const certCode = progress.certificateCode || 'Pendiente';
  const certDate = progress.certificateGeneratedAt || 'No emitido';

  return {
    timestamp: nowStr,
    documentType: profile.documentType,
    documentNumber: profile.documentNumber.trim(),
    fullName: profile.fullName.trim(),
    ficheNumber: profile.ficheNumber.trim(),
    trainingProgram: profile.trainingProgram.trim(),
    regional: profile.regional.trim(),
    trainingCenter: profile.trainingCenter.trim(),
    completedModules: completedModulesCount,
    finalExamScore: examScore,
    certificationStatus,
    certificateCode: certCode,
    certificateDate: certDate,
    xp: progress.xp.toString(),
    level: getLevelLabel(progress.xp)
  };
}

/**
 * Loads all official induction records from local persistent storage.
 */
export function getOfficialRegistry(): ApprenticeRecord[] {
  try {
    const saved = localStorage.getItem(OFFICIAL_REGISTRY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error al cargar registro oficial local:', err);
  }
  return [...INITIAL_OFFICIAL_REGISTRY];
}

/**
 * Persists records into the local official registry.
 */
export function saveOfficialRegistry(records: ApprenticeRecord[]): void {
  try {
    localStorage.setItem(OFFICIAL_REGISTRY_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Error al guardar registro oficial local:', err);
  }
}

/**
 * Upserts the active apprentice into the Official Induction Registry.
 * If the apprentice (matched by documentNumber) exists, updates all fields with latest progress.
 * If new, places them at the beginning of the list.
 */
export function upsertApprenticeInOfficialRegistry(
  profile: ApprenticeProfile,
  progress: InductionProgress
): { records: ApprenticeRecord[]; updatedRecord: ApprenticeRecord } {
  const currentRecords = getOfficialRegistry();
  const updatedRecord = buildApprenticeRecord(profile, progress);

  const cleanDoc = profile.documentNumber.trim();
  const existingIdx = currentRecords.findIndex(
    r => r.documentNumber.trim() === cleanDoc
  );

  let newRecords: ApprenticeRecord[];
  if (existingIdx >= 0) {
    newRecords = [...currentRecords];
    newRecords[existingIdx] = updatedRecord;
  } else {
    newRecords = [updatedRecord, ...currentRecords];
  }

  saveOfficialRegistry(newRecords);
  return { records: newRecords, updatedRecord };
}

/**
 * Syncs all records from the official registry to Google Sheets.
 */
export async function syncAllOfficialRecordsToSheet(
  accessToken: string,
  spreadsheetId: string,
  recordsToSync?: ApprenticeRecord[]
): Promise<{ success: number; failed: number }> {
  const records = recordsToSync || getOfficialRegistry();
  let successCount = 0;
  let failedCount = 0;

  for (const record of records) {
    try {
      const mockProfile: ApprenticeProfile = {
        fullName: record.fullName,
        documentType: (record.documentType as any) || 'CC',
        documentNumber: record.documentNumber,
        trainingProgram: record.trainingProgram,
        ficheNumber: record.ficheNumber,
        regional: record.regional,
        trainingCenter: record.trainingCenter,
        avatarSeed: 'aprendiz',
        joinedDate: new Date().toISOString().slice(0, 10)
      };

      const matchCompleted = record.completedModules.match(/(\d+)/);
      const completedCount = matchCompleted ? parseInt(matchCompleted[1], 10) : 0;
      const fakeCompletedModules = ['capitulo-1', 'capitulo-2', 'capitulo-3', 'capitulo-4', 'capitulo-5'].slice(0, completedCount);

      const matchScore = record.finalExamScore.match(/(\d+)/);
      const score = matchScore ? parseInt(matchScore[1], 10) : null;
      const passed = record.certificationStatus.toLowerCase().includes('aprobado') ||
                     record.certificationStatus.toLowerCase().includes('certificado');

      const mockProgress: InductionProgress = {
        completedModules: fakeCompletedModules,
        quizScores: {},
        earnedBadges: [],
        xp: parseInt(record.xp, 10) || 0,
        level: 1,
        finalExamScore: score,
        finalExamPassed: passed,
        certificateCode: record.certificateCode !== 'Pendiente' ? record.certificateCode : null,
        certificateGeneratedAt: record.certificateDate !== 'No emitido' ? record.certificateDate : null
      };

      await saveApprenticeToSheet(accessToken, spreadsheetId, mockProfile, mockProgress);
      successCount++;
    } catch (err) {
      console.error(`Error al sincronizar aprendiz ${record.fullName} (${record.documentNumber}):`, err);
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
}
