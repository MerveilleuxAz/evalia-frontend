import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Eye,
    Star,
    Archive
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allEvents = [
    { id: 1, title: "Classification Images Médicales", rganizer: "Dr. Kouassi", status: "actif", participants: 127, date: "Fév 2026", featured: true },
    { id: 2, title: "Demande Énergétique Bénin", organizer: "Prof. Adama", status: "actif", participants: 89, date: "Mars 2026", featured: false },
    { id: 3, title: "NLP Langues Africaines", organizer: "Club IA IFRI", status: "en_attente", participants: 45, date: "Avril 2026", featured: false },
    { id: 4, title: "Fraudes Bancaires", organizer: "Banque Atlantique", status: "terminé", participants: 156, date: "Déc 2025", featured: true },
    { id: 5, title: "Plantes Médicinales", organizer: "Centre Phyto", status: "en_attente", participants: 0, date: "Mars 2026", featured: false },
];

export default function EventModeration() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredEvents = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-background pt-16">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold">Modération des Événements</h1>
                            <p className="text-muted-foreground mt-1">Validez, gérez et mettez en avant les challenges IA.</p>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filtrer
                        </Button>
                    </header>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4">
                                <CardTitle>Liste des événements ({allEvents.length})</CardTitle>
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher un événement ou organisateur..."
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
                                            <TableHead>Événement</TableHead>
                                            <TableHead>Organisateur</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead>Participants</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium whitespace-nowrap">{event.title}</span>
                                                        {event.featured && (
                                                            <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 gap-1 h-5 px-1.5">
                                                                <Star className="h-3 w-3 fill-amber-500" />
                                                                Boost
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {event.organizer}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            event.status === 'actif' ? 'outline' :
                                                                event.status === 'en_attente' ? 'outline' : 'secondary'
                                                        }
                                                        className={cn(
                                                            "capitalize",
                                                            event.status === 'actif' && "bg-success/10 text-success border-success/20",
                                                            event.status === 'en_attente' && "bg-warning/10 text-warning border-warning/20"
                                                        )}
                                                    >
                                                        {event.status === 'en_attente' ? 'En attente' : event.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {event.participants}
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
                                                            <DropdownMenuItem className="gap-2 text-primary focus:text-primary">
                                                                <CheckCircle2 className="h-4 w-4" /> Approuver l'événement
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                                                                <XCircle className="h-4 w-4" /> Rejeter
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2">
                                                                <Eye className="h-4 w-4" /> Prévisualiser
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2">
                                                                <Star className="h-4 w-4" /> Mettre en avant
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2">
                                                                <Archive className="h-4 w-4" /> Archiver
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
