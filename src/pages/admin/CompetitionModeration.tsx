import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Search,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Eye,
    Archive,
    Loader2,
    Calendar,
    Power
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminCompetitions, useUpdateCompetitionStatus } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export default function CompetitionModeration() {
    const { data, isLoading } = useAdminCompetitions();
    const updateStatusMutation = useUpdateCompetitionStatus();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const competitionsList = data?.competitions || [];

    const filteredCompetitions = competitionsList.filter((comp: any) =>
        comp.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status: newStatus });
            toast({
                title: "Statut mis à jour",
                description: `Le statut de la compétition a été changé en '${newStatus}' avec succès.`,
            });
        } catch (e: any) {
            toast({
                title: "Erreur",
                description: e.message || "Impossible de mettre à jour le statut.",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-success/10 text-success border-success/20 capitalize">Active</Badge>;
            case 'draft':
                return <Badge variant="secondary" className="capitalize">Brouillon</Badge>;
            case 'upcoming':
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 capitalize">À venir</Badge>;
            case 'closed':
                return <Badge className="bg-warning/10 text-warning border-warning/20 capitalize">Fermée</Badge>;
            case 'finished':
                return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 capitalize">Terminée</Badge>;
            case 'archived':
                return <Badge variant="outline" className="capitalize">Archivée</Badge>;
            default:
                return <Badge variant="outline" className="capitalize">{status}</Badge>;
        }
    };

    return (
        <div className="flex min-h-screen bg-background pt-16">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold">Modération des Compétitions</h1>
                            <p className="text-muted-foreground mt-1">Validez, gérez et changez les phases d'évaluation des challenges IA.</p>
                        </div>
                    </header>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-primary" />
                                    Liste des compétitions ({competitionsList.length})
                                </CardTitle>
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher une compétition..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <span>Chargement des compétitions...</span>
                                </div>
                            ) : filteredCompetitions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Compétition</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Participants</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredCompetitions.map((comp: any) => (
                                                <TableRow key={comp.id}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-foreground">{comp.title}</span>
                                                            <span className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">
                                                                {comp.description}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="capitalize">
                                                            {comp.task_type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(comp.status)}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {comp.stats?.participants || 0}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Modération</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-2" asChild>
                                                                    <Link to={`/competitions/${comp.id}`}>
                                                                        <Eye className="h-4 w-4" /> Prévisualiser
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                {comp.status === 'draft' && (
                                                                    <DropdownMenuItem
                                                                        className="gap-2 text-blue-500 focus:text-blue-500"
                                                                        onClick={() => handleStatusUpdate(comp.id, 'upcoming')}
                                                                    >
                                                                        <Calendar className="h-4 w-4" /> Publier comme "À venir"
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {(comp.status === 'draft' || comp.status === 'upcoming') && (
                                                                    <DropdownMenuItem
                                                                        className="gap-2 text-success focus:text-success"
                                                                        onClick={() => handleStatusUpdate(comp.id, 'active')}
                                                                    >
                                                                        <Power className="h-4 w-4" /> Ouvrir les soumissions (Activer)
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {comp.status === 'active' && (
                                                                    <DropdownMenuItem
                                                                        className="gap-2 text-warning focus:text-warning"
                                                                        onClick={() => handleStatusUpdate(comp.id, 'closed')}
                                                                    >
                                                                        <XCircle className="h-4 w-4" /> Fermer les soumissions
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {comp.status === 'closed' && (
                                                                    <DropdownMenuItem
                                                                        className="gap-2 text-purple-500 focus:text-purple-500"
                                                                        onClick={() => handleStatusUpdate(comp.id, 'finished')}
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4" /> Terminer (Publier classement)
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {comp.status !== 'archived' && (
                                                                    <DropdownMenuItem
                                                                        className="gap-2 text-destructive focus:text-destructive"
                                                                        onClick={() => handleStatusUpdate(comp.id, 'archived')}
                                                                    >
                                                                        <Archive className="h-4 w-4" /> Archiver la compétition
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    Aucune compétition trouvée.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
