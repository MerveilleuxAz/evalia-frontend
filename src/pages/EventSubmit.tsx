import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  FileCode, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Info,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusBadge = {
  pending: { label: 'En attente', className: 'bg-warning/10 text-warning', icon: Clock },
  processing: { label: 'Évaluation...', className: 'bg-primary/10 text-primary', icon: Clock },
  evaluated: { label: 'Évalué', className: 'bg-success/10 text-success', icon: CheckCircle },
  error: { label: 'Erreur', className: 'bg-destructive/10 text-destructive', icon: AlertCircle },
};

export default function EventSubmit() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { currentEvent, submissions, loading, fetchEventById, fetchSubmissions, submitModel } = useEvents();
  const { isAuthenticated } = useAuth();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${eventId}/submit` } });
      return;
    }
    
    if (eventId) {
      fetchEventById(eventId);
      fetchSubmissions(eventId);
    }
  }, [eventId, isAuthenticated, navigate, fetchEventById, fetchSubmissions]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!currentEvent) return;
    
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!currentEvent.rules.allowed_formats.includes(ext)) {
      toast.error(`Format non supporté. Formats acceptés: ${currentEvent.rules.allowed_formats.join(', ')}`);
      return;
    }
    
    if (file.size > currentEvent.rules.max_file_size_mb * 1024 * 1024) {
      toast.error(`Fichier trop volumineux. Taille max: ${currentEvent.rules.max_file_size_mb} MB`);
      return;
    }
    
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !eventId) return;
    
    setIsSubmitting(true);
    try {
      await submitModel(eventId, selectedFile);
      toast.success('Modèle soumis avec succès !');
      setSelectedFile(null);
      fetchSubmissions(eventId);
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentEvent) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const event = currentEvent;
  const mySubmissions = submissions.filter(s => s.event_id === eventId);
  const dailySubmissions = mySubmissions.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.submitted_at).toDateString() === today;
  }).length;
  
  const canSubmit = 
    event.status === 'active' && 
    event.my_participation?.is_joined &&
    dailySubmissions < event.rules.max_submissions_per_day &&
    (event.my_participation?.my_submissions_count || 0) < event.rules.max_submissions_total;

  if (!event.my_participation?.is_joined) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Inscription requise</h2>
            <p className="text-muted-foreground mb-6">
              Vous devez d'abord rejoindre cet événement avant de pouvoir soumettre un modèle.
            </p>
            <Button asChild>
              <Link to={`/events/${eventId}`}>Voir l'événement</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (event.status !== 'active') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Soumissions fermées</h2>
            <p className="text-muted-foreground mb-6">
              Cet événement n'accepte plus de soumissions.
            </p>
            <Button asChild>
              <Link to={`/events/${eventId}`}>Voir les résultats</Link>
            </Button>
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
            <Link to="/events" className="hover:text-foreground">Événements</Link>
            <span>/</span>
            <Link to={`/events/${eventId}`} className="hover:text-foreground">{event.title}</Link>
            <span>/</span>
            <span className="text-foreground">Soumettre</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold mb-2">
                Soumettre un modèle
              </h1>
              <p className="text-muted-foreground">
                {event.title}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Quota aujourd'hui</p>
              <p className="text-lg font-bold">
                <span className={dailySubmissions >= event.rules.max_submissions_per_day ? 'text-destructive' : 'text-foreground'}>
                  {dailySubmissions}
                </span>
                <span className="text-muted-foreground"> / {event.rules.max_submissions_per_day}</span>
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
                    Vous avez atteint votre limite de soumissions. 
                    Réessayez demain ou attendez la prochaine compétition.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Upload de modèle</CardTitle>
                  <CardDescription>
                    Glissez-déposez votre fichier ou cliquez pour sélectionner
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                      accept={event.rules.allowed_formats.join(',')}
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
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">Glissez votre modèle ici</p>
                          <p className="text-sm text-muted-foreground">
                            ou cliquez pour sélectionner un fichier
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedFile && (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full mt-4 gap-2"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                          Soumission en cours...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Soumettre le modèle
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Submissions */}
              {mySubmissions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mes soumissions pour cet événement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fichier</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mySubmissions.slice(0, 5).map((submission) => {
                          const status = statusBadge[submission.status];
                          const StatusIcon = status.icon;
                          return (
                            <TableRow key={submission.id}>
                              <TableCell className="font-mono text-sm">
                                {submission.file_name}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(submission.submitted_at), 'dd MMM HH:mm', { locale: fr })}
                              </TableCell>
                              <TableCell>
                                <Badge className={`${status.className} gap-1`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {submission.score?.toFixed(4) || '-'}
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
                      {event.rules.allowed_formats.map((format) => (
                        <Badge key={format} variant="outline">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Taille maximale</p>
                    <p className="font-semibold">{event.rules.max_file_size_mb} MB</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Timeout évaluation</p>
                    <p className="font-semibold">{event.rules.timeout_minutes} minutes</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Quota total</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Utilisé</span>
                      <span>{event.my_participation?.my_submissions_count || 0} / {event.rules.max_submissions_total}</span>
                    </div>
                    <Progress 
                      value={((event.my_participation?.my_submissions_count || 0) / event.rules.max_submissions_total) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Conseil</AlertTitle>
                <AlertDescription>
                  Assurez-vous que votre modèle est correctement sérialisé et compatible avec notre environnement d'évaluation.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
