import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Rules() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-secondary/10 rounded-xl">
                            <Gavel className="h-8 w-8 text-secondary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold">Règlement des Compétitions</h1>
                    </div>

                    <div className="space-y-8">
                        <Card className="bg-card/50 border-border/60">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Règles Générales
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Sauf indication contraire dans la page spécifique d'une compétition, les règles suivantes s'appliquent à tous les challenges hébergés sur EvalIA.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">Éligibilité</h3>
                                            <p className="text-sm text-muted-foreground">Les compétitions sont ouvertes à tous, sauf restriction géographique ou liée à l'âge spécifiée.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">Équipes</h3>
                                            <p className="text-sm text-muted-foreground">La taille maximale des équipes est définie par compétition. La fusion d'équipes est autorisée avant la date limite de fusion.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-card/50 border-destructive/20">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-destructive">
                                        <XCircle className="h-5 w-5" />
                                        Interdictions
                                    </h2>
                                    <ul className="space-y-3">
                                        <li className="flex gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-sm text-muted-foreground">Partage de code privé en dehors de votre équipe.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-sm text-muted-foreground">Multi-comptes pour contourner les limites de soumission.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-sm text-muted-foreground">Exploitation de failles de la plateforme.</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 border-border/60">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-secondary">
                                        <AlertCircle className="h-5 w-5" />
                                        Conditions de Soumission
                                    </h2>
                                    <ul className="space-y-3">
                                        <li className="flex gap-2">
                                            <span className="text-secondary font-bold">•</span>
                                            <span className="text-sm text-muted-foreground">Formats acceptés : CSV pour les prédictions, Docker pour le code.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-secondary font-bold">•</span>
                                            <span className="text-sm text-muted-foreground">Nombre limité de soumissions par jour.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-secondary font-bold">•</span>
                                            <span className="text-sm text-muted-foreground">La sélection finale pour le classement privé est manuelle.</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        <section className="pt-8 border-t border-border mt-12">
                            <p className="text-sm text-muted-foreground">
                                En cas de litige, la décision des organisateurs de la compétition est finale et sans appel.
                                <br />
                                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
