import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Award,
  Filter,
  Search,
  ArrowRight,
  Users,
  Brain,
  TrendingUp,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { mockLeaderboard } from '@/data/mockData';
import type { LeaderboardEntry, Event } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-500/10 border-yellow-500/20';
    case 2:
      return 'bg-gray-400/10 border-gray-400/20';
    case 3:
      return 'bg-amber-600/10 border-amber-600/20';
    default:
      return '';
  }
};

// Build a global leaderboard by aggregating all events
function buildGlobalLeaderboard(leaderboards: Record<string, LeaderboardEntry[]>): (LeaderboardEntry & { events_count: number })[] {
  const aggregated: Record<string, { user_id: string; user_name: string; user_avatar?: string; total_score: number; total_submissions: number; events_count: number; last_submission: string }> = {};

  Object.values(leaderboards).forEach((entries) => {
    entries.forEach((entry) => {
      if (!aggregated[entry.user_id]) {
        aggregated[entry.user_id] = {
          user_id: entry.user_id,
          user_name: entry.user_name,
          user_avatar: entry.user_avatar,
          total_score: 0,
          total_submissions: 0,
          events_count: 0,
          last_submission: entry.last_submission,
        };
      }
      const agg = aggregated[entry.user_id];
      agg.total_score += entry.best_score;
      agg.total_submissions += entry.submissions_count;
      agg.events_count += 1;
      if (entry.last_submission > agg.last_submission) {
        agg.last_submission = entry.last_submission;
      }
    });
  });

  const sorted = Object.values(aggregated).sort((a, b) => b.events_count - a.events_count || b.total_submissions - a.total_submissions);

  return sorted.map((agg, idx) => ({
    rank: idx + 1,
    user_id: agg.user_id,
    user_name: agg.user_name,
    user_avatar: agg.user_avatar,
    best_score: agg.total_score / agg.events_count,
    submissions_count: agg.total_submissions,
    last_submission: agg.last_submission,
    events_count: agg.events_count,
  }));
}

