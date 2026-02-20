import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventFilters as EventFiltersType } from '@/types';

interface EventFiltersProps {
  filters: EventFiltersType;
  onChange: (filters: Partial<EventFiltersType>) => void;
}

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'active', label: 'Actifs' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'finished', label: 'Terminés' },
  { value: 'archived', label: 'Archivés' },
];

const difficultyOptions = [
  { value: 'all', label: 'Toutes difficultés' },
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
];

const themeOptions = [
  { value: 'all', label: 'Toutes thématiques' },
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Régression' },
  { value: 'nlp', label: 'NLP' },
  { value: 'vision', label: 'Vision' },
  { value: 'other', label: 'Autre' },
];

export function EventFilters({ filters, onChange }: EventFiltersProps) {
  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.difficulty !== 'all' || 
    filters.theme !== 'all' || 
    filters.search !== '';

  const clearFilters = () => {
    onChange({
      status: 'all',
      difficulty: 'all',
      theme: 'all',
      search: '',
    });
  };

  const activeFilterCount = [
    filters.status !== 'all',
    filters.difficulty !== 'all',
    filters.theme !== 'all',
    filters.search !== '',
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un événement..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="pl-10 bg-card"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          value={filters.status}
          onValueChange={(value) => onChange({ status: value as EventFiltersType['status'] })}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.difficulty}
          onValueChange={(value) => onChange({ difficulty: value as EventFiltersType['difficulty'] })}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Difficulté" />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.theme}
          onValueChange={(value) => onChange({ theme: value as EventFiltersType['theme'] })}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Thématique" />
          </SelectTrigger>
          <SelectContent>
            {themeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filtres actifs:</span>
          </div>
          
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {statusOptions.find(o => o.value === filters.status)?.label}
              <button onClick={() => onChange({ status: 'all' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.difficulty !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {difficultyOptions.find(o => o.value === filters.difficulty)?.label}
              <button onClick={() => onChange({ difficulty: 'all' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.theme !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {themeOptions.find(o => o.value === filters.theme)?.label}
              <button onClick={() => onChange({ theme: 'all' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              "{filters.search}"
              <button onClick={() => onChange({ search: '' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Effacer tout
          </Button>
        </div>
      )}
    </div>
  );
}
