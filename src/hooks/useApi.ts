import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Auth Hooks
export const useAuthMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.auth.me(),
    retry: false,
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ['auth', 'dashboard'],
    queryFn: () => api.auth.dashboard(),
    retry: false,
  });
};

// Competition Hooks
export const useCompetitions = (params?: { status?: string; task_type?: string; page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['competitions', params],
    queryFn: () => api.competitions.list(params),
  });
};

export const useCompetition = (id: string) => {
  return useQuery({
    queryKey: ['competitions', id],
    queryFn: () => api.competitions.getDetails(id),
    enabled: !!id,
  });
};

export const useCompetitionParticipants = (id: string) => {
  return useQuery({
    queryKey: ['competitions', id, 'participants'],
    queryFn: () => api.competitions.participants(id),
    enabled: !!id,
  });
};

export const useJoinCompetition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.competitions.join(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'dashboard'] });
    },
  });
};

export const useLeaveCompetition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.competitions.leave(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'dashboard'] });
    },
  });
};
export const useCreateCompetition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => api.competitions.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'dashboard'] });
    },
  });
};
