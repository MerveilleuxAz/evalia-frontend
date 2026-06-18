import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Download,
  Upload,
  Play,
  CheckCircle,
  FileCode,
  Target,
  Info,
  Database,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardTable } from '@/components/competitions/LeaderboardTable';
import { useCompetitions } from '@/context/CompetitionContext';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow, format, differenceInDays, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  upcoming: { label: 'À venir', icon: Clock, className: 'status-upcoming' },
  active: { label: 'Actif', icon: Play, className: 'status-active' },
  finished: { label: 'Terminé', icon: CheckCircle, className: 'status-finished' },
  closed: { label: 'Fermé', icon: CheckCircle, className: 'status-finished' },
  archived: { label: 'Archivé', icon: CheckCircle, className: 'status-archived' },
  draft: { label: 'Brouillon', icon: CheckCircle, className: 'status-archived' },
};

const themeLabels: Record<string, string> = {
  classification: 'Classification',
  regression: 'Régression',
  nlp: 'NLP',
  vision: 'Vision',
  other: 'Autre',
};

export default function CompetitionDetails() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const { currentCompetition: competition, leaderboard, loading, fetchCompetitionById, fetchLeaderboard, joinCompetition } = useCompetitions();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);

  const loadParticipants = React.useCallback(async (id: string) => {
    setIsLoadingParticipants(true);
    try {
      const { api } = await import('@/lib/api');
      const data = await api.competitions.participants(id);
      if (data && data.participants) {
        setParticipants(data.participants);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des participants:", err);
    } finally {
      setIsLoadingParticipants(false);
    }
  }, []);

  useEffect(() => {
    if (competitionId) {
      fetchCompetitionById(competitionId);
      fetchLeaderboard(competitionId);
      loadParticipants(competitionId);
    }
  }, [competitionId, fetchCompetitionById, fetchLeaderboard, loadParticipants]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/competitions/${competitionId}` } });
      return;
    }
    
    setIsJoining(true);
    try {
      await joinCompetition(competitionId!);
      toast({
        title: '🎉 Inscription réussie !',
        description: `Vous participez maintenant à "${competition?.title}".`,
      });
      loadParticipants(competitionId!);
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err?.message || 'Impossible de rejoindre la compétition.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (loading || !competition) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const status = statusConfig[competition.status || 'archived'];
  const StatusIcon = status.icon;

  const startDate = competition.calendar?.start_date ? new Date(competition.calendar.start_date) : new Date();
  const endDate = competition.calendar?.end_date ? new Date(competition.calendar.end_date) : new Date();
  const registrationDate = competition.calendar?.registration_start ? new Date(competition.calendar.registration_start) : startDate;

  const getCountdown = () => {
    const now = new Date();
    
    if (competition.status === 'upcoming') {
      const days = differenceInDays(startDate, now);
      const hours = differenceInHours(startDate, now) % 24;
      return { days, hours, label: 'avant le début' };
    }
    
    if (competition.status === 'active') {
      const days = differenceInDays(endDate, now);
      const hours = differenceInHours(endDate, now) % 24;
      return { days, hours, label: 'restant' };
    }
    
    return null;
  };

  const countdown = getCountdown();
  const primaryMetricLabel = competition.metrics?.info?.label || competition.metrics?.primary || 'Score';

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={competition.banner_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=400&fit=crop'}
          alt={competition.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute top-4 left-0 right-0">
          <div className="container mx-auto px-4">
            <Button asChild variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:text-foreground">
              <Link to="/competitions">
                <ArrowLeft className="h-4 w-4" />
                Tous les compétitions
              </Link>
            </Button>
          </div>
        </div>

        {/* Competition Title */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${status.className} border gap-1.5`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
              <Badge variant="outline">{themeLabels[competition.task_type || 'other'] || 'Autre'}</Badge>
              {isAuthenticated && competition.my_participation?.is_joined && (
                <Badge className="bg-success/20 text-success border-success/30 gap-1.5 backdrop-blur-md">
                  <CheckCircle className="h-3 w-3" />
                  Vous participez
                </Badge>
              )}
            </div>
            
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              {competition.title}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>E</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  Organisé par <strong className="text-foreground">EvalIA Plateforme</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 flex-wrap h-auto">
                  <TabsTrigger value="overview" className="gap-2">
                    <Info className="h-4 w-4" />
                    Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger value="data" className="gap-2">
                    <Database className="h-4 w-4" />
                    Données
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="gap-2">
                    <Target className="h-4 w-4" />
                    Métriques
                  </TabsTrigger>
                  <TabsTrigger value="rules" className="gap-2">
                    <Scale className="h-4 w-4" />
                    Règlement
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="gap-2">
                    <Trophy className="h-4 w-4" />
                    Classement
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="gap-2">
                    <Users className="h-4 w-4" />
                    Participants
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-muted-foreground whitespace-pre-line mb-6">
                          {competition.description || 'Aucune description disponible.'}
                        </p>

                        {competition.problem_statement && (
                           <>
                             <h3 className="text-lg font-bold text-foreground mt-4 mb-2">Problème et Objectif</h3>
                             <p className="text-muted-foreground whitespace-pre-line">
                                {competition.problem_statement}
                             </p>
                           </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{competition.stats?.participants || 0}</p>
                            <p className="text-sm text-muted-foreground">Participants</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-secondary/10">
                            <Upload className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{competition.stats?.total_submissions || 0}</p>
                            <p className="text-sm text-muted-foreground">Soumissions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Data Tab */}
                <TabsContent value="data" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description des Données</CardTitle>
                      <CardDescription>
                        Détails sur les données d'entraînement et de test fournis pour cette compétition.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <p className="text-muted-foreground whitespace-pre-line">
                          {competition.data_description || 'La description des données n\'est pas encore spécifiée pour cette compétition.'}
                       </p>

                      {competition.my_participation?.is_joined && competition.status !== 'finished' && (
                        <div className="grid sm:grid-cols-2 gap-4 mt-6">
                           <Button variant="outline" className="w-full gap-2" disabled={!competition.downloads?.train_dataset}>
                             <Download className="h-4 w-4" />
                             Dataset Entraînement
                           </Button>
                           <Button variant="outline" className="w-full gap-2" disabled={!competition.downloads?.sample_submission}>
                             <Download className="h-4 w-4" />
                             Exemple de soumission
                           </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Metrics Tab */}
                <TabsContent value="metrics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Métriques d'évaluation</CardTitle>
                      <CardDescription>
                        {competition.evaluation_description || 'Critères utilisés pour évaluer vos modèles et construire le classement.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {competition.metrics?.primary && (
                        <div className="p-4 rounded-lg border border-primary bg-primary/5">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold capitalize">{competition.metrics.primary.replace('_', ' ')}</span>
                              <Badge className="text-xs">Principal</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                             Métrique affichée : {competition.metrics.info?.label} ({competition.metrics.info?.higher_is_better ? 'Plus grand est meilleur' : 'Plus petit est meilleur'})
                          </p>
                        </div>
                      )}

                      {competition.metrics?.secondary?.map((metric: string) => (
                        <div key={metric} className="p-4 rounded-lg border border-border">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold capitalize">{metric.replace('_', ' ')}</span>
                            <Badge variant="secondary" className="text-xs">Secondaire</Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Rules Tab */}
                <TabsContent value="rules" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Règlement de la compétition</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="prose prose-invert max-w-none mb-6">
                        <p className="text-muted-foreground whitespace-pre-line">
                           {competition.rules || 'Aucun règlement spécifique n\'est mentionné.'}
                        </p>
                      </div>

                      {competition.config && (
                        <div className="grid sm:grid-cols-2 gap-4 border-t border-border pt-6">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Soumissions par jour</p>
                            <p className="font-semibold">{competition.config.max_submissions_per_day || 'Illimité'}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Soumissions totales</p>
                            <p className="font-semibold">{competition.config.max_submissions_total || 'Illimité'}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Taille max fichier</p>
                            <p className="font-semibold">{competition.config.max_file_size_mb || '?'} MB</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Timeout évaluation</p>
                            <p className="font-semibold">{competition.config.execution_timeout_seconds || '?'} sec</p>
                          </div>
                        </div>
                      )}

                      {competition.config?.allowed_formats && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Formats acceptés</p>
                          <div className="flex flex-wrap gap-2">
                            {competition.config.allowed_formats.map((format: string) => (
                              <Badge key={format} variant="outline">
                                <FileCode className="mr-1 h-3 w-3" />
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Leaderboard Tab */}
                <TabsContent value="leaderboard" className="space-y-6">
                  <LeaderboardTable 
                    entries={leaderboard} 
                    currentUserId={user?.id}
                    metricName={primaryMetricLabel}
                  />
                </TabsContent>

                {/* Participants Tab */}
                <TabsContent value="participants" className="space-y-6">
                  {isLoadingParticipants ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : participants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {participants.map((participant) => (
                        <Card key={participant.id} className="overflow-hidden bg-muted/20 border-border/50 hover:bg-muted/30 transition-colors">
                          <CardContent className="p-4 flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {(participant.name || participant.username || '?').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow min-w-0">
                              <p className="font-semibold truncate text-foreground">
                                {participant.name || participant.username}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Participant
                              </p>
                            </div>
                            {participant.id === user?.id && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Moi</Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Aucun participant inscrit pour le moment.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Countdown / Dates Card */}
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-6">
                  {/* Countdown */}
                  {countdown && (
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div>
                          <p className="text-3xl font-bold font-mono">{countdown.days}</p>
                          <p className="text-xs text-muted-foreground">jours</p>
                        </div>
                        <span className="text-2xl text-muted-foreground">:</span>
                        <div>
                          <p className="text-3xl font-bold font-mono">{countdown.hours}</p>
                          <p className="text-xs text-muted-foreground">heures</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{countdown.label}</p>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Début:</span>
                      <span className="font-medium">
                        {format(startDate, 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Fin:</span>
                      <span className="font-medium">
                        {format(endDate, 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  {competition.status === 'active' && (
                    <>
                      {competition.my_participation?.is_joined ? (
                        <div className="space-y-3">
                          <Button asChild className="w-full gap-2" size="lg">
                            <Link to={`/competitions/${competition.id}/submit`}>
                              <Upload className="h-4 w-4" />
                              Soumettre un modèle
                            </Link>
                          </Button>
                          
                          {/* My Stats - Placeholder if backend doesn't supply it */}
                          {competition.my_participation.my_rank != null && (
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                              <p className="font-semibold text-sm">Mes statistiques</p>
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <p className="text-2xl font-bold text-primary">
                                    #{competition.my_participation.my_rank || '-'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Rang</p>
                                </div>
                                <div>
                                  <p className="text-2xl font-bold font-mono">
                                    {competition.my_participation.my_best_score?.toFixed(3) || '-'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Meilleur score</p>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-border">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Soumissions</span>
                                  <span>
                                    {competition.my_participation.my_submissions_count || 0} / {competition.config?.max_submissions_total || '∞'}
                                  </span>
                                </div>
                                <Progress 
                                  value={competition.config?.max_submissions_total ? ((competition.my_participation.my_submissions_count || 0) / competition.config.max_submissions_total) * 100 : 0} 
                                  className="mt-2 h-2"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button 
                          className="w-full gap-2" 
                          size="lg"
                          onClick={handleJoin}
                          disabled={isJoining}
                        >
                           {isJoining ? (
                             <>
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                               Inscription...
                             </>
                           ) : (
                             <>
                               <Play className="h-4 w-4" />
                               Rejoindre l'compétition
                             </>
                           )}
                        </Button>
                      )}
                    </>
                  )}

                  {competition.status === 'upcoming' && (
                    <div className="space-y-3">
                      <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold">Bientôt disponible</p>
                        <p className="text-sm text-muted-foreground">
                          Les inscriptions ouvrent le {format(registrationDate, 'dd MMM', { locale: fr })}
                        </p>
                      </div>
                      {/* Permettre l'inscription anticipée si pas encore inscrit */}
                      {!competition.my_participation?.is_joined && (
                        <Button
                          className="w-full gap-2"
                          variant="outline"
                          size="lg"
                          onClick={handleJoin}
                          disabled={isJoining}
                        >
                          {isJoining ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground" />
                              Inscription...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              S'inscrire en avance
                            </>
                          )}
                        </Button>
                      )}
                      {competition.my_participation?.is_joined && (
                        <div className="flex items-center justify-center gap-2 text-sm text-success">
                          <CheckCircle className="h-4 w-4" />
                          <span>Vous êtes inscrit — préparez-vous !</span>
                        </div>
                      )}
                    </div>
                  )}

                  {competition.status === 'finished' && (
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="font-semibold">Compétition terminée</p>
                    </div>
                  )}

                  {/* Built-in details */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Informations utiles</p>
                    <div className="space-y-2 text-sm">
                       <p className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span>{themeLabels[competition.task_type || 'other']}</span></p>
                       <p className="flex justify-between"><span className="text-muted-foreground">Soumissions / jour:</span> <span>{competition.config?.max_submissions_per_day || 'Illimité'}</span></p>
                       <p className="flex justify-between"><span className="text-muted-foreground">Outil de métrique:</span> <span>{competition.metrics?.info?.task || 'Aucun'}</span></p>
                    </div>
                  </div>
                  
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
