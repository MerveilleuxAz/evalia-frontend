import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  FileText,
  Settings,
  BarChart3,
  Mail,
  Play,
  Pause,
  Archive,
  Trash2,
  Download,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/context/EventContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock data for participants and submissions
const mockParticipants = [
  { id: '1', name: 'Jean Dupont', email: 'jean@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean', joined_at: '2026-01-05T10:30:00Z', submissions_count: 12, best_score: 0.892 },
  { id: '2', name: 'Marie Martin', email: 'marie@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie', joined_at: '2026-01-06T14:20:00Z', submissions_count: 8, best_score: 0.915 },
  { id: '3', name: 'Pierre Bernard', email: 'pierre@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre', joined_at: '2026-01-07T09:15:00Z', submissions_count: 15, best_score: 0.878 },
  { id: '4', name: 'Sophie Leroy', email: 'sophie@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', joined_at: '2026-01-08T16:45:00Z', submissions_count: 5, best_score: 0.901 },
  { id: '5', name: 'Lucas Moreau', email: 'lucas@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', joined_at: '2026-01-09T11:00:00Z', submissions_count: 20, best_score: 0.945 },
];

const mockAllSubmissions = [
  { id: 's1', user_name: 'Lucas Moreau', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', file_name: 'model_v5.pkl', submitted_at: '2026-01-15T14:30:00Z', status: 'evaluated', score: 0.945 },
  { id: 's2', user_name: 'Marie Martin', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie', file_name: 'submission_final.h5', submitted_at: '2026-01-15T13:45:00Z', status: 'evaluated', score: 0.915 },
  { id: 's3', user_name: 'Sophie Leroy', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', file_name: 'best_model.pt', submitted_at: '2026-01-15T12:20:00Z', status: 'processing', score: null },
  { id: 's4', user_name: 'Jean Dupont', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean', file_name: 'model_attempt_12.pkl', submitted_at: '2026-01-15T11:10:00Z', status: 'evaluated', score: 0.892 },
  { id: 's5', user_name: 'Pierre Bernard', user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre', file_name: 'neural_net.h5', submitted_at: '2026-01-15T10:05:00Z', status: 'error', score: null, error: 'Timeout during evaluation' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  upcoming: { label: 'À venir', color: 'bg-blue-500/20 text-blue-400', icon: Clock },
  active: { label: 'Actif', color: 'bg-green-500/20 text-green-400', icon: Play },
  finished: { label: 'Terminé', color: 'bg-gray-500/20 text-gray-400', icon: CheckCircle },
  archived: { label: 'Archivé', color: 'bg-slate-500/20 text-slate-400', icon: Archive },
};

export default function ManageEvent() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentEvent, fetchEventById, loading } = useEvents();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [participantFilter, setParticipantFilter] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId);
    }
  }, [eventId, fetchEventById]);

  const handleStatusChange = (newStatus: string) => {
    toast({
      title: "Statut mis à jour",
      description: `L'événement est maintenant "${statusConfig[newStatus]?.label || newStatus}".`,
    });
  };

  const handleExcludeParticipant = (participantId: string, participantName: string) => {
    toast({
      title: "Participant exclu",
      description: `${participantName} a été exclu de l'événement.`,
      variant: "destructive"
    });
  };

  const handleDeleteSubmission = (submissionId: string) => {
    toast({
      title: "Soumission supprimée",
      description: "La soumission a été supprimée avec succès.",
    });
  };

  const handleDeleteEvent = () => {
    toast({
      title: "Événement supprimé",
      description: "L'événement a été définitivement supprimé.",
      variant: "destructive"
    });
    navigate('/events');
  };

  const handleExportParticipants = () => {
    toast({
      title: "Export en cours",
      description: "Le fichier CSV sera téléchargé dans quelques instants.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-12 w-96 mb-8" />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 flex items-center justify-center">
        <Card className="glass border-border/50 max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Événement non trouvé</h2>
            <p className="text-muted-foreground mb-4">
              L'événement demandé n'existe pas ou vous n'avez pas les droits pour le gérer.
            </p>
            <Button onClick={() => navigate('/events')}>
              Retour aux événements
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusConfig[currentEvent.status]?.icon || Clock;
  const filteredParticipants = mockParticipants.filter(p =>
    p.name.toLowerCase().includes(participantFilter.toLowerCase()) ||
    p.email.toLowerCase().includes(participantFilter.toLowerCase())
  );
  const filteredSubmissions = mockAllSubmissions.filter(s =>
    submissionFilter === 'all' || s.status === submissionFilter
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/events/${eventId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'événement
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  {currentEvent.title}
                </h1>
                <Badge className={statusConfig[currentEvent.status]?.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[currentEvent.status]?.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Gérez les participants, soumissions et paramètres de votre événement
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/events/${eventId}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir la page
                </Link>
              </Button>
              <Select
                value={currentEvent.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">À venir</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="finished">Terminé</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentEvent.stats.participants_count}</p>
                  <p className="text-sm text-muted-foreground">Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-secondary/20">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentEvent.stats.submissions_count}</p>
                  <p className="text-sm text-muted-foreground">Soumissions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(currentEvent.stats.best_score * 100).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Meilleur score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <BarChart3 className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round((currentEvent.stats.submissions_count / currentEvent.stats.participants_count) * 10) / 10}
                  </p>
                  <p className="text-sm text-muted-foreground">Soum./participant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="submissions">Soumissions</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Event Info */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thématique</span>
                    <Badge variant="outline">{currentEvent.theme}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulté</span>
                    <Badge variant="outline">{currentEvent.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Métrique principale</span>
                    <span className="font-medium">
                      {currentEvent.metrics.find(m => m.is_primary)?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Début</span>
                    <span>
                      {format(new Date(currentEvent.start_date), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fin</span>
                    <span>
                      {format(new Date(currentEvent.end_date), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportParticipants}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les participants (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email aux participants
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir le leaderboard
                  </Button>
                  {currentEvent.status === 'active' && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-warning"
                      onClick={() => handleStatusChange('finished')}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Clôturer l'événement
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass border-border/50 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAllSubmissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={submission.user_avatar} />
                          <AvatarFallback>{submission.user_name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{submission.user_name}</span>
                            {' '}a soumis{' '}
                            <span className="text-muted-foreground">{submission.file_name}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(submission.submitted_at), 'dd MMM à HH:mm', { locale: fr })}
                          </p>
                        </div>
                        {submission.status === 'evaluated' && submission.score && (
                          <Badge variant="outline">
                            {(submission.score * 100).toFixed(1)}%
                          </Badge>
                        )}
                        {submission.status === 'processing' && (
                          <Badge variant="secondary">En cours</Badge>
                        )}
                        {submission.status === 'error' && (
                          <Badge variant="destructive">Erreur</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <Card className="glass border-border/50">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Participants ({mockParticipants.length})</CardTitle>
                    <CardDescription>Gérez les inscriptions à votre événement</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher..."
                      value={participantFilter}
                      onChange={(e) => setParticipantFilter(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button variant="outline" onClick={handleExportParticipants}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Inscrit le</TableHead>
                      <TableHead className="text-center">Soumissions</TableHead>
                      <TableHead className="text-center">Meilleur score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>{participant.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-xs text-muted-foreground">{participant.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(participant.joined_at), 'dd MMM yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell className="text-center">
                          {participant.submissions_count}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {(participant.best_score * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Ban className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Exclure ce participant ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {participant.name} sera exclu de l'événement. Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleExcludeParticipant(participant.id, participant.name)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Exclure
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card className="glass border-border/50">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Soumissions ({mockAllSubmissions.length})</CardTitle>
                    <CardDescription>Toutes les soumissions de l'événement</CardDescription>
                  </div>
                  <Select value={submissionFilter} onValueChange={setSubmissionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="processing">En cours</SelectItem>
                      <SelectItem value="evaluated">Évalué</SelectItem>
                      <SelectItem value="error">Erreur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Fichier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={submission.user_avatar} />
                              <AvatarFallback>{submission.user_name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{submission.user_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {submission.file_name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(submission.submitted_at), 'dd MMM HH:mm', { locale: fr })}
                        </TableCell>
                        <TableCell className="text-center">
                          {submission.status === 'evaluated' && (
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Évalué
                            </Badge>
                          )}
                          {submission.status === 'processing' && (
                            <Badge className="bg-blue-500/20 text-blue-400">
                              <Clock className="h-3 w-3 mr-1" />
                              En cours
                            </Badge>
                          )}
                          {submission.status === 'pending' && (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              <Clock className="h-3 w-3 mr-1" />
                              En attente
                            </Badge>
                          )}
                          {submission.status === 'error' && (
                            <Badge className="bg-red-500/20 text-red-400">
                              <XCircle className="h-3 w-3 mr-1" />
                              Erreur
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {submission.score ? (
                            <span className="font-medium">
                              {(submission.score * 100).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer cette soumission ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible. La soumission sera définitivement supprimée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSubmission(submission.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Paramètres de l'événement</CardTitle>
                  <CardDescription>
                    Modifiez les paramètres de votre événement
                    {currentEvent.status === 'active' && (
                      <span className="text-warning ml-2">
                        (certains paramètres sont verrouillés car l'événement est actif)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Soumissions par jour</label>
                      <Input
                        type="number"
                        value={currentEvent.rules.max_submissions_per_day}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Soumissions totales</label>
                      <Input
                        type="number"
                        value={currentEvent.rules.max_submissions_total}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Taille max fichier (MB)</label>
                      <Input
                        type="number"
                        value={currentEvent.rules.max_file_size_mb}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timeout évaluation (min)</label>
                      <Input
                        type="number"
                        value={currentEvent.rules.timeout_minutes}
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      Sauvegarder les modifications
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="glass border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
                  <CardDescription>
                    Ces actions sont irréversibles. Procédez avec prudence.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                    <div>
                      <p className="font-medium">Supprimer l'événement</p>
                      <p className="text-sm text-muted-foreground">
                        Supprime définitivement l'événement et toutes les données associées
                      </p>
                    </div>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. L'événement "{currentEvent.title}" 
                            et toutes les données associées (participants, soumissions, classement) 
                            seront définitivement supprimés.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteEvent}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Oui, supprimer définitivement
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
