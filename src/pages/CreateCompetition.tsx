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
  Save,
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
import { useCreateCompetition } from '@/hooks/useApi';

const STEPS = [
  { id: 1, title: 'Informations', icon: FileText },
  { id: 2, title: 'Calendrier', icon: Calendar },
  { id: 3, title: 'Données', icon: Upload },
  { id: 4, title: 'Règles', icon: Settings },
];

const THEMES = [
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Régression' },
  { value: 'clustering', label: 'Clustering' },
  { value: 'nlp', label: 'NLP (Traitement du langage)' },
  { value: 'computer_vision', label: 'Vision par ordinateur' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Débutant', description: 'Idéal pour découvrir le ML' },
  { value: 'intermediate', label: 'Intermédiaire', description: 'Nécessite des bases solides' },
  { value: 'advanced', label: 'Avancé', description: 'Pour les experts' },
];

const METRICS: Record<string, { id: string, name: string, description: string }[]> = {
  classification: [
    { id: 'accuracy', name: 'Accuracy', description: 'Proportion de prédictions correctes' },
    { id: 'f1_score', name: 'F1 Score', description: 'Moyenne harmonique de precision et recall' },
    { id: 'precision', name: 'Precision', description: 'Proportion de vrais positifs parmi les positifs prédits' },
    { id: 'recall', name: 'Recall', description: 'Proportion de vrais positifs détectés' },
    { id: 'auc_roc', name: 'AUC-ROC', description: 'Aire sous la courbe ROC' },
    { id: 'log_loss', name: 'Log Loss', description: 'Perte logarithmique' },
  ],
  regression: [
    { id: 'rmse', name: 'RMSE', description: 'Racine de l\'erreur quadratique moyenne' },
    { id: 'mae', name: 'MAE', description: 'Erreur absolue moyenne' },
    { id: 'r2', name: 'R²', description: 'Coefficient de détermination' },
    { id: 'mape', name: 'MAPE', description: 'Erreur absolue moyenne en pourcentage' },
  ],
  clustering: [
    { id: 'accuracy', name: 'Accuracy', description: 'Proportion de prédictions correctes' },
  ],
  nlp: [
    { id: 'accuracy', name: 'Accuracy', description: 'Proportion de prédictions correctes' },
    { id: 'f1_score', name: 'F1 Score', description: 'Moyenne harmonique de precision et recall' },
  ],
  computer_vision: [
    { id: 'accuracy', name: 'Accuracy', description: 'Proportion de prédictions correctes' },
  ]
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
  slug: string;
  title: string;
  description: string; // Mapping to backend 'description'
  banner_image: File | null;
  task_type: string; // Mapping to backend 'task_type'
  difficulty: string;

  // Step 2: Calendar
  start_date: string;
  end_date: string;

  // Step 3: Data & Metrics
  raw_dataset: File | null; // Mapping to backend 'raw_dataset'
  processed_dataset: File | null; // Mapping to backend 'processed_dataset'
  primary_metric: string;

  // Step 4: Rules
  max_submissions_per_day: number;
  max_submissions_total: number;
}

const initialFormData: EventFormData = {
  slug: '',
  title: '',
  description: '',
  banner_image: null,
  task_type: '',
  difficulty: '',
  start_date: '',
  end_date: '',
  raw_dataset: null,
  processed_dataset: null,
  primary_metric: '',
  max_submissions_per_day: 10,
  max_submissions_total: 50,
};

export default function CreateCompetition() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const createCompetition = useCreateCompetition();
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const updateFormData = (field: keyof EventFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate slug from title if slug hasn't been manually edited or is empty
      if (field === 'title' && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))) {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      
      return newData;
    });
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
    updateFormData('primary_metric', metricId);
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
        if (!formData.title || !formData.slug || !formData.description || !formData.task_type) {
          toast({
            title: "Champs requis",
            description: "Veuillez remplir le titre, le slug, la description et la thématique.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.start_date || !formData.end_date) {
          toast({
            title: "Dates requises",
            description: "Veuillez définir les dates de début et de fin.",
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
        if (!formData.primary_metric) {
          toast({
            title: "Métrique requise",
            description: "Veuillez sélectionner la métrique principale.",
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    try {
      const submissionData = new FormData();
      submissionData.append('slug', formData.slug);
      submissionData.append('title', formData.title);
      submissionData.append('description', formData.description);
      submissionData.append('task_type', formData.task_type);
      submissionData.append('primary_metric', formData.primary_metric);
      submissionData.append('start_date', new Date(formData.start_date).toISOString());
      submissionData.append('end_date', new Date(formData.end_date).toISOString());
      submissionData.append('max_submissions_per_day', formData.max_submissions_per_day.toString());
      submissionData.append('max_submissions_total', formData.max_submissions_total.toString());
      
      if (formData.raw_dataset) {
        submissionData.append('raw_dataset', formData.raw_dataset);
      }
      if (formData.processed_dataset) {
        submissionData.append('processed_dataset', formData.processed_dataset);
      }
      
      // Note: banner_image is kept but might not be supported yet by the backend base API
      if (formData.banner_image) {
        submissionData.append('banner_image', formData.banner_image);
      }

      await createCompetition.mutateAsync(submissionData);
      
      toast({
        title: "Compétition créé !",
        description: "Votre compétition a été créée avec succès.",
      });
      
      navigate('/my-competitions');
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur est survenue lors de la création de l'compétition.",
        variant: "destructive"
      });
    }
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
            onClick={() => navigate('/competitions')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux compétitions
          </Button>
          <h1 className="text-3xl font-display font-bold mb-2">
            Créer un nouvel compétition
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
                    Décrivez votre compétition de compétition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre de l'compétition *</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Challenge Classification Images Médicales"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug ID *</Label>
                      <Input
                        id="slug"
                        placeholder="Ex: classification-medicale-2024"
                        value={formData.slug}
                        onChange={(e) => updateFormData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                      />
                      <p className="text-[10px] text-muted-foreground">Utilisé dans l'URL de votre compétition.</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description complète *
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
                      id="description"
                      placeholder="## Contexte&#10;&#10;Décrivez le problème en détail...&#10;&#10;## Objectifs&#10;&#10;..."
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* Banner Image */}
                  <div className="space-y-2">
                    <Label>Image de bannière (Illustration)</Label>
                    {bannerPreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-border">
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
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Image className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Cliquez pour uploader une image
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

                  {/* Task Type */}
                  <div className="space-y-2">
                    <Label>Thématique (Task Type) *</Label>
                    <Select
                      value={formData.task_type}
                      onValueChange={(value) => {
                        updateFormData('task_type', value);
                        updateFormData('primary_metric', '');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type de tâche..." />
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
                      <Label htmlFor="start_date">Date de début *</Label>
                      <Input
                        id="start_date"
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => updateFormData('start_date', e.target.value)}
                      />
                    </div>
 
                    <div className="space-y-2">
                      <Label htmlFor="end_date">Date de fin (clôture) *</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => updateFormData('end_date', e.target.value)}
                      />
                    </div>
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
                      <Label>Dataset d'entraînement (Public)</Label>
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        {formData.raw_dataset ? (
                          <span className="text-sm text-primary">
                            {formData.raw_dataset.name}
                          </span>
                        ) : (
                          <>
                            <span className="text-sm text-muted-foreground">
                              Uploader raw_dataset
                            </span>
                            <span className="text-xs text-muted-foreground">
                               CSV, XLSX, JSON, Parquet
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => updateFormData('raw_dataset', e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
 
                    <div className="space-y-2">
                      <Label>
                        Vérité terrain (Privé - Pour évaluation)
                      </Label>
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        {formData.processed_dataset ? (
                          <span className="text-sm text-primary">
                            {formData.processed_dataset.name}
                          </span>
                        ) : (
                          <>
                            <span className="text-sm text-muted-foreground">
                              Uploader processed_dataset
                            </span>
                            <span className="text-xs text-muted-foreground">
                              CSV, XLSX, JSON, Parquet
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => updateFormData('processed_dataset', e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>
 
                  {/* Metrics Selection */}
                  <div className="space-y-4">
                    <Label>Métrique principale d'évaluation *</Label>
                    {!formData.task_type ? (
                      <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                        Sélectionnez d'abord un type de tâche à l'étape 1.
                      </p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-3">
                        {METRICS[formData.task_type]?.map(metric => {
                          const isPrimary = formData.primary_metric === metric.id;
 
                          return (
                            <div
                              key={metric.id}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                isPrimary
                                    ? 'border-primary bg-primary/10'
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
                                        Sélectionnée
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {metric.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Quotas */}
            {currentStep === 4 && (
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Quotas et contraintes</CardTitle>
                  <CardDescription>
                    Définissez les limites de soumission pour les participants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="max_sub_day">Soumissions max par jour</Label>
                      <Input
                        id="max_sub_day"
                        type="number"
                        min="1"
                        value={formData.max_submissions_per_day}
                        onChange={(e) => updateFormData('max_submissions_per_day', parseInt(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground italic">Défaut: 10</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_sub_total">Soumissions max totales</Label>
                      <Input
                        id="max_sub_total"
                        type="number"
                        min="1"
                        value={formData.max_submissions_total}
                        onChange={(e) => updateFormData('max_submissions_total', parseInt(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground italic">Défaut: 50</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note :</strong> Ces paramètres aident à prévenir le surapprentissage (overfitting) et garantissent l'équité entre les participants.
                    </p>
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
                disabled={createCompetition.isPending}
                className="min-w-[180px]"
              >
                {createCompetition.isPending ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Créer l'compétition
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
