import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Upload, 
  Calendar, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Play,
  BarChart3,
  Target,
  Medal,
  FileCode,
  Plus,
  Users,
  Settings,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { mockEvents, mockSubmissions } from '@/data/mockData';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusBadge = {
  pending: { label: 'En attente', className: 'bg-warning/10 text-warning' },
  processing: { label: 'Évaluation...', className: 'bg-primary/10 text-primary' },
  evaluated: { label: 'Évalué', className: 'bg-success/10 text-success' },
  error: { label: 'Erreur', className: 'bg-destructive/10 text-destructive' },
};

const eventStatusLabels: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  active: { label: 'Actif', className: 'status-active border', icon: <Play className="h-3 w-3" /> },
  upcoming: { label: 'À venir', className: 'status-upcoming border', icon: <Clock className="h-3 w-3" /> },
  finished: { label: 'Terminé', className: 'status-finished border', icon: <Trophy className="h-3 w-3" /> },
  archived: { label: 'Archivé', className: 'status-archived border', icon: null },
};

// ─── Organisateur Dashboard ───────────────────────────────────────────

function OrganizerDashboard() {
  const { user } = useAuth();

  const myCreatedEvents = useMemo(
    () => mockEvents.filter((e) => e.organizer.id === user?.id),
    [user?.id]
  );

  const allSubmissionsForMyEvents = useMemo(() => {
    const eventIds = new Set(myCreatedEvents.map((e) => e.id));
    return mockSubmissions.filter((s) => eventIds.has(s.event_id));
  }, [myCreatedEvents]);

  const totalParticipants = myCreatedEvents.reduce((acc, e) => acc + e.stats.participants_count, 0);
  const totalSubmissions = allSubmissionsForMyEvents.length;
  const activeCount = myCreatedEvents.filter((e) => e.status === 'active').length;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myCreatedEvents.length}</p>
                  <p className="text-sm text-muted-foreground">Événements créés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-success/10">
                  <Play className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-sm text-muted-foreground">Événements actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalParticipants}</p>
                  <p className="text-sm text-muted-foreground">Total participants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Upload className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSubmissions}</p>
                  <p className="text-sm text-muted-foreground">Total soumissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Created Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Mes événements</h2>
            <Button asChild size="sm" className="gap-2">
              <Link to="/events/create">
                <Plus className="h-4 w-4" />
                Créer un événement
              </Link>
            </Button>
          </div>

          {myCreatedEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCreatedEvents.map((event) => {
                const st = eventStatusLabels[event.status];
                const eventSubmissions = allSubmissionsForMyEvents.filter(
                  (s) => s.event_id === event.id
                );

                return (
                  <Card key={event.id} className="hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`${st.className} gap-1`}>
                          {st.icon}
                          {st.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {event.status === 'active'
                            ? `Fin ${formatDistanceToNow(new Date(event.end_date), { addSuffix: true, locale: fr })}`
                            : format(new Date(event.start_date), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        <Link to={`/events/${event.id}`} className="hover:text-primary transition-colors">
                          {event.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold">{event.stats.participants_count}</p>
                          <p className="text-xs text-muted-foreground">Inscrits</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold">{eventSubmissions.length}</p>
                          <p className="text-xs text-muted-foreground">Soumissions</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold font-mono">
                            {event.stats.best_score ? event.stats.best_score.toFixed(2) : '-'}
                          </p>
                          <p className="text-xs text-muted-foreground">Meilleur</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1 gap-1">
                          <Link to={`/events/${event.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            Voir
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1 gap-1">
                          <Link to={`/events/${event.id}/manage`}>
                            <Settings className="h-3.5 w-3.5" />
                            Gérer
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas encore créé d'événement
                </p>
                <Button asChild>
                  <Link to="/events/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer mon premier événement
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Recent submissions on my events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-xl font-semibold mb-4">Dernières soumissions reçues</h2>

          {allSubmissionsForMyEvents.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Événement</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Fichier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allSubmissionsForMyEvents.slice(0, 10).map((submission) => {
                      const status = statusBadge[submission.status];
                      return (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            <Link
                              to={`/events/${submission.event_id}/manage`}
                              className="hover:text-primary transition-colors"
                            >
                              {submission.event_title}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {submission.user_name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileCode className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate max-w-[120px]">
                                {submission.file_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(submission.submitted_at), 'dd MMM HH:mm', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge className={status.className}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {submission.score?.toFixed(4) || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Upload className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune soumission reçue pour le moment
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Participant Dashboard ────────────────────────────────────────────

function ParticipantDashboard() {
  const { myEvents, submissions, loading, fetchMyEvents, fetchSubmissions } = useEvents();

  useEffect(() => {
    fetchMyEvents();
    fetchSubmissions();
  }, [fetchMyEvents, fetchSubmissions]);

  const activeEvents = myEvents.filter((e) => e.status === 'active');
  const totalSubmissions = submissions.length;
  const rankedEvents = myEvents.filter((e) => e.my_participation?.my_rank);
  const avgRank = rankedEvents.length
    ? rankedEvents.reduce((acc, e) => acc + (e.my_participation?.my_rank || 0), 0) / rankedEvents.length
    : 0;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myEvents.length}</p>
                  <p className="text-sm text-muted-foreground">Événements rejoints</p>
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
                  <p className="text-2xl font-bold">{totalSubmissions}</p>
                  <p className="text-sm text-muted-foreground">Soumissions totales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    #{avgRank ? Math.round(avgRank) : '-'}
                  </p>
                  <p className="text-sm text-muted-foreground">Rang moyen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Medal className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {myEvents.filter((e) => (e.my_participation?.my_rank || 999) <= 3).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Top 3 atteints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Événements actifs</h2>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/events">
                Tous les événements
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {activeEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeEvents.map((event) => (
                <Card key={event.id} className="hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className="status-active border gap-1">
                        <Play className="h-3 w-3" />
                        Actif
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(event.end_date), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      <Link to={`/events/${event.id}`} className="hover:text-primary transition-colors">
                        {event.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold text-primary">
                          #{event.my_participation?.my_rank || '-'}
                        </p>
                        <p className="text-xs text-muted-foreground">Mon rang</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold font-mono">
                          {event.my_participation?.my_best_score?.toFixed(3) || '-'}
                        </p>
                        <p className="text-xs text-muted-foreground">Meilleur score</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Soumissions</span>
                        <span>
                          {event.my_participation?.my_submissions_count || 0} / {event.rules.max_submissions_total}
                        </span>
                      </div>
                      <Progress
                        value={((event.my_participation?.my_submissions_count || 0) / event.rules.max_submissions_total) * 100}
                        className="h-1.5"
                      />
                    </div>

                    <Button asChild className="w-full gap-2" size="sm">
                      <Link to={`/events/${event.id}/submit`}>
                        <Upload className="h-4 w-4" />
                        Soumettre
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Vous n'êtes inscrit à aucun événement actif
                </p>
                <Button asChild>
                  <Link to="/events">Découvrir les événements</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-xl font-semibold mb-4">Historique des soumissions</h2>

          {submissions.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Événement</TableHead>
                      <TableHead>Fichier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Rang</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.slice(0, 10).map((submission) => {
                      const status = statusBadge[submission.status];
                      return (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            <Link
                              to={`/events/${submission.event_id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {submission.event_title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileCode className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate max-w-[150px]">
                                {submission.file_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(submission.submitted_at), 'dd MMM HH:mm', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge className={status.className}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {submission.score?.toFixed(4) || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {submission.rank ? `#${submission.rank}` : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Upload className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune soumission pour le moment
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const isOrganizer = hasRole('organisateur');

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="relative py-12 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.02]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-lg">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">
                Bienvenue, {user?.name} !
              </h1>
              <p className="text-muted-foreground">
                {isOrganizer
                  ? 'Gérez vos événements et suivez les soumissions'
                  : 'Voici un aperçu de vos activités sur EvalIA'}
              </p>
              <Badge variant="outline" className="mt-1 capitalize">
                {user?.role}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {isOrganizer ? <OrganizerDashboard /> : <ParticipantDashboard />}
    </div>
  );
}
