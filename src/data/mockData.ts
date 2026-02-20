import type { Event, Submission, LeaderboardEntry } from '@/types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Challenge Classification Images Médicales',
    slug: 'challenge-classification-images-medicales',
    description_short: 'Classifiez des images de rayons X pour détecter différentes pathologies pulmonaires avec précision.',
    description_full: `## Contexte

Ce challenge vous invite à développer un modèle de classification d'images médicales pour aider au diagnostic de pathologies pulmonaires à partir de radiographies thoraciques.

## Objectifs

- Développer un modèle capable de classifier des images de rayons X en 5 catégories
- Atteindre une précision minimale de 85% sur le jeu de test
- Optimiser le temps d'inférence pour une utilisation clinique

## Impact

Les meilleurs modèles pourront être intégrés dans des outils d'aide au diagnostic utilisés dans les hôpitaux partenaires de l'IFRI.`,
    organizer: {
      id: '2',
      name: 'Dr. Kouassi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kouassi',
    },
    status: 'active',
    difficulty: 'intermediate',
    theme: 'vision',
    start_date: '2026-01-15T00:00:00Z',
    end_date: '2026-02-28T23:59:59Z',
    registration_start: '2026-01-01T00:00:00Z',
    banner_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=400&fit=crop',
    metrics: [
      { name: 'accuracy', is_primary: true, weight: 1.0 },
      { name: 'f1_score', is_primary: false, weight: 0.5 },
      { name: 'precision', is_primary: false, weight: 0.3 },
    ],
    dataset_info: {
      train_size: '10,000 images',
      test_size: '2,500 images (hidden)',
      features: 'Images 256x256 RGB',
      target: '5 classes (normal, pneumonie, covid, tuberculose, cancer)',
    },
    rules: {
      max_submissions_per_day: 10,
      max_submissions_total: 50,
      max_file_size_mb: 500,
      allowed_formats: ['.pkl', '.h5', '.pt', '.onnx'],
      timeout_minutes: 10,
    },
    stats: {
      participants_count: 127,
      submissions_count: 543,
      best_score: 0.947,
    },
    my_participation: {
      is_joined: true,
      my_best_score: 0.892,
      my_rank: 15,
      my_submissions_count: 23,
    },
    created_at: '2025-12-20T10:30:00Z',
    updated_at: '2026-01-10T14:22:00Z',
  },
  {
    id: '2',
    title: 'Prédiction de la Demande Énergétique',
    slug: 'prediction-demande-energetique',
    description_short: 'Prédisez la consommation électrique horaire pour optimiser la distribution d\'énergie au Bénin.',
    description_full: `## Contexte

Le réseau électrique béninois fait face à des défis de gestion de la demande. Ce challenge vise à développer des modèles prédictifs pour anticiper la consommation.

## Données

- Historique de consommation sur 3 ans
- Données météorologiques
- Calendrier des jours fériés et événements

## Objectif

Minimiser l'erreur de prédiction RMSE sur un horizon de 24h.`,
    organizer: {
      id: '5',
      name: 'Prof. Adama',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adama',
    },
    status: 'active',
    difficulty: 'advanced',
    theme: 'regression',
    start_date: '2026-01-20T00:00:00Z',
    end_date: '2026-03-15T23:59:59Z',
    registration_start: '2026-01-10T00:00:00Z',
    banner_image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=400&fit=crop',
    metrics: [
      { name: 'rmse', is_primary: true, weight: 1.0 },
      { name: 'mae', is_primary: false, weight: 0.5 },
      { name: 'r2', is_primary: false, weight: 0.3 },
    ],
    dataset_info: {
      train_size: '26,280 observations (3 ans)',
      test_size: '720 observations (1 mois)',
      features: '15 variables (météo, calendrier, historique)',
      target: 'Consommation en MW',
    },
    rules: {
      max_submissions_per_day: 5,
      max_submissions_total: 30,
      max_file_size_mb: 200,
      allowed_formats: ['.pkl', '.joblib', '.h5'],
      timeout_minutes: 5,
    },
    stats: {
      participants_count: 89,
      submissions_count: 234,
      best_score: 12.45,
    },
    my_participation: {
      is_joined: true,
      my_best_score: 18.72,
      my_rank: 28,
      my_submissions_count: 8,
    },
    created_at: '2025-12-25T08:00:00Z',
    updated_at: '2026-01-15T16:45:00Z',
  },
  {
    id: '3',
    title: 'Analyse de Sentiments - Langues Africaines',
    slug: 'analyse-sentiments-langues-africaines',
    description_short: 'Développez un modèle NLP capable d\'analyser les sentiments dans des textes en français africain et langues locales.',
    description_full: `## Challenge NLP Multilingue

Premier challenge d'analyse de sentiments adapté aux langues africaines, incluant le français d'Afrique de l'Ouest et des expressions en fon, yoruba et dendi.

## Particularités

- Textes issus des réseaux sociaux
- Mélange de langues (code-switching)
- Expressions idiomatiques locales`,
    organizer: {
      id: '6',
      name: 'Club IA IFRI',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ClubIA',
    },
    status: 'upcoming',
    difficulty: 'intermediate',
    theme: 'nlp',
    start_date: '2026-03-01T00:00:00Z',
    end_date: '2026-04-15T23:59:59Z',
    registration_start: '2026-02-15T00:00:00Z',
    banner_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop',
    metrics: [
      { name: 'f1_macro', is_primary: true, weight: 1.0 },
      { name: 'accuracy', is_primary: false, weight: 0.5 },
    ],
    dataset_info: {
      train_size: '50,000 tweets',
      test_size: '10,000 tweets',
      features: 'Texte brut + métadonnées',
      target: '3 classes (positif, négatif, neutre)',
    },
    rules: {
      max_submissions_per_day: 8,
      max_submissions_total: 40,
      max_file_size_mb: 300,
      allowed_formats: ['.pkl', '.pt', '.onnx'],
      timeout_minutes: 8,
    },
    stats: {
      participants_count: 45,
      submissions_count: 0,
      best_score: 0,
    },
    created_at: '2026-01-05T12:00:00Z',
    updated_at: '2026-01-05T12:00:00Z',
  },
  {
    id: '4',
    title: 'Détection de Fraudes Bancaires',
    slug: 'detection-fraudes-bancaires',
    description_short: 'Identifiez les transactions frauduleuses dans un dataset de transactions bancaires anonymisées.',
    description_full: `## Contexte Sécurité Financière

Les institutions financières africaines font face à des défis croissants en matière de fraude. Ce challenge propose de développer des solutions de détection automatisée.

## Dataset

Transactions anonymisées avec labels de fraude confirmée.`,
    organizer: {
      id: '7',
      name: 'Banque Atlantique',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Banque',
    },
    status: 'finished',
    difficulty: 'advanced',
    theme: 'classification',
    start_date: '2025-10-01T00:00:00Z',
    end_date: '2025-12-15T23:59:59Z',
    registration_start: '2025-09-15T00:00:00Z',
    banner_image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=400&fit=crop',
    metrics: [
      { name: 'auc_roc', is_primary: true, weight: 1.0 },
      { name: 'precision', is_primary: false, weight: 0.7 },
      { name: 'recall', is_primary: false, weight: 0.5 },
    ],
    dataset_info: {
      train_size: '284,807 transactions',
      test_size: '50,000 transactions',
      features: '30 variables (anonymisées via PCA)',
      target: 'Binaire (fraude/légitime)',
    },
    rules: {
      max_submissions_per_day: 5,
      max_submissions_total: 25,
      max_file_size_mb: 100,
      allowed_formats: ['.pkl', '.joblib'],
      timeout_minutes: 3,
    },
    stats: {
      participants_count: 156,
      submissions_count: 892,
      best_score: 0.9823,
    },
    created_at: '2025-09-01T10:00:00Z',
    updated_at: '2025-12-16T00:00:00Z',
  },
  {
    id: '5',
    title: 'Reconnaissance de Plantes Médicinales',
    slug: 'reconnaissance-plantes-medicinales',
    description_short: 'Créez un modèle de vision capable d\'identifier les plantes médicinales traditionnelles béninoises.',
    description_full: `## Pharmacopée Traditionnelle

Ce challenge unique vise à numériser le savoir traditionnel en créant un outil d'identification des plantes médicinales.

## Objectif

Classifier des images de feuilles et plantes en 50 espèces différentes utilisées dans la médecine traditionnelle.`,
    organizer: {
      id: '8',
      name: 'Centre de Recherche en Phytothérapie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phyto',
    },
    status: 'active',
    difficulty: 'beginner',
    theme: 'vision',
    start_date: '2026-02-01T00:00:00Z',
    end_date: '2026-03-31T23:59:59Z',
    registration_start: '2026-01-20T00:00:00Z',
    banner_image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&h=400&fit=crop',
    metrics: [
      { name: 'accuracy', is_primary: true, weight: 1.0 },
      { name: 'top5_accuracy', is_primary: false, weight: 0.3 },
    ],
    dataset_info: {
      train_size: '25,000 images',
      test_size: '5,000 images',
      features: 'Images 224x224 RGB',
      target: '50 espèces de plantes',
    },
    rules: {
      max_submissions_per_day: 15,
      max_submissions_total: 100,
      max_file_size_mb: 400,
      allowed_formats: ['.pkl', '.h5', '.pt', '.onnx', '.tflite'],
      timeout_minutes: 15,
    },
    stats: {
      participants_count: 78,
      submissions_count: 312,
      best_score: 0.912,
    },
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: '6',
    title: 'Prévision des Rendements Agricoles',
    slug: 'prevision-rendements-agricoles',
    description_short: 'Prédisez les rendements de cultures vivrières à partir de données satellite et météorologiques.',
    description_full: `## Agriculture de Précision

Utilisez des données satellite Sentinel-2 et des séries temporelles météo pour prédire les rendements agricoles.`,
    organizer: {
      id: '9',
      name: 'Ministère de l\'Agriculture',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinAgri',
    },
    status: 'upcoming',
    difficulty: 'advanced',
    theme: 'regression',
    start_date: '2026-04-01T00:00:00Z',
    end_date: '2026-06-30T23:59:59Z',
    registration_start: '2026-03-15T00:00:00Z',
    banner_image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=400&fit=crop',
    metrics: [
      { name: 'mape', is_primary: true, weight: 1.0 },
      { name: 'rmse', is_primary: false, weight: 0.5 },
    ],
    dataset_info: {
      train_size: '5,000 parcelles sur 5 ans',
      test_size: '1,000 parcelles',
      features: 'NDVI, température, précipitations, type de sol',
      target: 'Rendement en tonnes/hectare',
    },
    rules: {
      max_submissions_per_day: 3,
      max_submissions_total: 20,
      max_file_size_mb: 250,
      allowed_formats: ['.pkl', '.joblib', '.h5'],
      timeout_minutes: 10,
    },
    stats: {
      participants_count: 12,
      submissions_count: 0,
      best_score: 0,
    },
    created_at: '2026-01-20T14:00:00Z',
    updated_at: '2026-01-20T14:00:00Z',
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 's1',
    event_id: '1',
    event_title: 'Challenge Classification Images Médicales',
    user_id: '1',
    user_name: 'Jean Participant',
    file_name: 'resnet50_finetuned.pkl',
    file_size: 95000000,
    status: 'evaluated',
    score: 0.892,
    rank: 15,
    metrics: { accuracy: 0.892, f1_score: 0.887, precision: 0.895 },
    submitted_at: '2026-01-25T14:30:00Z',
    evaluated_at: '2026-01-25T14:35:00Z',
  },
  {
    id: 's2',
    event_id: '1',
    event_title: 'Challenge Classification Images Médicales',
    user_id: '1',
    user_name: 'Jean Participant',
    file_name: 'efficientnet_b4.h5',
    file_size: 120000000,
    status: 'evaluated',
    score: 0.878,
    rank: 22,
    metrics: { accuracy: 0.878, f1_score: 0.871, precision: 0.882 },
    submitted_at: '2026-01-24T10:15:00Z',
    evaluated_at: '2026-01-24T10:22:00Z',
  },
  {
    id: 's3',
    event_id: '2',
    event_title: 'Prédiction de la Demande Énergétique',
    user_id: '1',
    user_name: 'Jean Participant',
    file_name: 'xgboost_model.pkl',
    file_size: 15000000,
    status: 'evaluated',
    score: 18.72,
    rank: 28,
    metrics: { rmse: 18.72, mae: 14.5, r2: 0.91 },
    submitted_at: '2026-01-28T09:00:00Z',
    evaluated_at: '2026-01-28T09:03:00Z',
  },
  {
    id: 's4',
    event_id: '1',
    event_title: 'Challenge Classification Images Médicales',
    user_id: '1',
    user_name: 'Jean Participant',
    file_name: 'vit_base.pt',
    file_size: 340000000,
    status: 'processing',
    submitted_at: '2026-02-05T16:45:00Z',
  },
];

