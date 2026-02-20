export type EventStatus = 'upcoming' | 'active' | 'finished' | 'archived';
export type EventDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type EventTheme = 'classification' | 'regression' | 'nlp' | 'vision' | 'other';
export type UserRole = 'participant' | 'organisateur' | 'administrateur';

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

export interface Metric {
  name: string;
  is_primary: boolean;
  weight: number;
}

export interface DatasetInfo {
  train_size: string;
  test_size: string;
  features: string;
  target: string;
}

export interface EventRules {
  max_submissions_per_day: number;
  max_submissions_total: number;
  max_file_size_mb: number;
  allowed_formats: string[];
  timeout_minutes: number;
}

export interface EventStats {
  participants_count: number;
  submissions_count: number;
  best_score: number;
}

export interface MyParticipation {
  is_joined: boolean;
  my_best_score?: number;
  my_rank?: number;
  my_submissions_count: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description_short: string;
  description_full: string;
  organizer: Organizer;
  status: EventStatus;
  difficulty: EventDifficulty;
  theme: EventTheme;
  start_date: string;
  end_date: string;
  registration_start: string;
  banner_image?: string;
  metrics: Metric[];
  dataset_info: DatasetInfo;
  rules: EventRules;
  stats: EventStats;
  my_participation?: MyParticipation;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  event_id: string;
  event_title: string;
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

export interface EventFilters {
  status: EventStatus | 'all';
  difficulty: EventDifficulty | 'all';
  theme: EventTheme | 'all';
  search: string;
}
