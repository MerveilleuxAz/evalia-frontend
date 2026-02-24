import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Edit3, Settings, LogOut, Trophy, Target, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

export default function Profile() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Mon Profil</h1>
                    <p className="text-muted-foreground">Gérez vos informations personnelles et votre compte.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* User Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <Card className="border-border/60 overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20" />
                            <CardContent className="p-6 -mt-12 text-center">
                                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                                <Badge variant="secondary" className="mb-4">
                                    {user.role === 'organisateur' ? 'Propriétaire' : user.role === 'administrateur' ? 'Administrateur' : 'Participant'}
                                </Badge>

                                <div className="space-y-3 pt-4 border-t border-border/50 text-left">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Inscrit le {formatDate(user.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        <span className="capitalize">{user.role}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <Button variant="outline" className="w-full gap-2">
                                        <Edit3 className="h-4 w-4" />
                                        Modifier le profil
                                    </Button>
                                    <Button variant="ghost" className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                                        <LogOut className="h-4 w-4" />
                                        Se déconnecter
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/60">
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium">Paramètres</CardTitle>
                                <Settings className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <ul className="text-sm space-y-1">
                                    <li><button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted transition-colors">Notifications</button></li>
                                    <li><button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted transition-colors">Sécurité</button></li>
                                    <li><button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted transition-colors">Langue</button></li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Stats Cards (Participant perspective) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="bg-card/50 border-border/60">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Trophy className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Compétitions</p>
                                        <p className="text-2xl font-bold">0</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 border-border/60">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-secondary/10 rounded-lg">
                                        <Target className="h-6 w-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Soumissions</p>
                                        <p className="text-2xl font-bold">0</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 border-border/60">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Zap className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Points</p>
                                        <p className="text-2xl font-bold">0</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Account Details */}
                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle>Détails du compte</CardTitle>
                                <CardDescription>Informations visibles par les autres membres.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Nom d'affichage</p>
                                        <p>{user.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <p>{user.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">ID Utilisateur</p>
                                        <code className="text-xs">{user.id}</code>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border/50">
                                    <h3 className="text-lg font-semibold mb-4">Biographie</h3>
                                    <p className="text-muted-foreground text-sm italic">
                                        Aucune biographie n'a été ajoutée pour le moment.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions for Organizers */}
                        {user.role === 'organisateur' && (
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-primary flex items-center gap-2">
                                        <Zap className="h-5 w-5" />
                                        Actions Rapides Oganisateur
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid sm:grid-cols-2 gap-4">
                                    <Button asChild className="w-full">
                                        <a href="/events/create">Créer une compétition</a>
                                    </Button>
                                    <Button variant="outline" asChild className="w-full">
                                        <a href="/my-events">Mes compétitions</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