export const mockLeaderboard: Record<string, LeaderboardEntry[]> = {
  '1': [
    { rank: 1, user_id: 'u10', user_name: 'Dr. Mensah', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mensah', best_score: 0.947, submissions_count: 42, last_submission: '2026-02-04T18:00:00Z' },
    { rank: 2, user_id: 'u11', user_name: 'Aminata Diallo', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aminata', best_score: 0.941, submissions_count: 38, last_submission: '2026-02-04T12:00:00Z' },
    { rank: 3, user_id: 'u12', user_name: 'Team ENSAE', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ENSAE', best_score: 0.938, submissions_count: 50, last_submission: '2026-02-05T08:00:00Z' },
    { rank: 4, user_id: 'u13', user_name: 'Kofi Asante', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi', best_score: 0.932, submissions_count: 31, last_submission: '2026-02-03T15:00:00Z' },
    { rank: 5, user_id: 'u14', user_name: 'Fatou Sow', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatou', best_score: 0.928, submissions_count: 27, last_submission: '2026-02-04T20:00:00Z' },
    { rank: 6, user_id: 'u15', user_name: 'Ibrahim Ouedraogo', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim', best_score: 0.925, submissions_count: 45, last_submission: '2026-02-05T06:00:00Z' },
    { rank: 7, user_id: 'u16', user_name: 'Grace Okonkwo', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace', best_score: 0.921, submissions_count: 22, last_submission: '2026-02-02T14:00:00Z' },
    { rank: 8, user_id: 'u17', user_name: 'Moussa Keita', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa', best_score: 0.918, submissions_count: 35, last_submission: '2026-02-04T16:00:00Z' },
    { rank: 9, user_id: 'u18', user_name: 'Aïcha Touré', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aicha', best_score: 0.915, submissions_count: 19, last_submission: '2026-02-03T11:00:00Z' },
    { rank: 10, user_id: 'u19', user_name: 'David Mensah', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', best_score: 0.912, submissions_count: 28, last_submission: '2026-02-04T09:00:00Z' },
    { rank: 15, user_id: '1', user_name: 'Jean Participant', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean', best_score: 0.892, submissions_count: 23, last_submission: '2026-01-25T14:30:00Z' },
  ],
  '2': [
    { rank: 1, user_id: 'u20', user_name: 'Prof. Yao', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yao', best_score: 12.45, submissions_count: 28, last_submission: '2026-02-05T10:00:00Z' },
    { rank: 2, user_id: 'u21', user_name: 'Équipe Énergie UAC', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UAC', best_score: 13.21, submissions_count: 30, last_submission: '2026-02-04T22:00:00Z' },
    { rank: 3, user_id: 'u22', user_name: 'Seydou Traoré', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seydou', best_score: 14.08, submissions_count: 25, last_submission: '2026-02-03T18:00:00Z' },
  ],
};
