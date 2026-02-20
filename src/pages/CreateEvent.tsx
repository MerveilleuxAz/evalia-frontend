import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  FileText,
  Settings,
  Upload,
  Image,
  X,
  Plus,
  Trash2,
  Save,
  Eye,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const STEPS = [
  { id: 1, title: 'Informations', icon: FileText },
  { id: 2, title: 'Calendrier', icon: Calendar },
  { id: 3, title: 'Données', icon: Upload },
  { id: 4, title: 'Règles', icon: Settings },
];

const THEMES = [
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Régression' },
  { value: 'nlp', label: 'NLP (Traitement du langage)' },
  { value: 'vision', label: 'Vision par ordinateur' },
  { value: 'other', label: 'Autre' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Débutant', description: 'Idéal pour découvrir le ML' },
  { value: 'intermediate', label: 'Intermédiaire', description: 'Nécessite des bases solides' },
  { value: 'advanced', label: 'Avancé', description: 'Pour les experts' },
];

const METRICS = {
  classification: [
    { id: 'accuracy', name: 'Accuracy', description: 'Proportion de prédictions correctes' },
    { id: 'precision', name: 'Precision', description: 'Proportion de vrais positifs parmi les positifs prédits' },
    { id: 'recall', name: 'Recall', description: 'Proportion de vrais positifs détectés' },
    { id: 'f1_score', name: 'F1 Score', description: 'Moyenne harmonique de precision et recall' },
    { id: 'auc_roc', name: 'AUC-ROC', description: 'Aire sous la courbe ROC' },
  ],
  regression: [
    { id: 'rmse', name: 'RMSE', description: 'Racine de l\'erreur quadratique moyenne' },
    { id: 'mae', name: 'MAE', description: 'Erreur absolue moyenne' },
    { id: 'r2', name: 'R²', description: 'Coefficient de détermination' },
    { id: 'mape', name: 'MAPE', description: 'Erreur absolue moyenne en pourcentage' },
  ],
};

const FILE_FORMATS = [
  { id: 'pkl', label: '.pkl (Pickle)', description: 'Scikit-learn' },
  { id: 'h5', label: '.h5 (HDF5)', description: 'Keras/TensorFlow' },
  { id: 'pt', label: '.pt (PyTorch)', description: 'PyTorch' },
  { id: 'onnx', label: '.onnx', description: 'Format universel' },
  { id: 'joblib', label: '.joblib', description: 'Scikit-learn optimisé' },
];

interface EventFormData {
  // Step 1: General Info
  title: string;
  description_short: string;
  description_full: string;
  banner_image: File | null;
  theme: string;
  difficulty: string;

  // Step 2: Calendar
  registration_start: string;
  start_date: string;
  end_date: string;
  results_date: string;
  max_participants: number | null;
  is_private: boolean;
  access_code: string;

  // Step 3: Data & Metrics
  train_dataset: File | null;
  test_dataset: File | null;
  dataset_description: string;
  selected_metrics: string[];
  primary_metric: string;

  // Step 4: Rules
  allowed_formats: string[];
  max_submissions_per_day: number;
  max_submissions_total: number;
  max_file_size_mb: number;
  timeout_minutes: number;
  custom_rules: string;
  prizes: string;
}

const initialFormData: EventFormData = {
  title: '',
  description_short: '',
  description_full: '',
  banner_image: null,
  theme: '',
  difficulty: '',
  registration_start: '',
  start_date: '',
  end_date: '',
  results_date: '',
  max_participants: null,
  is_private: false,
  access_code: '',
  train_dataset: null,
  test_dataset: null,
  dataset_description: '',
  selected_metrics: [],
  primary_metric: '',
  allowed_formats: ['pkl', 'h5', 'pt'],
  max_submissions_per_day: 10,
  max_submissions_total: 50,
  max_file_size_mb: 500,
  timeout_minutes: 10,
  custom_rules: '',
  prizes: '',
};

export default function CreateEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const updateFormData = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData('banner_image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    updateFormData('banner_image', null);
    setBannerPreview(null);
  };

  const toggleMetric = (metricId: string) => {
    const current = formData.selected_metrics;
    if (current.includes(metricId)) {
      updateFormData('selected_metrics', current.filter(m => m !== metricId));
      if (formData.primary_metric === metricId) {
        updateFormData('primary_metric', '');
      }
    } else {
      updateFormData('selected_metrics', [...current, metricId]);
    }
  };

  const toggleFormat = (formatId: string) => {
    const current = formData.allowed_formats;
    if (current.includes(formatId)) {
      updateFormData('allowed_formats', current.filter(f => f !== formatId));
    } else {
      updateFormData('allowed_formats', [...current, formatId]);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.description_short || !formData.theme || !formData.difficulty) {
          toast({
            title: "Champs requis",
            description: "Veuillez remplir tous les champs obligatoires.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.registration_start || !formData.start_date || !formData.end_date) {
          toast({
            title: "Dates requises",
            description: "Veuillez définir les dates de l'événement.",
            variant: "destructive"
          });
          return false;
        }
        if (new Date(formData.start_date) >= new Date(formData.end_date)) {
          toast({
            title: "Dates invalides",
            description: "La date de fin doit être postérieure à la date de début.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        if (formData.selected_metrics.length === 0 || !formData.primary_metric) {
          toast({
            title: "Métriques requises",
            description: "Sélectionnez au moins une métrique et définissez la métrique principale.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 4:
        if (formData.allowed_formats.length === 0) {
          toast({
            title: "Formats requis",
            description: "Sélectionnez au moins un format de fichier accepté.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Événement créé !",
      description: "Votre événement a été créé avec succès.",
    });
    
    navigate('/events');
  };

  const saveDraft = () => {
    localStorage.setItem('eventDraft', JSON.stringify(formData));
    toast({
      title: "Brouillon sauvegardé",
      description: "Vous pouvez reprendre la création plus tard.",
    });
  };

  const availableMetrics = formData.theme === 'regression' ? METRICS.regression : METRICS.classification;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux événements
          </Button>
          <h1 className="text-3xl font-display font-bold mb-2">
            Créer un nouvel événement
          </h1>
          <p className="text-muted-foreground">
            Configurez votre compétition IA en quelques étapes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : isActive
                          ? 'bg-primary/20 text-primary border-2 border-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${
                        currentStep > step.id ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: General Info */}
            {currentStep === 1 && (
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                  <CardDescription>
                    Décrivez votre événement de compétition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de l'événement *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Challenge Classification Images Médicales"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                    />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description_short">
                      Description courte * 
                      <span className="text-muted-foreground text-xs ml-2">
                        ({formData.description_short.length}/500)
                      </span>
                    </Label>
                    <Textarea
                      id="description_short"
                      placeholder="Résumez le challenge en quelques phrases..."
                      value={formData.description_short}
                      onChange={(e) => updateFormData('description_short', e.target.value.slice(0, 500))}
                      rows={3}
                    />
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description_full">
                      Description complète
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 inline ml-2 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supporte le format Markdown</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Textarea
                      id="description_full"
                      placeholder="## Contexte&#10;&#10;Décrivez le problème en détail...&#10;&#10;## Objectifs&#10;&#10;..."
                      value={formData.description_full}
                      onChange={(e) => updateFormData('description_full', e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* Banner Image */}
                  <div className="space-y-2">
                    <Label>Image de bannière</Label>
                    {bannerPreview ? (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeBanner}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Image className="h-12 w-12 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Cliquez pour uploader une image
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG jusqu'à 5MB
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleBannerUpload}
                        />
                      </label>
                    )}
                  </div>

                  {/* Theme & Difficulty */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Thématique *</Label>
                      <Select
                        value={formData.theme}
                        onValueChange={(value) => {
                          updateFormData('theme', value);
                          updateFormData('selected_metrics', []);
                          updateFormData('primary_metric', '');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {THEMES.map(theme => (
                            <SelectItem key={theme.value} value={theme.value}>
                              {theme.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Difficulté *</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => updateFormData('difficulty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {DIFFICULTIES.map(diff => (
                            <SelectItem key={diff.value} value={diff.value}>
                              <div>
                                <span>{diff.label}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  - {diff.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Calendar */}
            {currentStep === 2 && (
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Calendrier et participants</CardTitle>
                  <CardDescription>
                    Définissez les dates et les conditions de participation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registration_start">Début des inscriptions *</Label>
                      <Input
                        id="registration_start"
                        type="datetime-local"
                        value={formData.registration_start}
                        onChange={(e) => updateFormData('registration_start', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start_date">Début de la compétition *</Label>
                      <Input
                        id="start_date"
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => updateFormData('start_date', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">Fin de la compétition *</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => updateFormData('end_date', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="results_date">Annonce des résultats</Label>
                      <Input
                        id="results_date"
                        type="datetime-local"
                        value={formData.results_date}
                        onChange={(e) => updateFormData('results_date', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Max Participants */}
                  <div className="space-y-2">
                    <Label htmlFor="max_participants">
                      Nombre maximum de participants
                      <span className="text-muted-foreground text-xs ml-2">
                        (laisser vide pour illimité)
                      </span>
                    </Label>
                    <Input
                      id="max_participants"
                      type="number"
                      min="1"
                      placeholder="Illimité"
                      value={formData.max_participants || ''}
                      onChange={(e) => updateFormData('max_participants', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>

                  {/* Private Event */}
                  <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="is_private" className="cursor-pointer">
                          Événement privé
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Seuls les participants avec le code d'accès pourront rejoindre
                        </p>
                      </div>
                      <Switch
                        id="is_private"
                        checked={formData.is_private}
                        onCheckedChange={(checked) => updateFormData('is_private', checked)}
                      />
                    </div>

                    {formData.is_private && (
                      <div className="space-y-2">
                        <Label htmlFor="access_code">Code d'accès</Label>
                        <Input
                          id="access_code"
                          placeholder="Ex: EVALIA2026"
                          value={formData.access_code}
                          onChange={(e) => updateFormData('access_code', e.target.value.toUpperCase())}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Data & Metrics */}
            {currentStep === 3 && (
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Données et métriques</CardTitle>
                  <CardDescription>
                    Configurez les datasets et les critères d'évaluation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dataset Upload */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dataset d'entraînement</Label>
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        {formData.train_dataset ? (
                          <span className="text-sm text-primary">
                            {formData.train_dataset.name}
                          </span>
                        ) : (
                          <>
                            <span className="text-sm text-muted-foreground">
                              Uploader le dataset train
                            </span>
                            <span className="text-xs text-muted-foreground">
                              CSV, ZIP
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv,.zip"
                          onChange={(e) => updateFormData('train_dataset', e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Dataset de test
                        <span className="text-muted-foreground text-xs ml-2">
                          (privé)
                        </span>
                      </Label>
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        {formData.test_dataset ? (
                          <span className="text-sm text-primary">
                            {formData.test_dataset.name}
                          </span>
                        ) : (
                          <>
                            <span className="text-sm text-muted-foreground">
                              Uploader le dataset test
                            </span>
                            <span className="text-xs text-muted-foreground">
                              CSV, ZIP
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv,.zip"
                          onChange={(e) => updateFormData('test_dataset', e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Dataset Description */}
                  <div className="space-y-2">
                    <Label htmlFor="dataset_description">Description du dataset</Label>
                    <Textarea
                      id="dataset_description"
                      placeholder="Décrivez les colonnes, types de données, format attendu..."
                      value={formData.dataset_description}
                      onChange={(e) => updateFormData('dataset_description', e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Metrics Selection */}
                  <div className="space-y-4">
                    <Label>Métriques d'évaluation *</Label>
                    {!formData.theme ? (
                      <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                        Sélectionnez d'abord une thématique à l'étape 1 pour voir les métriques disponibles.
                      </p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-3">
                        {availableMetrics.map(metric => {
                          const isSelected = formData.selected_metrics.includes(metric.id);
                          const isPrimary = formData.primary_metric === metric.id;

                          return (
                            <div
                              key={metric.id}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? isPrimary
                                    ? 'border-primary bg-primary/10'
                                    : 'border-primary/50 bg-primary/5'
                                  : 'border-border hover:border-primary/30'
                              }`}
                              onClick={() => toggleMetric(metric.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{metric.name}</span>
                                    {isPrimary && (
                                      <Badge variant="default" className="text-xs">
                                        Principal
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {metric.description}
                                  </p>
                                </div>
                                <Checkbox checked={isSelected} />
                              </div>
                              {isSelected && !isPrimary && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateFormData('primary_metric', metric.id);
                                  }}
                                >
                                  Définir comme principal
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Rules */}
            {currentStep === 4 && (
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Règles et quotas</CardTitle>
                  <CardDescription>
                    Définissez les contraintes de soumission et le règlement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Allowed Formats */}
                  <div className="space-y-3">
                    <Label>Formats de modèles acceptés *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {FILE_FORMATS.map(format => {
                        const isSelected = formData.allowed_formats.includes(format.id);

                        return (
                          <div
                            key={format.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/30'
                            }`}
                            onClick={() => toggleFormat(format.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox checked={isSelected} />
                              <div>
                                <span className="font-medium text-sm">{format.label}</span>
                                <p className="text-xs text-muted-foreground">
                                  {format.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quotas */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_submissions_per_day">Soumissions par jour</Label>
                      <Input
                        id="max_submissions_per_day"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.max_submissions_per_day}
                        onChange={(e) => updateFormData('max_submissions_per_day', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_submissions_total">Soumissions totales</Label>
                      <Input
                        id="max_submissions_total"
                        type="number"
                        min="1"
                        value={formData.max_submissions_total}
                        onChange={(e) => updateFormData('max_submissions_total', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_file_size_mb">Taille max fichier (MB)</Label>
                      <Input
                        id="max_file_size_mb"
                        type="number"
                        min="1"
                        max="2000"
                        value={formData.max_file_size_mb}
                        onChange={(e) => updateFormData('max_file_size_mb', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeout_minutes">Timeout évaluation (min)</Label>
                      <Input
                        id="timeout_minutes"
                        type="number"
                        min="1"
                        max="60"
                        value={formData.timeout_minutes}
                        onChange={(e) => updateFormData('timeout_minutes', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Custom Rules */}
                  <div className="space-y-2">
                    <Label htmlFor="custom_rules">
                      Règlement personnalisé
                      <span className="text-muted-foreground text-xs ml-2">
                        (Markdown supporté)
                      </span>
                    </Label>
                    <Textarea
                      id="custom_rules"
                      placeholder="## Règles de participation&#10;&#10;- Ne pas partager les solutions...&#10;- ..."
                      value={formData.custom_rules}
                      onChange={(e) => updateFormData('custom_rules', e.target.value)}
                      rows={5}
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* Prizes */}
                  <div className="space-y-2">
                    <Label htmlFor="prizes">Prix et récompenses (optionnel)</Label>
                    <Textarea
                      id="prizes"
                      placeholder="1er prix : ...&#10;2ème prix : ...&#10;3ème prix : ..."
                      value={formData.prizes}
                      onChange={(e) => updateFormData('prizes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
            )}
            <Button variant="ghost" onClick={saveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder brouillon
            </Button>
          </div>

          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-[180px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Créer l'événement
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
