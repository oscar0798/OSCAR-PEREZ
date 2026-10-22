import { useState, useEffect, useRef, useCallback } from 'react';
import { User } from 'firebase/auth';
import { ApprenticeProfile, InductionProgress } from '../types/sena';
import { 
  findOrCreateInductionSheet, 
  saveApprenticeToSheet,
  SpreadsheetInfo 
} from '../services/googleSheetsService';
import { 
  upsertApprenticeInOfficialRegistry 
} from '../services/inductionRegistryService';
import { googleSignIn, getAccessToken } from '../services/firebaseAuth';

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'disconnected';

interface UseAutoSyncProps {
  profile: ApprenticeProfile;
  progress: InductionProgress;
  user: User | null;
  token: string | null;
  onUserConnect?: (user: User, token: string) => void;
}

export function useAutoSync({
  profile,
  progress,
  user,
  token,
  onUserConnect
}: UseAutoSyncProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(user && token ? 'idle' : 'disconnected');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [sheetInfo, setSheetInfo] = useState<SpreadsheetInfo | null>(() => {
    try {
      const id = localStorage.getItem('sena_induction_sheet_id');
      const url = localStorage.getItem('sena_induction_sheet_url');
      const name = localStorage.getItem('sena_induction_sheet_name');
      if (id && url) {
        return { id, url, name: name || 'SENA - Registro Oficial de Inducción de Aprendices' };
      }
    } catch {
      // storage unavailable
    }
    return null;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debounce and sync locking refs
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  // Keep official registry in local storage updated on ANY profile or progress milestone
  useEffect(() => {
    if (profile.documentNumber && profile.fullName) {
      upsertApprenticeInOfficialRegistry(profile, progress);
    }
  }, [
    profile.documentNumber,
    profile.fullName,
    profile.documentType,
    profile.ficheNumber,
    profile.trainingProgram,
    profile.regional,
    profile.trainingCenter,
    progress.completedModules.length,
    progress.finalExamPassed,
    progress.finalExamScore,
    progress.certificateCode,
    progress.xp
  ]);

  // Ensure sheet info is resolved whenever user/token is active
  const ensureSheet = useCallback(async (activeToken: string): Promise<SpreadsheetInfo> => {
    if (sheetInfo && sheetInfo.id) {
      return sheetInfo;
    }
    const info = await findOrCreateInductionSheet(activeToken);
    setSheetInfo(info);
    try {
      localStorage.setItem('sena_induction_sheet_id', info.id);
      localStorage.setItem('sena_induction_sheet_url', info.url);
      localStorage.setItem('sena_induction_sheet_name', info.name);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return info;
  }, [sheetInfo]);

  // Execute background sync to Google Sheets
  const performSync = useCallback(async () => {
    // 1. Always ensure local official registry has the latest state
    upsertApprenticeInOfficialRegistry(profile, progress);

    // 2. Check Google token
    let activeToken = token;
    if (!activeToken) {
      activeToken = await getAccessToken();
    }

    if (!user || !activeToken) {
      setSyncStatus('disconnected');
      return;
    }

    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    setSyncStatus('saving');
    setErrorMessage(null);

    try {
      const targetSheet = await ensureSheet(activeToken);
      await saveApprenticeToSheet(activeToken, targetSheet.id, profile, progress);

      setSyncStatus('saved');
      setLastSyncTime(new Date());

      // After 3.5 seconds in 'saved' state, return gracefully to 'idle'
      setTimeout(() => {
        setSyncStatus(prev => (prev === 'saved' ? 'idle' : prev));
      }, 3500);
    } catch (err: any) {
      console.error('Error en sincronización con Google Sheets:', err);
      setSyncStatus('error');
      setErrorMessage(err.message || 'Error al conectar con Google Sheets');
    } finally {
      isSyncingRef.current = false;
    }
  }, [user, token, profile, progress, ensureSheet]);

  // Schedule a debounced sync
  const scheduleSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      performSync();
    }, 700);
  }, [performSync]);

  // Trigger auto-sync when milestones or profile change and Google is connected
  useEffect(() => {
    if (user) {
      scheduleSync();
    }
  }, [
    profile.documentNumber,
    profile.fullName,
    profile.ficheNumber,
    profile.trainingProgram,
    progress.completedModules.length, 
    progress.finalExamPassed, 
    progress.certificateCode,
    progress.xp,
    user, 
    scheduleSync
  ]);

  // Update status when user connection changes
  useEffect(() => {
    if (!user || !token) {
      setSyncStatus('disconnected');
    } else if (syncStatus === 'disconnected') {
      setSyncStatus('idle');
      scheduleSync();
    }
  }, [user, token, syncStatus, scheduleSync]);

  // One-click connect Google Account
  const connectGoogle = async () => {
    try {
      setSyncStatus('saving');
      const res = await googleSignIn();
      if (res) {
        if (onUserConnect) {
          onUserConnect(res.user, res.accessToken);
        }
        const info = await findOrCreateInductionSheet(res.accessToken);
        setSheetInfo(info);
        try {
          localStorage.setItem('sena_induction_sheet_id', info.id);
          localStorage.setItem('sena_induction_sheet_url', info.url);
          localStorage.setItem('sena_induction_sheet_name', info.name);
        } catch (e) {
          console.warn('LocalStorage error', e);
        }
        // Save immediately
        await saveApprenticeToSheet(res.accessToken, info.id, profile, progress);
        setSyncStatus('saved');
        setLastSyncTime(new Date());
        setTimeout(() => setSyncStatus('idle'), 3500);
      }
    } catch (err: any) {
      console.error('Error al conectar Google:', err);
      setSyncStatus('error');
      setErrorMessage(err.message || 'No se pudo completar la conexión con Google');
    }
  };

  return {
    syncStatus,
    lastSyncTime,
    sheetInfo,
    errorMessage,
    performSync,
    connectGoogle
  };
}
