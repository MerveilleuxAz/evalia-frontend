import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  AlertCircle,
  BarChart3,
  Target,
  Timer,
  Info,
  Database,
  Scale,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardTable } from '@/components/events/LeaderboardTable';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow, format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig = {
  upcoming: { label: 'À venir', icon: Clock, className: 'status-upcoming' },
  active: { label: 'Actif', icon: Play, className: 'status-active' },
  finished: { label: 'Terminé', icon: CheckCircle, className: 'status-finished' },
  archived: { label: 'Archivé', icon: CheckCircle, className: 'status-archived' },
};

const difficultyConfig = {
  beginner: { label: 'Débutant', className: 'bg-success/10 text-success' },
  intermediate: { label: 'Intermédiaire', className: 'bg-warning/10 text-warning' },
  advanced: { label: 'Avancé', className: 'bg-destructive/10 text-destructive' },
};

const themeLabels = {
  classification: 'Classification',
  regression: 'Régression',
  nlp: 'NLP',
  vision: 'Vision',
  other: 'Autre',
};

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { currentEvent, leaderboard, loading, fetchEventById, fetchLeaderboard, joinEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId);
      fetchLeaderboard(eventId);
    }
  }, [eventId, fetchEventById, fetchLeaderboard]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${eventId}` } });
      return;
    }
    
    setIsJoining(true);
    await joinEvent(eventId!);
    setIsJoining(false);
  };

  if (loading || !currentEvent) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const event = currentEvent;
  const status = statusConfig[event.status];
  const StatusIcon = status.icon;
  const difficulty = difficultyConfig[event.difficulty];

  const getCountdown = () => {
    const now = new Date();
    const endDate = new Date(event.end_date);
    const startDate = new Date(event.start_date);
    
    if (event.status === 'upcoming') {
      const days = differenceInDays(startDate, now);
      const hours = differenceInHours(startDate, now) % 24;
      return { days, hours, label: 'avant le début' };
    }
    
    if (event.status === 'active') {
      const days = differenceInDays(endDate, now);
      const hours = differenceInHours(endDate, now) % 24;
      return { days, hours, label: 'restant' };
    }
    
    return null;
  };

  const countdown = getCountdown();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={event.banner_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=400&fit=crop'}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute top-4 left-0 right-0">
          <div className="container mx-auto px-4">
            <Button asChild variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:text-foreground">
              <Link to="/events">
                <ArrowLeft className="h-4 w-4" />
                Tous les événements
              </Link>
            </Button>
          </div>
        </div>

        {/* Event Title */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${status.className} border gap-1.5`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
              <Badge className={difficulty.className}>{difficulty.label}</Badge>
              <Badge variant="outline">{themeLabels[event.theme]}</Badge>
            </div>
            
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              {event.title}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={event.organizer.avatar} />
                  <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  Organisé par <strong className="text-foreground">{event.organizer.name}</strong>
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
                <TabsList className="bg-muted/50 p-1">
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
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-muted-foreground whitespace-pre-line">
                          {event.description_full}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{event.stats.participants_count}</p>
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
                            <p className="text-2xl font-bold">{event.stats.submissions_count}</p>
                            <p className="text-sm text-muted-foreground">Soumissions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-warning/10">
                            <Trophy className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold font-mono">
                              {event.stats.best_score.toFixed(3)}
                            </p>
                            <p className="text-sm text-muted-foreground">Meilleur score</p>
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
                      <CardTitle>Informations sur le Dataset</CardTitle>
                      <CardDescription>
                        Détails sur les données d'entraînement et de test
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Données d'entraînement</p>
                          <p className="font-semibold">{event.dataset_info.train_size}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Données de test</p>
                          <p className="font-semibold">{event.dataset_info.test_size}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Caractéristiques</p>
                          <p className="font-semibold">{event.dataset_info.features}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Variable cible</p>
                          <p className="font-semibold">{event.dataset_info.target}</p>
                        </div>
                      </div>

                      {event.my_participation?.is_joined && event.status !== 'finished' && (
                        <Button className="w-full gap-2">
                          <Download className="h-4 w-4" />
                          Télécharger le dataset d'entraînement
                        </Button>
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
                        Critères utilisés pour évaluer vos modèles
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {event.metrics.map((metric) => (
                        <div 
                          key={metric.name} 
                          className={`p-4 rounded-lg border ${metric.is_primary ? 'border-primary bg-primary/5' : 'border-border'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold capitalize">{metric.name.replace('_', ' ')}</span>
                              {metric.is_primary && (
                                <Badge className="text-xs">Principal</Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Poids: {metric.weight}
                            </span>
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
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Soumissions par jour</p>
                          <p className="font-semibold">{event.rules.max_submissions_per_day}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Soumissions totales</p>
                          <p className="font-semibold">{event.rules.max_submissions_total}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Taille max fichier</p>
                          <p className="font-semibold">{event.rules.max_file_size_mb} MB</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">Timeout évaluation</p>
                          <p className="font-semibold">{event.rules.timeout_minutes} min</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Formats acceptés</p>
                        <div className="flex flex-wrap gap-2">
                          {event.rules.allowed_formats.map((format) => (
                            <Badge key={format} variant="outline">
                              <FileCode className="mr-1 h-3 w-3" />
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Leaderboard Tab */}
                <TabsContent value="leaderboard" className="space-y-6">
                  <LeaderboardTable 
                    entries={leaderboard} 
                    currentUserId={user?.id}
                    metricName={event.metrics.find(m => m.is_primary)?.name || 'Score'}
                  />
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
                        {format(new Date(event.start_date), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Fin:</span>
                      <span className="font-medium">
                        {format(new Date(event.end_date), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  {event.status === 'active' && (
                    <>
                      {event.my_participation?.is_joined ? (
                        <div className="space-y-3">
                          <Button asChild className="w-full gap-2" size="lg">
                            <Link to={`/events/${event.id}/submit`}>
                              <Upload className="h-4 w-4" />
                              Soumettre un modèle
                            </Link>
                          </Button>
                          
                          {/* My Stats */}
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                            <p className="font-semibold text-sm">Mes statistiques</p>
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                <p className="text-2xl font-bold text-primary">
                                  #{event.my_participation.my_rank || '-'}
                                </p>
                                <p className="text-xs text-muted-foreground">Rang</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold font-mono">
                                  {event.my_participation.my_best_score?.toFixed(3) || '-'}
                                </p>
                                <p className="text-xs text-muted-foreground">Meilleur score</p>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-border">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Soumissions</span>
                                <span>
                                  {event.my_participation.my_submissions_count} / {event.rules.max_submissions_total}
                                </span>
                              </div>
                              <Progress 
                                value={(event.my_participation.my_submissions_count / event.rules.max_submissions_total) * 100} 
                                className="mt-2 h-2"
                              />
                            </div>
                          </div>
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
                              Rejoindre l'événement
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}

                  {event.status === 'upcoming' && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="font-semibold">Bientôt disponible</p>
                      <p className="text-sm text-muted-foreground">
                        Les inscriptions ouvrent le{' '}
                        {format(new Date(event.registration_start), 'dd MMM', { locale: fr })}
                      </p>
                    </div>
                  )}

                  {event.status === 'finished' && (
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="font-semibold">Compétition terminée</p>
                      <p className="text-sm text-muted-foreground">
                        Consultez le classement final
                      </p>
                    </div>
                  )}

                  {/* Organizer */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Organisateur</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{event.organizer.name}</p>
                        <p className="text-xs text-muted-foreground">Organisateur</p>
                      </div>
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
