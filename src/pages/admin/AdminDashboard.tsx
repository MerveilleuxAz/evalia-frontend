import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Trophy,
    Upload,
    Activity,
    TrendingUp,
    AlertCircle,
    Server,
    Cpu,
    Database,
    Loader2
} from 'lucide-react';
import { cn } from "@/lib/utils";
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
import {
    useAdminUsers,
    useAdminCompetitions,
    useAdminSubmissions,
    useAdminSystem
} from '@/hooks/useApi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminDashboard() {
    const { data: usersData, isLoading: isLoadingUsers } = useAdminUsers();
    const { data: compsData, isLoading: isLoadingComps } = useAdminCompetitions();
    const { data: subsData, isLoading: isLoadingSubs } = useAdminSubmissions();
    const { data: systemData, isLoading: isLoadingSystem } = useAdminSystem();

    const totalUsers = usersData?.pagination?.total || 0;
    const totalCompetitions = compsData?.pagination?.total || 0;
    const totalSubmissions = subsData?.pagination?.total || 0;
    
    // Calcul du taux de réussite sur les soumissions
    const submissionsList = subsData?.submissions || [];
    const evaluatedSubs = submissionsList.filter((s: any) => s.status === 'evaluated' || s.status === 'completed');
    const successRate = totalSubmissions > 0
        ? ((evaluatedSubs.length / totalSubmissions) * 100).toFixed(1)
        : '0.0';

    const adminStats = [
        {
            title: "Total Utilisateurs",
            value: totalUsers,
            change: "Membres actifs",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Compétitions",
            value: totalCompetitions,
            change: "Créées",
            icon: Trophy,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Soumissions",
            value: totalSubmissions,
            change: "Modèles soumis",
            icon: Upload,
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            title: "Taux de Réussite",
            value: `${successRate}%`,
            change: "Évaluations réussies",
            icon: Activity,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'evaluated':
                return 'bg-success/10 text-success border-success/20';
            case 'pending':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'processing':
                return 'bg-primary/10 text-primary border-primary/20';
            default:
                return 'bg-destructive/10 text-destructive border-destructive/20';
        }
    };

    return (
        <div className="flex min-h-screen bg-background pt-16">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <header>
                        <h1 className="text-3xl font-display font-bold">Tableau de bord Administrateur</h1>
                        <p className="text-muted-foreground mt-2">Supervision en temps réel des ressources et de l'activité globale.</p>
                    </header>

                    {/* Stats Grid */}
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
                                            <span>{stat.change}</span>
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Activity */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Dernières soumissions de modèles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingSubs ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : submissionsList.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Fichier / ID</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead className="text-right">Score</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {submissionsList.slice(0, 5).map((activity: any) => (
                                                    <TableRow key={activity.id}>
                                                        <TableCell className="font-mono text-sm max-w-[150px] truncate">
                                                            {activity.model_path?.split('/').pop() || activity.id.substring(0, 8)}
                                                        </TableCell>
                                                        <TableCell className="capitalize text-xs">
                                                            {activity.model_type}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {activity.created_at ? format(new Date(activity.created_at), 'dd MMM HH:mm', { locale: fr }) : '—'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={cn("capitalize font-normal", getStatusColor(activity.status))}>
                                                                {activity.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono">
                                                            {activity.score !== null && activity.score !== undefined ? activity.score.toFixed(4) : '—'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-muted-foreground">
                                        Aucune soumission récente.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* System Resources */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Server className="h-5 w-5 text-primary" />
                                    Ressources Système
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoadingSystem ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : systemData ? (
                                    <>
                                        {/* CPU load */}
                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-muted/20">
                                            <Cpu className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm">Charge CPU (Load Avg)</h4>
                                                <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                                                    <span>1 min: {systemData.load_average?.["1m"]?.toFixed(2) || 'N/A'}</span>
                                                    <span>5 min: {systemData.load_average?.["5m"]?.toFixed(2) || 'N/A'}</span>
                                                    <span>15 min: {systemData.load_average?.["15m"]?.toFixed(2) || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Memory */}
                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-muted/20">
                                            <Database className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm">Mémoire système</h4>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    <div>Total : {systemData.memory?.total || 'N/A'}</div>
                                                    <div>Disponible : {systemData.memory?.available || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Docker Containers */}
                                        <div className="pt-2">
                                            <h4 className="font-semibold text-sm mb-3">Conteneurs Docker</h4>
                                            {Array.isArray(systemData.containers) ? (
                                                <div className="space-y-2">
                                                    {systemData.containers.map((c: any) => (
                                                        <div key={c.id} className="flex items-center justify-between p-2 rounded-lg border border-border/40 text-xs">
                                                            <div className="font-medium truncate max-w-[120px]">{c.name}</div>
                                                            <div className="text-muted-foreground truncate max-w-[100px]">{c.image.split(':')[0]}</div>
                                                            <Badge variant={c.status === 'running' ? 'outline' : 'secondary'} className={cn(
                                                                c.status === 'running' ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground'
                                                            )}>
                                                                {c.status}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">
                                                    {systemData.containers?.error || 'Docker non connecté ou non configuré.'}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-sm text-muted-foreground py-6">
                                        Impossible de charger l'état système.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
