import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    UserPlus,
    MoreVertical,
    Shield,
    Mail,
    Trash2,
    UserCircle
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

const allUsers = [
    { id: 1, name: "Jean Participant", email: "jean@example.com", role: "participant", status: "actif", date: "Jan 2026", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean" },
    { id: 2, name: "Marie Organisatrice", email: "marie@example.com", role: "organisateur", status: "actif", date: "Juin 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie" },
    { id: 3, name: "Admin EvalIA", email: "admin@evalia.com", role: "administrateur", status: "actif", date: "Jan 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" },
    { id: 4, name: "Ousmane Drabo", email: "ousmane@example.com", role: "participant", status: "actif", date: "Fév 2026", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ousmane" },
    { id: 5, name: "Fatou Sow", email: "fatou@example.com", role: "participant", status: "suspendu", date: "Oct 2025", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatou" },
];

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Nouvel Utilisateur
                        </Button>
                    </header>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4">
                                <CardTitle>Liste des utilisateurs ({allUsers.length})</CardTitle>
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
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.avatar} />
                                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{user.name}</span>
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={user.status === 'actif' ? 'outline' : 'destructive'}
                                                        className={cn(
                                                            "capitalize",
                                                            user.status === 'actif' && "bg-success/10 text-success border-success/20"
                                                        )}
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {user.date}
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
                                                            <DropdownMenuItem className="gap-2">
                                                                <UserCircle className="h-4 w-4" /> Voir le profil
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2">
                                                                <Mail className="h-4 w-4" /> Envoyer un email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2">
                                                                <Shield className="h-4 w-4" /> Modifier le rôle
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                                                                <Trash2 className="h-4 w-4" /> {user.status === 'actif' ? 'Suspendre' : 'Réactiver'}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
