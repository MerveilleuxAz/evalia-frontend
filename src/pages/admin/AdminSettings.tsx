import React from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Shield,
    Bell,
    Database,
    Globe,
    Lock,
    Save,
    RefreshCw,
    Mail,
    Smartphone
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSettings() {
    return (
        <div className="flex min-h-screen bg-background pt-16">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <header>
                        <h1 className="text-3xl font-display font-bold">Paramètres Système</h1>
                        <p className="text-muted-foreground mt-2">Configurez les options globales de la plateforme EvalIA.</p>
                    </header>

                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList className="bg-muted/50 p-1">
                            <TabsTrigger value="general" className="gap-2">
                                <Globe className="h-4 w-4" /> Général
                            </TabsTrigger>
                            <TabsTrigger value="security" className="gap-2">
                                <Shield className="h-4 w-4" /> Sécurité
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="gap-2">
                                <Bell className="h-4 w-4" /> Notifications
                            </TabsTrigger>
                            <TabsTrigger value="database" className="gap-2">
                                <Database className="h-4 w-4" /> Maintenance
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="general">
                            <div className="grid gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Configuration de base</CardTitle>
                                        <CardDescription>Nom du site et paramètres régionaux.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="site-name">Nom de la plateforme</Label>
                                            <Input id="site-name" defaultValue="EvalIA" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="contact-email">Email de contact technique</Label>
                                            <Input id="contact-email" defaultValue="tech@evalia.com" />
                                        </div>
                                        <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
                                            <div className="space-y-0.5">
                                                <Label>Mode Maintenance</Label>
                                                <p className="text-xs text-muted-foreground">Rend le site inaccessible aux utilisateurs (sauf admins).</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Inscriptions</CardTitle>
                                        <CardDescription>Gérez comment les nouveaux utilisateurs rejoignent.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Autoriser les nouvelles inscriptions</Label>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>Vérification d'email obligatoire</Label>
                                            <Switch defaultChecked />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Paramètres de Sécurité</CardTitle>
                                    <CardDescription>Authentification et restriction d'accès.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Authentification à deux facteurs (2FA)</Label>
                                            <p className="text-xs text-muted-foreground">Forcer le 2FA pour tous les administrateurs.</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="session-timeout">Délai d'expiration de session (minutes)</Label>
                                        <Input id="session-timeout" type="number" defaultValue="60" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notifications Système</CardTitle>
                                    <CardDescription>Gérez les canaux de communication.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            Emails de bienvenue
                                        </Label>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                                            Push Notifications (App)
                                        </Label>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button variant="outline" className="gap-2">
                            <RefreshCw className="h-4 w-4" /> Réinitialiser
                        </Button>
                        <Button className="gap-2">
                            <Save className="h-4 w-4" /> Enregistrer les modifications
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
