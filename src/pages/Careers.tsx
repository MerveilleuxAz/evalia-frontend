import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, Star, Heart, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const stagger = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

const values = [
    { icon: Star, title: 'Excellence', description: "Nous visons l'excellence dans tout ce que nous entreprenons." },
    { icon: Heart, title: 'Passion', description: "La passion pour l'IA et l'innovation nous anime au quotidien." },
    { icon: Zap, title: 'Impact', description: "Notre objectif est d'avoir un impact positif concret." },
    { icon: Globe, title: 'Communauté', description: "Nous grandissons ensemble avec notre communauté." },
];

const jobs = [
    {
        title: 'Développeur Fullstack (Stage)',
        type: 'Stage',
        location: 'Cotonou, Bénin',
        description: "Participez au développement de la plateforme EvalIA.",
    },
    {
        title: 'Data Scientist Junior',
        type: 'CDD / Freelance',
        location: 'Remote / Cotonou',
        description: "Créez et gérez des compétitions de Machine Learning.",
    },
];

export default function Careers() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                        <Briefcase className="h-4 w-4" />
                        <span>Rejoignez l'équipe</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        Construisons l'avenir de l'<span className="gradient-text">IA</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        EvalIA est plus qu'une plateforme, c'est une mission.
                        Aidez-nous à démocratiser l'intelligence artificielle en Afrique.
                    </p>
                </motion.div>

                {/* Values */}
                <div className="grid md:grid-cols-4 gap-6 mb-20">
                    {values.map((value, i) => (
                        <motion.div
                            key={value.title}
                            {...stagger}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Card className="h-full bg-card/50 border-border/60 hover:bg-card transition-colors">
                                <CardContent className="p-6 text-center">
                                    <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <value.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Open Positions */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-display font-bold mb-8 text-center">Postes ouverts</h2>
                    <div className="space-y-4">
                        {jobs.map((job, i) => (
                            <motion.div
                                key={job.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                            >
                                <Card className="hover:border-primary/40 transition-colors cursor-pointer group">
                                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-lg">{job.title}</h3>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium border border-secondary/20">
                                                    {job.type}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground mb-1">{job.description}</p>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Globe className="h-3 w-3" />
                                                {job.location}
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="group-hover:translate-x-1 transition-transform self-start md:self-center">
                                            Postuler <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        {...fadeInUp}
                        className="mt-12 text-center p-8 rounded-2xl bg-muted/30 border border-border/50"
                    >
                        <h3 className="font-semibold text-lg mb-2">Candidature spontanée</h3>
                        <p className="text-muted-foreground mb-4">
                            Aucun poste ne correspond à votre profil ? Nous sommes toujours à la recherche de talents.
                        </p>
                        <Button asChild variant="outline">
                            <a href="mailto:jobs@evalia.ifri.bj">Envoyer mon CV</a>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
