export type CompetitionStatus = 'upcoming' | 'active' | 'finished' | 'archived';
export type CompetitionDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CompetitionTheme = 'classification' | 'regression' | 'nlp' | 'vision' | 'other';
export type UserRole = 'utilisateur' | 'administrateur';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export interface Organizer {
  id: string;
  name: string;
  avatar?: string;
}

export interface MyParticipation {
  is_joined: boolean;
  is_owner?: boolean;
  my_best_score?: number;
  my_rank?: number;
  my_submissions_count: number;
}

export interface ApiCalendar {
  start_date: string;
  end_date: string;
  registration_start?: string | null;
  results_date?: string | null;
  days_remaining?: number | null;
}

export interface ApiConfig {
  allowed_formats: string[];
  execution_timeout_seconds: number;
  max_file_size_mb: number;
  max_submissions_per_day: number;
  max_submissions_total: number;
}

export interface ApiMetricsInfo {
  higher_is_better: boolean;
  label: string;
  task: string;
}

export interface ApiMetrics {
  primary: string;
  secondary: string[];
  info: ApiMetricsInfo;
}

export interface ApiStats {
  participants: number;
  total_submissions: number;
  best_score?: number | null;
}

export interface ApiDownloads {
  train_dataset?: string | null;
  sample_submission?: string | null;
}

export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  problem_statement: string | null;
  data_description: string | null;
  evaluation_description: string | null;
  rules: string | null;
  status: CompetitionStatus;
  task_type: CompetitionTheme;
  difficulty?: CompetitionDifficulty;
  banner_url: string | null;
  banner_image?: string | null;
  organizer?: Organizer;
  calendar: ApiCalendar;
  config: ApiConfig;
  metrics: ApiMetrics;
  stats: ApiStats;
  downloads?: ApiDownloads;
  prizes?: any[];
  faq?: any[];
  my_participation?: MyParticipation;
  created_at: string;
  updated_at?: string;
  
  // Retro-compatibility fields for parts of the app not fully migrated
  start_date?: string;
  end_date?: string;
}

export interface Submission {
  id: string;
  competition_id: string;
  competition_title: string;
  user_id: string;
  user_name: string;
  file_name: string;
  file_size: number;
  status: 'pending' | 'processing' | 'evaluated' | 'error';
  score?: number;
  rank?: number;
  metrics?: Record<string, number>;
  error_message?: string;
  submitted_at: string;
  evaluated_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  best_score: number;
  submissions_count: number;
  last_submission: string;
  metrics?: Record<string, number>;
}

export interface CompetitionFilters {
  status: CompetitionStatus | 'all';
  difficulty: CompetitionDifficulty | 'all';
  theme: CompetitionTheme | 'all';
  search: string;
}
