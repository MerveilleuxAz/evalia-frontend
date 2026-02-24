import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Trophy,
    Upload,
    Activity,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const adminStats = [
    {
        title: "Total Utilisateurs",
        value: "1,248",
        change: "+12%",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "Événements Actifs",
        value: "14",
        change: "+2",
        icon: Trophy,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        title: "Soumissions (24h)",
        value: "342",
        change: "+24%",
        icon: Upload,
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        title: "Taux de Réussite",
        value: "82.4%",
        change: "+1.2%",
        icon: Activity,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    }
];

const recentActivity = [
    {
        id: 1,
        type: "user_reg",
        user: "Ousmane Drabo",
        event: "Nouveau compte créé",
        time: "Il y a 10 min",
        status: "success"
    },
    {
        id: 2,
        type: "event_sub",
        user: "Aïcha Touré",
        event: "Soumission challenge 'Vision'",
        time: "Il y a 25 min",
        status: "pending"
    },
    {
        id: 3,
        type: "report",
        user: "Système",
        event: "Alerte : Pic de charge serveur",
        time: "Il y a 1h",
        status: "warning"
    },
];

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-background pt-16">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <header>
                        <h1 className="text-3xl font-display font-bold">Tableau de bord Administrateur</h1>
                        <p className="text-muted-foreground mt-2">Bienvenue dans l'interface de gestion globale d'EvalIA.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {adminStats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </CardTitle>
                                        <div className={cn("p-2 rounded-lg", stat.bg)}>
                                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                            <span className="text-green-500 font-medium">{stat.change}</span>
                                            celui-ci ce mois
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Activités Récentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Utilisateur</TableHead>
                                                <TableHead>Action</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Statut</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentActivity.map((activity) => (
                                                <TableRow key={activity.id}>
                                                    <TableCell className="font-medium">{activity.user}</TableCell>
                                                    <TableCell>{activity.event}</TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">{activity.time}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={activity.status === 'warning' ? 'destructive' : 'secondary'} className="capitalize">
                                                            {activity.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Alertes Système</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4 p-4 rounded-xl border border-warning/20 bg-warning/5">
                                    <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-sm">Base de données</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Optimisation des index recommandée pour les soumissions.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                                    <TrendingUp className="h-5 w-5 text-primary shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-sm">Trafic Utilisateurs</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Nouveau record d'utilisateurs simultanés (312).</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
