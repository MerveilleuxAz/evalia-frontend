import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold">Politique de Confidentialité</h1>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
                                <Eye className="h-6 w-6" />
                                1. Collecte des Données
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Lorsque vous utilisez EvalIA, nous collectons les informations suivantes :
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Informations d'inscription : Nom, Prénom, Email, Institution.</li>
                                <li>Données de participation : Soumissions (algorithmes, prédictions), scores.</li>
                                <li>Données techniques : Adresse IP, type de navigateur, journaux de connexion.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
                                <Lock className="h-6 w-6" />
                                2. Utilisation des Données
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Nous utilisons vos données pour :
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Gérer votre compte et votre participation aux compétitions.</li>
                                <li>Calculer les classements et afficher les résultats.</li>
                                <li>Communiquer avec vous concernant les mises à jour de la plateforme.</li>
                                <li>Améliorer la sécurité et prévenir la fraude.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">3. Partage des Données</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Nous ne vendons pas vos données personnelles. Vos informations peuvent être partagées avec :
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Les organisateurs des compétitions auxquelles vous participez (pour la validation des prix).</li>
                                <li>Nos partenaires académiques (sous forme agrégée et anonymisée) à des fins de recherche.</li>
                                <li>Les autorités légales si requis par la loi.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Sécurité</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger
                                vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Vos Droits</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Conformément à la réglementation sur la protection des données, vous avez le droit d'accéder à vos
                                données, de les rectifier, de demander leur suppression ou de limiter leur traitement. Pour exercer
                                ces droits, contactez-nous à <a href="mailto:privacy@evalia.ifri.bj" className="text-primary hover:underline">privacy@evalia.ifri.bj</a>.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-border mt-12">
                            <p className="text-sm text-muted-foreground">
                                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
