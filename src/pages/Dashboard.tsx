import React from 'react';
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
  FileCode,
  Users,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/hooks/useApi';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusBadge: any = {
  pending: { label: 'En attente', className: 'bg-warning/10 text-warning' },
  processing: { label: 'Évaluation...', className: 'bg-primary/10 text-primary' },
  evaluated: { label: 'Évalué', className: 'bg-success/10 text-success' },
  error: { label: 'Erreur', className: 'bg-destructive/10 text-destructive' },
};

const eventStatusLabels: any = {
  active: { label: 'Actif', className: 'status-active border', icon: <Play className="h-3 w-3" /> },
  upcoming: { label: 'À venir', className: 'status-upcoming border', icon: <Clock className="h-3 w-3" /> },
  closed: { label: 'Fermé', className: 'status-finished border', icon: <Trophy className="h-3 w-3" /> },
  finished: { label: 'Terminé', className: 'status-finished border', icon: <Trophy className="h-3 w-3" /> },
  archived: { label: 'Archivé', className: 'status-archived border', icon: null },
  draft: { label: 'Brouillon', className: 'status-archived border', icon: null },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading) {
    return <div className="min-h-screen pt-32 text-center">Chargement du tableau de bord...</div>;
  }

  const { stats, recent_competitions = [], recent_submissions = [] } = dashboardData || {};

  return (
    <div className="min-h-screen pt-16">
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
                Voici un aperçu de vos activités sur EvalIA
              </p>
              <Badge variant="outline" className="mt-1 capitalize">
                {user?.role === 'administrateur' ? 'Administrateur' : 'Utilisateur'}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 space-y-8">
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
                    <p className="text-2xl font-bold">{stats?.competitions_joined || 0}</p>
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
                    <p className="text-2xl font-bold">{stats?.total_submissions || 0}</p>
                    <p className="text-sm text-muted-foreground">Soumissions totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Play className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.competitions_active || 0}</p>
                    <p className="text-sm text-muted-foreground">Compétitions actives</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-warning/10">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.competitions_created || 0}</p>
                    <p className="text-sm text-muted-foreground">Compétitions créées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Mes compétitions</h2>
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link to="/events">
                  Découvrir plus
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {recent_competitions.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recent_competitions.map((event: any) => {
                  const st = eventStatusLabels[event.status] || eventStatusLabels.archived;
                  return (
                    <Card key={event.id} className="hover:border-primary/30 transition-all group border-border/60 bg-card/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${st.className} gap-1 text-[10px] h-5`}>
                            {st.icon}
                            {st.label}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          <Link to={`/events/${event.id}`} className="hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                           <Clock className="h-3 w-3" />
                           <span>Inscrit récemment</span>
                        </div>
                        <Button asChild className="w-full gap-2" size="sm" variant="secondary">
                          <Link to={`/events/${event.id}`}>
                            <Eye className="h-4 w-4" />
                            Accéder à l'arène
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-12 border-dashed border-2 bg-muted/5">
                <CardContent className="pt-6">
                  <Trophy className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="font-medium text-muted-foreground">Vous n'êtes inscrit à aucune compétition</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/events">Parcourir les compétitions disponibles</Link>
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
            <h2 className="font-display text-xl font-semibold mb-4">Dernières soumissions</h2>

            {recent_submissions.length > 0 ? (
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fichier / Compétition</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recent_submissions.map((submission: any) => {
                        const status = statusBadge[submission.status] || statusBadge.evaluated;
                        return (
                          <TableRow key={submission.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileCode className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm truncate font-medium">Soumission {submission.id.substring(0,8)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {submission.created_at ? format(new Date(submission.created_at), 'dd MMM HH:mm', { locale: fr }) : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge className={status.className}>{status.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {submission.score !== null ? submission.score.toFixed(4) : '-'}
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
                  <p className="text-muted-foreground">Aucune soumission récente</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
