import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

const faqs = [
    {
        category: "Participation",
        questions: [
            {
                q: "Comment rejoindre une compétition ?",
                a: "Pour rejoindre une compétition, créez un compte ou connectez-vous, accédez à la page 'Événements', choisissez un challenge actif et cliquez sur le bouton 'Participer'. Vous aurez alors accès au dataset et pourrez soumettre vos résultats."
            },
            {
                q: "Est-ce gratuit de participer ?",
                a: "Oui, la participation à toutes les compétitions sur EvalIA est entièrement gratuite pour tous les utilisateurs enregistrés."
            },
            {
                q: "Quelles sont les limites de soumission ?",
                a: "Chaque compétition possède ses propres règles de soumission. En général, il y a une limite quotidienne (ex: 5 soumissions par jour) pour éviter les tentatives répétitives et favoriser une approche réfléchie."
            }
        ]
    },
    {
        category: "Plateforme & Compte",
        questions: [
            {
                q: "Quel format de fichier dois-je soumettre ?",
                a: "Le format dépend du type de challenge. Pour les challenges de prédiction, c'est généralement un fichier CSV. Pour les challenges de code, nous pouvons demander une archive Docker ou un script Python spécifique."
            },
            {
                q: "Comment changer mon rôle d'utilisateur ?",
                a: "Par défaut, les nouveaux comptes sont des comptes participants. Si vous êtes un enseignant ou un représentant d'entreprise et souhaitez organiser une compétition, contactez-nous via la page Contact."
            }
        ]
    },
    {
        category: "Classements & Prix",
        questions: [
            {
                q: "Comment est calculé le score ?",
                a: "Le score est calculé en fonction d'une métrique choisie par l'organisateur (Accuracy, RMSE, F1-score, etc.). Cette métrique est appliquée sur un jeu de test caché pour garantir l'équité du classement final."
            },
            {
                q: "Quand sont annoncés les vainqueurs ?",
                a: "Les vainqueurs sont généralement annoncés quelques jours après la fermeture officielle de la compétition, après vérification de l'intégrité des solutions soumises."
            }
        ]
    }
];

export default function FAQ() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
                        <HelpCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-display font-bold mb-4">Foire Aux Questions</h1>
                    <p className="text-muted-foreground text-lg">
                        Tout ce que vous devez savoir sur EvalIA et le fonctionnement des challenges.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {faqs.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h2 className="text-xl font-bold mb-6 border-l-4 border-primary pl-4">{category.category}</h2>
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {category.questions.map((faq, i) => (
                                    <AccordionItem
                                        key={i}
                                        value={`item-${idx}-${i}`}
                                        className="border border-border rounded-xl px-4 overflow-hidden bg-card/50"
                                    >
                                        <AccordionTrigger className="hover:no-underline font-medium text-left">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 p-8 rounded-3xl bg-secondary/5 border border-secondary/10 text-center"
                >
                    <h2 className="text-2xl font-bold mb-4">Vous n'avez pas trouvé votre réponse ?</h2>
                    <p className="text-muted-foreground mb-8">
                        Notre équipe est là pour vous aider. N'hésitez pas à nous contacter directement.
                    </p>
                    <Button asChild variant="secondary" size="lg" className="gap-2">
                        <Link to="/contact">
                            <MessageSquare className="h-4 w-4" />
                            Nous contacter
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
