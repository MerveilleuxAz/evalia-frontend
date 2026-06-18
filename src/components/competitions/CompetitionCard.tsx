import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Clock, 
  ArrowRight,
  Play,
  CheckCircle,
  Archive,
  Timer,
  Upload,
  AlignLeft
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CompetitionCardProps {
  competition: any;
  index?: number;
}

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  upcoming: { label: 'À venir', icon: Clock, className: 'status-upcoming' },
  active: { label: 'Actif', icon: Play, className: 'status-active' },
  finished: { label: 'Terminé', icon: CheckCircle, className: 'status-finished' },
  closed: { label: 'Fermé', icon: CheckCircle, className: 'status-finished' },
  archived: { label: 'Archivé', icon: Archive, className: 'status-archived' },
  draft: { label: 'Brouillon', icon: Archive, className: 'status-archived' },
};

const themeLabels: Record<string, string> = {
  classification: 'Classification',
  regression: 'Régression',
  nlp: 'NLP',
  vision: 'Vision',
  other: 'Autre',
};

export function CompetitionCard({ competition, index = 0 }: CompetitionCardProps) {
  const status = statusConfig[competition.status || 'archived'] || statusConfig.archived;
  const StatusIcon = status.icon;
  
  const getTimeInfo = () => {
    try {
      const endDate = competition.calendar?.end_date ? new Date(competition.calendar.end_date) : new Date();
      const startDate = competition.calendar?.start_date ? new Date(competition.calendar.start_date) : new Date();
      
      if (competition.status === 'active') {
        return `Se termine ${formatDistanceToNow(endDate, { addSuffix: true, locale: fr })}`;
      }
      if (competition.status === 'upcoming') {
        return `Commence ${formatDistanceToNow(startDate, { addSuffix: true, locale: fr })}`;
      }
      return `Terminé le ${format(endDate, 'dd MMM yyyy', { locale: fr })}`;
    } catch (e) {
      return 'Date inconnue';
    }
  };

  const getCTAButton = () => {
    switch (competition.status) {
      case 'upcoming':
        return (
          <Button variant="outline" size="sm" className="w-full gap-2 group">
            S'informer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        );
      case 'active':
        if (competition.my_participation?.is_joined) {
          return (
            <Button size="sm" variant="secondary" className="w-full gap-2 group">
              Déjà inscrit
              <CheckCircle className="h-4 w-4" />
            </Button>
          );
        }
        return (
          <Button size="sm" className="w-full gap-2 group bg-primary hover:bg-primary/90">
            Participer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        );
      default:
        return (
          <Button variant="secondary" size="sm" className="w-full gap-2 group">
            Voir résultats
            <Trophy className="h-4 w-4" />
          </Button>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/competitions/${competition.id}`}>
        <div className="relative h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
          {/* Banner Image */}
          <div className="relative h-40 flex-shrink-0 overflow-hidden">
            <img
              src={competition.banner_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop'}
              alt={competition.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${status.className} border gap-1.5 shadow-sm backdrop-blur-md`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            {/* Theme Badge */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-card/90 backdrop-blur-md shadow-sm">
                {themeLabels[competition.task_type || 'other'] || 'Autre'}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {competition.title}
            </h3>

            {/* Description Snippet */}
            <div className="mb-4 text-sm text-muted-foreground line-clamp-2">
              <AlignLeft className="inline-block h-4 w-4 mr-1 -mt-0.5 opacity-50" />
              {competition.description || competition.problem_statement || 'Aucune description disponible pour cette compétition.'}
            </div>

            {/* Spacer to push stats to the bottom */}
            <div className="flex-grow min-h-[1rem]"></div>

            {/* Time Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Timer className="h-4 w-4 flex-shrink-0 text-primary/60" />
              <span className="font-medium text-foreground/80">{getTimeInfo()}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 pb-4 border-t border-border">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground" title="Participants">
                <Users className="h-4 w-4" />
                <span className="font-medium text-foreground">{competition.stats?.participants || 0}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground" title="Soumissions totales">
                <Upload className="h-4 w-4" />
                <span className="font-medium text-foreground">{competition.stats?.total_submissions || 0}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-sm" title="Métrique d'évaluation">
                <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0">
                  {competition.metrics?.info?.label || competition.metrics?.primary || 'Score'}
                </Badge>
              </div>
            </div>

            {/* CTA */}
            <div onClick={(e) => e.preventDefault()} className="mt-auto">
              {getCTAButton()}
            </div>
          </div>

          {/* My Participation Indicator */}
          {competition.my_participation?.is_joined && (
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-primary border-l-[40px] border-l-transparent z-10">
              <CheckCircle className="absolute -top-[32px] right-[4px] h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
