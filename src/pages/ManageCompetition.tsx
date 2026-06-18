import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, FileText, Settings, BarChart3,
  Trash2, Download, Eye, Ban, CheckCircle, XCircle,
  Clock, TrendingUp, AlertTriangle, Loader2, Play,
  Pause, Archive, Power, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useCompetition, useCompetitionParticipants, useUpdateCompetitionStatus } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft:     { label: 'Brouillon', color: 'bg-slate-500/20 text-slate-400', icon: Clock },
  upcoming:  { label: 'À venir',   color: 'bg-blue-500/20 text-blue-400',   icon: Calendar },
  active:    { label: 'Active',    color: 'bg-green-500/20 text-green-400', icon: Play },
  closed:    { label: 'Fermée',    color: 'bg-yellow-500/20 text-yellow-400', icon: Pause },
  finished:  { label: 'Terminée', color: 'bg-gray-500/20 text-gray-400',   icon: CheckCircle },
  archived:  { label: 'Archivée', color: 'bg-slate-500/20 text-slate-400', icon: Archive },
};

export default function ManageCompetition() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [participantFilter, setParticipantFilter] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: competition, isLoading } = useCompetition(competitionId!);
  const { data: participantsData, isLoading: isLoadingParticipants } = useCompetitionParticipants(competitionId!);
  const { data: submissionsData, isLoading: isLoadingSubs } = useQuery({
    queryKey: ['competitions', competitionId, 'submissions-all'],
    queryFn: () => api.eval.mySubmissions(competitionId!),
    enabled: !!competitionId,
  });

  const updateStatusMutation = useUpdateCompetitionStatus();

  // ── Vérification d'accès ──────────────────────────────────
  const isOwner = competition?.my_participation?.is_owner === true;
  const isAdmin = user?.role === 'administrateur';
  const canManage = isOwner || isAdmin;

  const handleStatusChange = async (newStatus: string) => {
    if (!competitionId) return;
    try {
      await updateStatusMutation.mutateAsync({ id: competitionId, status: newStatus });
      toast({ title: 'Statut mis à jour', description: `La compétition est maintenant "${statusConfig[newStatus]?.label || newStatus}".` });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut.', variant: 'destructive' });
    }
  };

  // ── États de chargement ───────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-96" />
          <div className="grid md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Compétition introuvable</h2>
            <p className="text-muted-foreground mb-4">La compétition n'existe pas.</p>
            <Button onClick={() => navigate('/competitions')}>Retour</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Ban className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
            <p className="text-muted-foreground mb-4">Seul le créateur de la compétition peut la gérer.</p>
            <Button onClick={() => navigate(`/competitions/${competitionId}`)}>Voir la compétition</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusConfig[competition.status]?.icon || Clock;
  const participants = participantsData?.participants || [];
  const filteredParticipants = participants.filter((p: any) =>
    p.name?.toLowerCase().includes(participantFilter.toLowerCase()) ||
    p.email?.toLowerCase().includes(participantFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(`/competitions/${competitionId}`)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la compétition
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-display font-bold">{competition.title}</h1>
                <Badge className={statusConfig[competition.status]?.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[competition.status]?.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">Gérez les participants, soumissions et paramètres de votre compétition</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" asChild>
                <Link to={`/competitions/${competitionId}`}>
                  <Eye className="h-4 w-4 mr-2" /> Voir la page
                </Link>
              </Button>
              <Select value={competition.status} onValueChange={handleStatusChange} disabled={updateStatusMutation.isPending}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="upcoming">À venir</SelectItem>
                  <SelectItem value="active">Ouvrir (Active)</SelectItem>
                  <SelectItem value="closed">Fermer</SelectItem>
                  <SelectItem value="finished">Terminer</SelectItem>
                  <SelectItem value="archived">Archiver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Participants', value: competition.stats.participants, icon: Users, color: 'bg-primary/20 text-primary' },
            { label: 'Soumissions', value: competition.stats.total_submissions, icon: FileText, color: 'bg-secondary/20 text-secondary' },
            { label: 'Meilleur score', value: competition.stats.best_score != null ? competition.stats.best_score.toFixed(4) : '—', icon: TrendingUp, color: 'bg-green-500/20 text-green-400' },
            { label: 'Soum./participant', value: competition.stats.participants > 0 ? Math.round((competition.stats.total_submissions / competition.stats.participants) * 10) / 10 : 0, icon: BarChart3, color: 'bg-orange-500/20 text-orange-400' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-xl', stat.color.split(' ')[0])}>
                    <stat.icon className={cn('h-6 w-6', stat.color.split(' ')[1])} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="participants">Participants ({competition.stats.participants})</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Informations</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Thématique', value: <Badge variant="outline">{competition.task_type}</Badge> },
                    { label: 'Métrique principale', value: competition.metrics.primary || 'N/A' },
                    { label: 'Début', value: competition.calendar.start_date ? format(new Date(competition.calendar.start_date), 'dd MMM yyyy', { locale: fr }) : '—' },
                    { label: 'Fin', value: competition.calendar.end_date ? format(new Date(competition.calendar.end_date), 'dd MMM yyyy', { locale: fr }) : '—' },
                    { label: 'Jours restants', value: competition.calendar.days_remaining != null ? `${competition.calendar.days_remaining} j` : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Actions rapides</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/competitions/${competitionId}`}>
                      <Eye className="h-4 w-4 mr-2" /> Voir la page publique
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/competitions/${competitionId}/leaderboard`}>
                      <TrendingUp className="h-4 w-4 mr-2" /> Voir le classement
                    </Link>
                  </Button>
                  {competition.status === 'active' && (
                    <Button variant="outline" className="w-full justify-start text-warning" onClick={() => handleStatusChange('closed')}>
                      <Pause className="h-4 w-4 mr-2" /> Fermer les soumissions
                    </Button>
                  )}
                  {competition.status === 'draft' && (
                    <Button variant="outline" className="w-full justify-start text-success" onClick={() => handleStatusChange('upcoming')}>
                      <Power className="h-4 w-4 mr-2" /> Publier la compétition
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Participants */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Participants ({participants.length})</CardTitle>
                    <CardDescription>Membres inscrits à cette compétition</CardDescription>
                  </div>
                  <Input
                    placeholder="Rechercher..."
                    value={participantFilter}
                    onChange={e => setParticipantFilter(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingParticipants ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : filteredParticipants.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Inscrit le</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParticipants.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={p.avatar} />
                                <AvatarFallback>{p.name?.[0] || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {p.joined_at ? format(new Date(p.joined_at), 'dd MMM yyyy', { locale: fr }) : '—'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-destructive" title="Exclure">
                              <Ban className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    {participants.length === 0 ? 'Aucun participant pour l\'instant.' : 'Aucun résultat.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de la compétition</CardTitle>
                  <CardDescription>
                    Configuration actuelle. Pour modifier, utilisez le bouton "Modifier la compétition".
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Soumissions par jour</label>
                      <Input type="number" value={competition.config.max_submissions_per_day} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Soumissions totales</label>
                      <Input type="number" value={competition.config.max_submissions_total} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Taille max fichier (MB)</label>
                      <Input type="number" value={competition.config.max_file_size_mb} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timeout évaluation (sec)</label>
                      <Input type="number" value={competition.config.execution_timeout_seconds} readOnly />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button asChild>
                      <Link to={`/competitions/${competitionId}/edit`}>Modifier la compétition</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Zone danger */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
                  <CardDescription>Ces actions sont irréversibles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                    <div>
                      <p className="font-medium">Archiver la compétition</p>
                      <p className="text-sm text-muted-foreground">La compétition sera en lecture seule</p>
                    </div>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Archive className="h-4 w-4 mr-2" /> Archiver
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Archiver "{competition.title}" ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            La compétition sera archivée et les soumissions seront désactivées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => { handleStatusChange('archived'); setIsDeleteDialogOpen(false); navigate('/my-competitions'); }}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Archiver
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
