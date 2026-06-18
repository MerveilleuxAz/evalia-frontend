import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Competition, CompetitionFilters, Submission, LeaderboardEntry } from '@/types';
import { api } from '@/lib/api';

interface CompetitionContextType {
  competitions: Competition[];
  currentCompetition: Competition | null;
  myCompetitions: Competition[];
  submissions: Submission[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  fetchCompetitions: (filters?: Partial<CompetitionFilters>) => Promise<void>;
  fetchCompetitionById: (id: string) => Promise<void>;
  fetchMyCompetitions: () => Promise<void>;
  joinCompetition: (competitionId: string) => Promise<void>;
  leaveCompetition: (competitionId: string) => Promise<void>;
  submitModel: (competitionId: string, file: File, description?: string) => Promise<void>;
  fetchSubmissions: (competitionId?: string) => Promise<void>;
  fetchLeaderboard: (competitionId: string) => Promise<void>;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export function CompetitionProvider({ children }: { children: ReactNode }) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [currentCompetition, setCurrentCompetition] = useState<Competition | null>(null);
  const [myCompetitions, setMyCompetitions] = useState<Competition[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCompetitions = useCallback(async (filters?: Partial<CompetitionFilters>) => {
    setLoading(true);
    try {
      const data = await api.competitions.list(filters);
      if (data && data.competitions) {
        setCompetitions(data.competitions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompetitionById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await api.competitions.getDetails(id);
      setCurrentCompetition(data as any);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyCompetitions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.auth.dashboard();
      if (data && data.recent_competitions) {
        setMyCompetitions(data.recent_competitions);
      }
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const joinCompetition = useCallback(async (competitionId: string) => {
    try {
      await api.competitions.join(competitionId);
      await fetchCompetitionById(competitionId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, [fetchCompetitionById]);

  const leaveCompetition = useCallback(async (competitionId: string) => {
    try {
      await api.competitions.leave(competitionId);
      await fetchCompetitionById(competitionId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, [fetchCompetitionById]);

  // Soumet un modèle via l'API d'évaluation
  const submitModel = useCallback(async (competitionId: string, file: File, modelType?: string) => {
    const formData = new FormData();
    formData.append('model_file', file);
    // Détection automatique du type selon l'extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      pkl: 'sklearn', joblib: 'sklearn',
      h5: 'tensorflow',
      pt: 'pytorch',
      onnx: 'onnx',
    };
    const detectedType = modelType || (ext ? typeMap[ext] : undefined) || 'sklearn';
    formData.append('model_type', detectedType);

    const result = await api.eval.submit(competitionId, formData);
    return result;
  }, []);

  const fetchSubmissions = useCallback(async (competitionId?: string) => {
    setLoading(true);
    try {
      if (competitionId) {
        // Récupère les soumissions de l'utilisateur pour une compétition précise
        const data = await api.eval.mySubmissions(competitionId);
        setSubmissions(data?.submissions || []);
      } else {
        // Fallback : soumissions récentes depuis le dashboard
        const data = await api.auth.dashboard();
        setSubmissions(data?.recent_submissions || []);
      }
    } catch (e) {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLeaderboard = useCallback(async (competitionId: string) => {
    try {
      const data = await api.competitions.leaderboard(competitionId);
      if (data && data.leaderboard) {
        setLeaderboard(data.leaderboard);
      } else if (data && data.participants) {
        // Fallback sur participants si leaderboard pas encore structuré
        const mapped = data.participants.map((p: any, idx: number) => ({
          rank: idx + 1,
          user_id: p.id,
          user_name: p.username || p.name,
          user_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`,
          best_score: p.best_score ?? 0,
          submissions_count: p.submissions_count ?? 0,
        }));
        setLeaderboard(mapped);
      } else {
        setLeaderboard([]);
      }
    } catch (e) {
      // En cas d'erreur (route pas encore déployée), on replie sur les participants
      try {
        const data = await api.competitions.participants(competitionId);
        if (data && data.participants) {
          const mapped = data.participants.map((p: any, idx: number) => ({
            rank: idx + 1,
            user_id: p.id,
            user_name: p.username || p.name,
            user_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`,
            best_score: 0,
            submissions_count: 0,
          }));
          setLeaderboard(mapped);
        }
      } catch {
        setLeaderboard([]);
      }
    }
  }, []);

  return (
    <CompetitionContext.Provider
      value={{
        competitions,
        currentCompetition,
        myCompetitions,
        submissions,
        leaderboard,
        loading,
        fetchCompetitions,
        fetchCompetitionById,
        fetchMyCompetitions,
        joinCompetition,
        leaveCompetition,
        submitModel,
        fetchSubmissions,
        fetchLeaderboard,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
}

export function useCompetitions() {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error('useCompetitions must be used within an CompetitionProvider');
  }
  return context;
}