export default function Leaderboard() {
  const { user } = useAuth();
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('global');
  const [searchQuery, setSearchQuery] = useState('');

  const eventsWithLeaderboard = useMemo(
    () => events.filter((e) => mockLeaderboard[e.id] && mockLeaderboard[e.id].length > 0),
    [events]
  );

  const globalLeaderboard = useMemo(() => buildGlobalLeaderboard(mockLeaderboard), []);

  const currentEntries = useMemo(() => {
    let entries: (LeaderboardEntry & { events_count?: number })[];
    if (selectedEventId === 'global') {
      entries = globalLeaderboard;
    } else {
      entries = mockLeaderboard[selectedEventId] || [];
    }
    if (searchQuery.trim()) {
      entries = entries.filter((e) =>
        e.user_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return entries;
  }, [selectedEventId, searchQuery, globalLeaderboard]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const top3 = currentEntries.filter((e) => e.rank <= 3);
  const rest = currentEntries.filter((e) => e.rank > 3);

  const myEntry = currentEntries.find((e) => e.user_id === user?.id);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 mb-6">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500">Classements</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Consultez les classements par événement ou le classement global de la plateforme.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-full sm:w-72 bg-card/60">
              <SelectValue placeholder="Sélectionner un événement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">
                🌐 Classement global
              </SelectItem>
              {eventsWithLeaderboard.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un participant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/60"
            />
          </div>
        </div>

        {/* Event info banner */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 glass rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h2 className="font-semibold text-lg">{selectedEvent.title}</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {selectedEvent.stats.participants_count} participants
                </span>
                <span>•</span>
                <span>Métrique : {selectedEvent.metrics.find((m) => m.is_primary)?.name}</span>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to={`/events/${selectedEvent.id}`}>
                Voir l'événement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}

        {/* My rank card */}
        {myEntry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Votre position</p>
                  <p className="font-display font-bold text-2xl">
                    #{myEntry.rank}{' '}
                    <span className="text-base font-normal text-muted-foreground">
                      / {currentEntries.length} participants
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Meilleur score</p>
                  <p className="font-mono font-semibold text-lg">{myEntry.best_score.toFixed(4)}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Podium */}
        {top3.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto items-end">
              {/* 2nd place */}
              <div className="text-center">
                <div className="glass rounded-xl p-4 pt-6">
                  <Avatar className="w-14 h-14 mx-auto mb-2 ring-2 ring-gray-400/40">
                    <AvatarImage src={top3[1]?.user_avatar} />
                    <AvatarFallback>{top3[1]?.user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Medal className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="font-semibold text-sm truncate">{top3[1]?.user_name}</p>
                  <p className="font-mono text-lg font-bold">{top3[1]?.best_score.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">{top3[1]?.submissions_count} soumissions</p>
                </div>
              </div>

              {/* 1st place */}
              <div className="text-center -mt-4">
                <div className="glass rounded-xl p-4 pt-6 border-yellow-500/30 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-950 text-xs font-bold px-3 py-0.5 rounded-full">
                    👑 1er
                  </div>
                  <Avatar className="w-16 h-16 mx-auto mb-2 ring-2 ring-yellow-500/40">
                    <AvatarImage src={top3[0]?.user_avatar} />
                    <AvatarFallback>{top3[0]?.user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Trophy className="h-7 w-7 text-yellow-500 mx-auto mb-1" />
                  <p className="font-semibold truncate">{top3[0]?.user_name}</p>
                  <p className="font-mono text-xl font-bold gradient-text">{top3[0]?.best_score.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">{top3[0]?.submissions_count} soumissions</p>
                </div>
              </div>

              {/* 3rd place */}
              <div className="text-center">
                <div className="glass rounded-xl p-4 pt-6">
                  <Avatar className="w-14 h-14 mx-auto mb-2 ring-2 ring-amber-600/40">
                    <AvatarImage src={top3[2]?.user_avatar} />
                    <AvatarFallback>{top3[2]?.user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Award className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                  <p className="font-semibold text-sm truncate">{top3[2]?.user_name}</p>
                  <p className="font-mono text-lg font-bold">{top3[2]?.best_score.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">{top3[2]?.submissions_count} soumissions</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Table */}
        {currentEntries.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-20">Rang</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead className="text-right">
                    {selectedEventId === 'global' ? 'Score moyen' : selectedEvent?.metrics.find((m) => m.is_primary)?.name || 'Score'}
                  </TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Soumissions</TableHead>
                  {selectedEventId === 'global' && (
                    <TableHead className="text-right hidden md:table-cell">Événements</TableHead>
                  )}
                  <TableHead className="text-right hidden md:table-cell">Dernière activité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEntries.map((entry, index) => {
                  const isCurrentUser = entry.user_id === user?.id;
                  const icon = getRankIcon(entry.rank);

                  return (
                    <motion.tr
                      key={entry.user_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className={`
                        border-b border-border last:border-0 transition-colors
                        ${isCurrentUser ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/30'}
                        ${getRankBg(entry.rank)}
                      `}
                    >
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-2">
                          {icon || <span className="text-muted-foreground">#{entry.rank}</span>}
                          {entry.rank <= 3 && <span className="font-bold">{entry.rank}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={entry.user_avatar} />
                            <AvatarFallback className="text-xs">
                              {entry.user_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className={`font-medium ${isCurrentUser ? 'text-primary' : ''}`}>
                              {entry.user_name}
                            </span>
                            {isCurrentUser && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Vous
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono font-semibold text-lg">
                          {entry.best_score.toFixed(4)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell text-muted-foreground">
                        {entry.submissions_count}
                      </TableCell>
                      {selectedEventId === 'global' && (
                        <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                          {(entry as any).events_count || '-'}
                        </TableCell>
                      )}
                      <TableCell className="text-right hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.last_submission), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <Trophy className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Aucun résultat trouvé</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Essayez de modifier vos filtres ou participez à une compétition !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
