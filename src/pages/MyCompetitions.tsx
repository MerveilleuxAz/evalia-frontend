import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, BarChart3, Edit, Eye, Calendar, Trophy, Play } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserDashboard } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const stagger = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function MyCompetitions() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
                    <p className="text-muted-foreground mb-4">Veuillez vous connecter pour accéder à vos compétitions.</p>
                    <Button asChild><Link to="/login">Se connecter</Link></Button>
                </div>
            </div>
        );
    }

    const { data: dashboardData, isLoading } = useUserDashboard();
    
    // Fallback safely if dashboardData is not fully loaded
    const joinedCompetitions = dashboardData?.competitions?.joined?.list || [];
    const createdCompetitions = dashboardData?.competitions?.created?.list || [];

    if (isLoading) {
        return <div className="min-h-screen pt-32 text-center text-muted-foreground">Chargement de vos compétitions...</div>;
    }

    const renderCompetitionsGrid = (competitions: any[], isCreator: boolean) => {
        if (competitions.length === 0) {
            return (
                <motion.div
                    {...stagger}
                    className="text-center py-20 glass rounded-3xl"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                        <Trophy className="h-10 w-10 text-primary opacity-50" />
                    </div>
                    <h2 className="text-2xl font-display font-bold mb-4">
                        {isCreator ? "Vous n'avez pas encore de compétitions" : "Vous n'avez rejoint aucune compétition"}
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        {isCreator 
                            ? "Lancez votre premier challenge et réunissez la communauté IA autour de vos problématiques." 
                            : "Parcourez la liste des compétitions actives et commencez à soumettre vos modèles."}
                    </p>
                    <Button asChild size="lg">
                        <Link to={isCreator ? "/competitions/create" : "/competitions"}>
                            {isCreator ? "Créer une compétition" : "Parcourir les compétitions"}
                        </Link>
                    </Button>
                </motion.div>
            );
        }

        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map((competition, i) => (
                    <motion.div
                        key={competition.id}
                        {...stagger}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                        <Card className="h-full border-border/60 hover:border-primary/30 transition-all flex flex-col group">
                            <div className="relative h-40 overflow-hidden rounded-t-xl">
                                <img
                                    src={competition.banner_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop'}
                                    alt={competition.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge variant={competition.status === 'active' ? 'default' : 'secondary'} className="capitalize shadow-sm">
                                        {competition.status}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader>
                                <CardTitle className="line-clamp-1">{competition.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{competition.description_short}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Users className="h-3 w-3" />
                                            <span>Participants</span>
                                        </div>
                                        <p className="font-semibold">{competition.stats?.participants_count || 0}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <BarChart3 className="h-3 w-3" />
                                            <span>Soumissions</span>
                                        </div>
                                        <p className="font-semibold">{competition.stats?.submissions_count || 0}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-4">
                                    <Calendar className="h-3 w-3" />
                                    <span>Fin le {new Date(competition.end_date).toLocaleDateString()}</span>
                                </div>
                            </CardContent>

                            <CardFooter className="grid grid-cols-2 gap-2 border-t border-border/50 pt-4">
                                {isCreator ? (
                                    <Button variant="outline" size="sm" asChild className="gap-2">
                                        <Link to={`/competitions/${competition.id}/manage`}>
                                            <Edit className="h-3 w-3" />
                                            Gérer
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" asChild className="gap-2 w-full">
                                        <Link to={`/competitions/${competition.id}/submit`}>
                                            <Play className="h-3 w-3" />
                                            Soumettre
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" asChild className="gap-2">
                                    <Link to={`/competitions/${competition.id}`}>
                                        <Eye className="h-3 w-3" />
                                        Voir
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Espace Personnel</h1>
                        <p className="text-muted-foreground">Suivez vos participations et gérez vos créations.</p>
                    </motion.div>
                    <Button asChild className="gap-2">
                        <Link to="/competitions/create">
                            <Plus className="h-4 w-4" />
                            Créer une compétition
                        </Link>
                    </Button>
                </div>

                <Tabs defaultValue="participations" className="w-full">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
                        <TabsTrigger value="participations">Mes Participations</TabsTrigger>
                        <TabsTrigger value="creations">Mes Créations</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="participations" className="space-y-4">
                        {renderCompetitionsGrid(joinedCompetitions, false)}
                    </TabsContent>
                    
                    <TabsContent value="creations" className="space-y-4">
                        {renderCompetitionsGrid(createdCompetitions, true)}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
