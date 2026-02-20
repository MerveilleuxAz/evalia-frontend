import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Clock, 
  ArrowRight,
  Play,
  CheckCircle,
  Archive,
  Timer
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Event, EventStatus } from '@/types';
import { formatDistanceToNow, format, isPast, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  index?: number;
}

const statusConfig: Record<EventStatus, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  upcoming: { label: 'À venir', icon: Clock, className: 'status-upcoming' },
  active: { label: 'Actif', icon: Play, className: 'status-active' },
  finished: { label: 'Terminé', icon: CheckCircle, className: 'status-finished' },
  archived: { label: 'Archivé', icon: Archive, className: 'status-archived' },
};

const difficultyLabels = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

const themeLabels = {
  classification: 'Classification',
  regression: 'Régression',
  nlp: 'NLP',
  vision: 'Vision',
  other: 'Autre',
};

export function EventCard({ event, index = 0 }: EventCardProps) {
  const status = statusConfig[event.status];
  const StatusIcon = status.icon;
  
  const getTimeInfo = () => {
    const endDate = new Date(event.end_date);
    const startDate = new Date(event.start_date);
    
    if (event.status === 'active') {
      return `Se termine ${formatDistanceToNow(endDate, { addSuffix: true, locale: fr })}`;
    }
    if (event.status === 'upcoming') {
      return `Commence ${formatDistanceToNow(startDate, { addSuffix: true, locale: fr })}`;
    }
    return `Terminé le ${format(endDate, 'dd MMM yyyy', { locale: fr })}`;
  };

  const getCTAButton = () => {
    switch (event.status) {
      case 'upcoming':
        return (
          <Button variant="outline" size="sm" className="w-full gap-2 group">
            S'informer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        );
      case 'active':
        return (
          <Button size="sm" className="w-full gap-2 group bg-primary hover:bg-primary/90">
            Participer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        );
      case 'finished':
      case 'archived':
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
      <Link to={`/events/${event.id}`}>
        <div className="relative h-full bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
          {/* Banner Image */}
          <div className="relative h-40 overflow-hidden">
            <img
              src={event.banner_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop'}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${status.className} border gap-1.5`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            {/* Theme Badge */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
                {themeLabels[event.theme]}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Title */}
            <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>

            {/* Organizer */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.organizer.avatar} />
                <AvatarFallback className="text-xs">
                  {event.organizer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {event.organizer.name}
              </span>
            </div>

            {/* Time Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4 flex-shrink-0" />
              <span>{getTimeInfo()}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.stats.participants_count}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Badge variant="outline" className="text-xs">
                  {difficultyLabels[event.difficulty]}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 text-warning" />
                <span className="font-mono">{event.stats.best_score.toFixed(3)}</span>
              </div>
            </div>

            {/* CTA */}
            <div onClick={(e) => e.preventDefault()}>
              {getCTAButton()}
            </div>
          </div>

          {/* My Participation Indicator */}
          {event.my_participation?.is_joined && (
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-primary border-l-[40px] border-l-transparent">
              <CheckCircle className="absolute -top-[32px] right-[4px] h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
