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

export const useUserDashboard = () => {
  return useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: () => api.user.dashboard(),
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

export const useMyCompetitions = () => {
  return useQuery({
    queryKey: ['competitions', 'my'],
    queryFn: () => api.competitions.getMyCompetitions(),
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

export const useCompetitionLeaderboard = (id: string) => {
  return useQuery({
    queryKey: ['competitions', id, 'leaderboard'],
    queryFn: () => api.competitions.leaderboard(id),
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

export const useUpdateCompetition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string, formData: FormData }) => api.competitions.update(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['competitions', id] });
    },
  });
};

// Admin Hooks
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api.admin.users(),
  });
};

export const useUpdateUserAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) => api.admin.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminCompetitions = () => {
  return useQuery({
    queryKey: ['admin', 'competitions'],
    queryFn: () => api.admin.competitions(),
  });
};

export const useAdminSubmissions = () => {
  return useQuery({
    queryKey: ['admin', 'submissions'],
    queryFn: () => api.admin.submissions(),
  });
};

export const useAdminSystem = () => {
  return useQuery({
    queryKey: ['admin', 'system'],
    queryFn: () => api.admin.system(),
    refetchInterval: 10000,
  });
};

export const useAdminLogs = () => {
  return useQuery({
    queryKey: ['admin', 'logs'],
    queryFn: () => api.admin.logs(),
  });
};

export const useUpdateCompetitionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.admin.updateCompetitionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'competitions'] });
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
    },
  });
};
