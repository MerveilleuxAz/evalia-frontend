import React from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export default function Terms() {
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
                            <Scale className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold">Conditions d'Utilisation</h1>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">1. Acceptation des Conditions</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                En accédant et en utilisant la plateforme EvalIA, vous acceptez d'être lié par ces conditions d'utilisation.
                                Si vous n'acceptez pas ces termes, veuillez ne pas utiliser nos services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">2. Description du Service</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                EvalIA est une plateforme de compétitions d'intelligence artificielle hébergée par l'Institut de Formation
                                et de Recherche en Informatique (IFRI). Nous fournissons aux utilisateurs l'accès à des jeux de données,
                                des outils d'évaluation et des classements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">3. Compte Utilisateur</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Pour participer aux compétitions, vous devez créer un compte. Vous êtes responsable du maintien de la
                                confidentialité de votre compte et de votre mot de passe. Toutes les informations fournies lors de
                                l'inscription doivent être exactes et à jour.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Code de Conduite</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Le partage de code privé ou de solutions en dehors des équipes formées est interdit pendant les compétitions actives, sauf mention contraire.</li>
                                <li>L'utilisation de plusieurs comptes par une même personne pour soumettre des solutions est strictement interdite.</li>
                                <li>Tout comportement harcelant, discriminatoire ou offensant envers d'autres utilisateurs entraînera la suspension du compte.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Propriété Intellectuelle</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Sauf indication contraire dans les règles spécifiques d'une compétition, les participants conservent
                                la propriété intellectuelle de leurs soumissions. Cependant, en soumettant, vous accordez à EvalIA
                                un droit non exclusif d'utiliser, reproduire et évaluer votre soumission à des fins de notation
                                et de classement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-primary">6. Limitation de Responsabilité</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                EvalIA fournit la plateforme "telle quelle". Nous ne garantissons pas que le service sera ininterrompu
                                ou exempt d'erreurs. L'IFRI ne pourra être tenu responsable des dommages directs ou indirects résultant
                                de l'utilisation de la plateforme.
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
