import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, BarChart3, Edit, Eye, MessageSquare, Calendar, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockEvents } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const stagger = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function MyEvents() {
    const { user } = useAuth();

    if (!user || user.role !== 'organisateur') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
                    <p className="text-muted-foreground mb-4">Cette page est réservée aux organisateurs.</p>
                    <Button asChild><Link to="/">Retour à l'accueil</Link></Button>
                </div>
            </div>
        );
    }

    // Filter events organized by the current user
    // Since mock data has specific organizer IDs, we match by name or ID if possible
    const organizerEvents = mockEvents.filter(e => e.organizer.id === user.id || e.organizer.name === user.name);

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Mes Compétitions</h1>
                        <p className="text-muted-foreground">Gérez vos événements et suivez les performances des participants.</p>
                    </motion.div>
                    <Button asChild className="gap-2">
                        <Link to="/events/create">
                            <Plus className="h-4 w-4" />
                            Créer une compétition
                        </Link>
                    </Button>
                </div>

                {organizerEvents.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {organizerEvents.map((event, i) => (
                            <motion.div
                                key={event.id}
                                {...stagger}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <Card className="h-full border-border/60 hover:border-primary/30 transition-all flex flex-col group">
                                    <div className="relative h-40 overflow-hidden rounded-t-xl">
                                        <img
                                            src={event.banner_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop'}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Badge variant={event.status === 'active' ? 'default' : 'secondary'} className="capitalize shadow-sm">
                                                {event.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{event.description_short}</CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    <span>Participants</span>
                                                </div>
                                                <p className="font-semibold">{event.stats.participants_count}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <BarChart3 className="h-3 w-3" />
                                                    <span>Soumissions</span>
                                                </div>
                                                <p className="font-semibold">{event.stats.submissions_count}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-4">
                                            <Calendar className="h-3 w-3" />
                                            <span>Fin le {new Date(event.end_date).toLocaleDateString()}</span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="grid grid-cols-2 gap-2 border-t border-border/50 pt-4">
                                        <Button variant="outline" size="sm" asChild className="gap-2">
                                            <Link to={`/events/${event.id}/manage`}>
                                                <Edit className="h-3 w-3" />
                                                Gérer
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild className="gap-2">
                                            <Link to={`/events/${event.slug}`}>
                                                <Eye className="h-3 w-3" />
                                                Voir
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        {...stagger}
                        className="text-center py-20 glass rounded-3xl"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                            <Trophy className="h-10 w-10 text-primary opacity-50" />
                        </div>
                        <h2 className="text-2xl font-display font-bold mb-4">Vous n'avez pas encore d'événements</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            Lancez votre premier challenge et réunissez la communauté IA autour de vos problématiques.
                        </p>
                        <Button asChild size="lg">
                            <Link to="/events/create">Créer une compétition</Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
