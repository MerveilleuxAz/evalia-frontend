import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    MoreVertical,
    Shield,
    Mail,
    Trash2,
    UserCircle,
    Loader2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminUsers, useUpdateUserAdmin } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export default function UserManagement() {
    const { data, isLoading } = useAdminUsers();
    const updateUserMutation = useUpdateUserAdmin();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const usersList = data?.users || [];

    const filteredUsers = usersList.filter((user: any) => {
        const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const usernameMatch = user.username?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch || usernameMatch;
    });

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await updateUserMutation.mutateAsync({
                userId,
                data: { is_active: !currentStatus }
            });
            toast({
                title: "Statut mis à jour",
                description: `L'utilisateur a été ${!currentStatus ? 'réactivé' : 'suspendu'} avec succès.`,
            });
        } catch (e: any) {
            toast({
                title: "Erreur",
                description: e.message || "Une erreur est survenue lors de la mise à jour.",
                variant: "destructive"
            });
        }
    };

    const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
        try {
            await updateUserMutation.mutateAsync({
                userId,
                data: { is_admin: !currentIsAdmin }
            });
            toast({
                title: "Rôle mis à jour",
                description: `L'utilisateur est désormais ${!currentIsAdmin ? 'Administrateur' : 'Utilisateur'}.`,
            });
        } catch (e: any) {
            toast({
                title: "Erreur",
                description: e.message || "Une erreur est survenue lors de la mise à jour.",
                variant: "destructive"
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="flex min-h-screen bg-background pt-16">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold">Gestion des Utilisateurs</h1>
                            <p className="text-muted-foreground mt-1">Supervisez les comptes et les rôles de la plateforme.</p>
                        </div>
                    </header>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Liste des utilisateurs ({usersList.length})
                                </CardTitle>
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher un nom ou email..."
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
                                    <span>Chargement des utilisateurs...</span>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Utilisateur</TableHead>
                                                <TableHead>Rôle</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Inscrit le</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.map((user: any) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                                                                <AvatarFallback>{user.name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{user.name || user.username}</span>
                                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="capitalize">
                                                            {user.is_admin ? 'Administrateur' : 'Utilisateur'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={user.is_active ? 'outline' : 'destructive'}
                                                            className={cn(
                                                                "capitalize",
                                                                user.is_active && "bg-success/10 text-success border-success/20"
                                                            )}
                                                        >
                                                            {user.is_active ? 'actif' : 'suspendu'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatDate(user.created_at)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-2" asChild>
                                                                    <a href={`mailto:${user.email}`}>
                                                                        <Mail className="h-4 w-4" /> Envoyer un email
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="gap-2" onClick={() => handleToggleAdmin(user.id, user.is_admin)}>
                                                                    <Shield className="h-4 w-4" /> {user.is_admin ? 'Retirer admin' : 'Rendre admin'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="gap-2 text-destructive focus:text-destructive"
                                                                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" /> {user.is_active ? 'Suspendre' : 'Réactiver'}
                                                                </DropdownMenuItem>
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
                                    Aucun utilisateur trouvé.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
