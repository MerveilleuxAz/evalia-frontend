import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileCode, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Info,
  X,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCompetitions } from '@/context/CompetitionContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MODEL_TYPES = [
  { value: 'sklearn', label: 'Scikit-learn', extensions: ['.pkl', '.joblib'] },
  { value: 'tensorflow', label: 'TensorFlow / Keras', extensions: ['.h5'] },
  { value: 'pytorch', label: 'PyTorch', extensions: ['.pt'] },
  { value: 'onnx', label: 'ONNX', extensions: ['.onnx'] },
];

const AUTO_DETECT: Record<string, string> = {
  pkl: 'sklearn', joblib: 'sklearn',
  h5: 'tensorflow',
  pt: 'pytorch',
  onnx: 'onnx',
};

const statusBadge: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  pending:    { label: 'En attente',    className: 'bg-warning/10 text-warning',         icon: Clock },
  processing: { label: 'Évaluation...', className: 'bg-primary/10 text-primary',         icon: RefreshCw },
  completed:  { label: 'Évalué',        className: 'bg-success/10 text-success',         icon: CheckCircle },
  evaluated:  { label: 'Évalué',        className: 'bg-success/10 text-success',         icon: CheckCircle },
  error:      { label: 'Erreur',        className: 'bg-destructive/10 text-destructive', icon: AlertCircle },
};

