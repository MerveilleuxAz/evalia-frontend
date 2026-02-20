import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { useEvents } from '@/context/EventContext';
import type { EventFilters as EventFiltersType } from '@/types';

type SortOption = 'recent' | 'popular' | 'ending-soon';
type ViewMode = 'grid' | 'list';

export default function Events() {
  const { events, loading, fetchEvents } = useEvents();
  const [filters, setFilters] = useState<EventFiltersType>({
    status: 'all',
    difficulty: 'all',
    theme: 'all',
    search: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchEvents(filters);
  }, [filters, fetchEvents]);

  const handleFilterChange = (newFilters: Partial<EventFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.participants_count - a.stats.participants_count;
      case 'ending-soon':
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="relative py-16 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.02]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4">Compétitions IA</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Événements de Compétition
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Découvrez et participez aux challenges proposés par la communauté IFRI.
              Développez vos compétences et mesurez-vous aux meilleurs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <EventFilters filters={filters} onChange={handleFilterChange} />
          </motion.div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-muted-foreground">
              {loading ? (
                <span className="animate-pulse">Chargement...</span>
              ) : (
                <span>
                  <strong className="text-foreground">{events.length}</strong> événement(s) trouvé(s)
                </span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="popular">Plus populaires</SelectItem>
                  <SelectItem value="ending-soon">Se termine bientôt</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="h-40 bg-muted" />
                  <div className="p-4 space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedEvents.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {sortedEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun événement trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Essayez de modifier vos filtres ou revenez plus tard.
              </p>
              <Button variant="outline" onClick={() => handleFilterChange({
                status: 'all',
                difficulty: 'all',
                theme: 'all',
                search: '',
              })}>
                Réinitialiser les filtres
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
