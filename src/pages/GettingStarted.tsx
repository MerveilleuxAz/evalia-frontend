import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, UserPlus, Trophy, Code2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
    {
        icon: UserPlus,
        title: "Créer un compte",
        description: "Inscrivez-vous gratuitement pour accéder aux compétitions et rejoindre la communauté EvalIA.",
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        icon: Trophy,
        title: "Choisir un challenge",
        description: "Explorez notre catalogue de compétitions et trouvez celle qui correspond à vos compétences.",
        color: "bg-amber-500/10 text-amber-500",
    },
    {
        icon: Code2,
        title: "Développer votre solution",
        description: "Utilisez vos outils préférés et nos datasets pour entraîner le meilleur modèle possible.",
        color: "bg-green-500/10 text-green-500",
    },
    {
        icon: Rocket,
        title: "Soumettre et gagner",
        description: "Envoyez vos prédictions, montez dans le classement et remportez des prix prestigieux.",
        color: "bg-primary/10 text-primary",
    }
];

export default function GettingStarted() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4">Guide de démarrage</Badge>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Bienvenue sur Eval<span className="text-primary">IA</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        La plateforme n°1 pour booster vos compétences en Intelligence Artificielle à travers des challenges réels.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full border-border/60 hover:border-primary/50 transition-colors">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className={`p-4 rounded-2xl ${step.color} mb-6`}>
                                        <step.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-display font-bold mb-6">Prêt à relever le défi ?</h2>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Datasets de haute qualité pour l'entraînement",
                                    "Classement en temps réel",
                                    "Support technique de la part des experts IFRI",
                                    "Opportunités de recrutement par nos partenaires"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span className="text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-4">
                                <Button asChild size="lg" className="gap-2">
                                    <Link to="/register">S'inscrire <ArrowRight className="h-4 w-4" /></Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link to="/events">Voir les challenges</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&fit=crop"
                                alt="Community"
                                className="relative rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider ${className}`}>
            {children}
        </span>
    );
}