export default function CompetitionSubmit() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const { currentCompetition, submissions, loading, fetchCompetitionById, fetchSubmissions, submitModel } = useCompetitions();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelType, setModelType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/competitions/${competitionId}/submit` } });
      return;
    }
    if (competitionId) {
      fetchCompetitionById(competitionId);
      fetchSubmissions(competitionId);
    }
  }, [competitionId, isAuthenticated, navigate, fetchCompetitionById, fetchSubmissions]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleFile = (file: File) => {
    if (!currentCompetition) return;
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = currentCompetition.config?.allowed_formats;
    if (allowed && !allowed.includes(ext)) {
      toast({ title: 'Format non supporté', description: `Formats acceptés : ${allowed.join(', ')}`, variant: 'destructive' });
      return;
    }
    if (currentCompetition.config?.max_file_size_mb && file.size > currentCompetition.config.max_file_size_mb * 1024 * 1024) {
      toast({ title: 'Fichier trop volumineux', description: `Taille max : ${currentCompetition.config.max_file_size_mb} MB`, variant: 'destructive' });
      return;
    }
    const extKey = file.name.split('.').pop()?.toLowerCase() || '';
    const detected = AUTO_DETECT[extKey];
    if (detected) setModelType(detected);
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !competitionId || !modelType) {
      toast({ title: 'Champs manquants', description: 'Sélectionnez un fichier et un type de modèle.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      await submitModel(competitionId, selectedFile, modelType);
      toast({ title: '🚀 Soumission lancée !', description: "Votre modèle est en cours d'évaluation." });
      setSelectedFile(null);
      setModelType('');
      fetchSubmissions(competitionId);
    } catch (error: any) {
      toast({ title: 'Erreur de soumission', description: error?.message || 'Une erreur est survenue.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentCompetition) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const competition = currentCompetition;
  const mySubmissions = submissions || [];
  const today = new Date().toDateString();
  const dailySubmissions = mySubmissions.filter((s: any) =>
    new Date(s.created_at || s.submitted_at).toDateString() === today
  ).length;
  const maxPerDay = competition.config?.max_submissions_per_day ?? Infinity;
  const maxTotal = competition.config?.max_submissions_total ?? Infinity;
  const totalUsed = competition.my_participation?.my_submissions_count ?? mySubmissions.length;
  const canSubmit = competition.status === 'active'
    && competition.my_participation?.is_joined
    && dailySubmissions < maxPerDay
    && totalUsed < maxTotal;

  if (!competition.my_participation?.is_joined) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Inscription requise</h2>
            <p className="text-muted-foreground mb-6">
              Vous devez d'abord rejoindre cette compétition avant de pouvoir soumettre un modèle.
            </p>
            <Button asChild><Link to={`/competitions/${competitionId}`}>Voir la compétition</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (competition.status !== 'active') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Soumissions fermées</h2>
            <p className="text-muted-foreground mb-6">Cette compétition n'accepte plus de soumissions.</p>
            <Button asChild><Link to={`/competitions/${competitionId}`}>Voir les résultats</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="relative py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/competitions" className="hover:text-foreground">Compétitions</Link>
            <span>/</span>
            <Link to={`/competitions/${competitionId}`} className="hover:text-foreground">{competition.title}</Link>
            <span>/</span>
            <span className="text-foreground">Soumettre</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold mb-1">Soumettre un modèle</h1>
              <p className="text-muted-foreground">{competition.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Quota aujourd'hui</p>
              <p className="text-lg font-bold">
                <span className={dailySubmissions >= maxPerDay ? 'text-destructive' : 'text-foreground'}>{dailySubmissions}</span>
                <span className="text-muted-foreground"> / {maxPerDay}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Zone */}
            <div className="lg:col-span-2 space-y-6">
              {!canSubmit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Quota atteint</AlertTitle>
                  <AlertDescription>
                    Vous avez atteint votre limite de soumissions. Réessayez demain.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Upload de modèle</CardTitle>
                  <CardDescription>Glissez-déposez votre fichier ou cliquez pour sélectionner</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Type de modèle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      Type de modèle
                    </label>
                    <Select value={modelType} onValueChange={setModelType} disabled={!canSubmit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le framework de votre modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        {MODEL_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>
                            <div className="flex items-center gap-2">
                              <span>{t.label}</span>
                              <span className="text-xs text-muted-foreground">{t.extensions.join(', ')}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Zone de drop */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-xl p-12 text-center transition-all
                      ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                      ${!canSubmit ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                    `}
                  >
                    <input
                      type="file"
                      accept={(competition.config?.allowed_formats || []).join(',')}
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={!canSubmit}
                    />
                    {selectedFile ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                          <FileCode className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          {modelType && (
                            <Badge variant="secondary" className="mt-2">
                              {MODEL_TYPES.find(t => t.value === modelType)?.label}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setModelType(''); }}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" /> Supprimer
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">Glissez votre modèle ici</p>
                          <p className="text-sm text-muted-foreground">ou cliquez pour sélectionner un fichier</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedFile && (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !modelType}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />Soumission en cours...</>
                      ) : (
                        <><Upload className="h-4 w-4" />Soumettre le modèle</>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Historique des soumissions */}
              {mySubmissions.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Mes soumissions</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => fetchSubmissions(competitionId)} className="gap-1">
                        <RefreshCw className="h-3 w-3" /> Actualiser
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fichier</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mySubmissions.slice(0, 10).map((submission: any) => {
                          const st = statusBadge[submission.status] || statusBadge.pending;
                          const StatusIcon = st.icon;
                          return (
                            <TableRow key={submission.id}>
                              <TableCell className="font-mono text-sm max-w-[150px] truncate">
                                {submission.model_path?.split('/').pop() || `Soumission ${submission.id?.substring(0, 8)}`}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {submission.model_type || '—'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(submission.created_at || submission.submitted_at), 'dd MMM HH:mm', { locale: fr })}
                              </TableCell>
                              <TableCell>
                                <Badge className={`${st.className} gap-1`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {st.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {submission.score !== null && submission.score !== undefined
                                  ? submission.score.toFixed(4)
                                  : '—'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Formats acceptés</p>
                    <div className="flex flex-wrap gap-2">
                      {(competition.config?.allowed_formats || []).map((fmt: string) => (
                        <Badge key={fmt} variant="outline">{fmt}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Taille maximale</p>
                    <p className="font-semibold">{competition.config?.max_file_size_mb ?? '?'} MB</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Timeout évaluation</p>
                    <p className="font-semibold">{Math.round((competition.config?.execution_timeout_seconds ?? 120) / 60)} minutes</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Quota total</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Utilisé</span>
                      <span>{totalUsed} / {maxTotal === Infinity ? '∞' : maxTotal}</span>
                    </div>
                    <Progress value={(totalUsed / (maxTotal === Infinity ? 1 : maxTotal as number)) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Conseil</AlertTitle>
                <AlertDescription>
                  Assurez-vous que votre modèle est correctement sérialisé. Le type sélectionné doit correspondre au framework utilisé pour l'entraînement.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
