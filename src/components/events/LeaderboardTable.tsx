import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { LeaderboardEntry } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  isLoading?: boolean;
  metricName?: string;
  isLowerBetter?: boolean;
}

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

const getRankBgClass = (rank: number) => {
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

export function LeaderboardTable({ 
  entries, 
  currentUserId, 
  isLoading,
  metricName = 'Score',
  isLowerBetter = false 
}: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Aucune soumission pour le moment</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Soyez le premier à soumettre un modèle !
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-20">Rang</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead className="text-right">{metricName}</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Soumissions</TableHead>
            <TableHead className="text-right hidden md:table-cell">Dernière soumission</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => {
            const isCurrentUser = entry.user_id === currentUserId;
            const rankIcon = getRankIcon(entry.rank);
            const rankBgClass = getRankBgClass(entry.rank);

            return (
              <motion.tr
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`
                  border-b border-border last:border-0 transition-colors
                  ${isCurrentUser ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/30'}
                  ${rankBgClass}
                `}
              >
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    {rankIcon || <span className="text-muted-foreground">#{entry.rank}</span>}
                    {entry.rank <= 3 && (
                      <span className="font-bold">{entry.rank}</span>
                    )}
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
                <TableCell className="text-right hidden sm:table-cell">
                  <span className="text-muted-foreground">
                    {entry.submissions_count}
                  </span>
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.last_submission), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </span>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
