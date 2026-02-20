import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, Building2, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

const partners = [
    {
        name: 'IFRI',
        type: 'Institutionnel',
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IFRI&backgroundColor=0ea5e9',
        description: "L'Institut de Formation et de Recherche en Informatique, porteur du projet.",
    },
    {
        name: 'Sèmè City',
        type: 'Écosystème',
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SC&backgroundColor=f59e0b',
        description: "Cité internationale de l'innovation et du savoir.",
    },
    {
        name: 'TechHub Bénin',
        type: 'Communauté',
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TH&backgroundColor=10b981',
        description: "Accélérateur de startups et communauté tech.",
    },
    {
        name: 'Data Science Nigeria',
        type: 'Réseau',
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DSN&backgroundColor=8b5cf6',
        description: "Partenaire régional pour la promotion de l'IA en Afrique.",
    },
];

export default function Partners() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                        <Handshake className="h-4 w-4" />
                        <span>Nos Partenaires</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        Ils nous font <span className="gradient-text">confiance</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        EvalIA collabore avec des institutions, des entreprises et des communautés
                        pour propulser l'IA au Bénin et en Afrique.
                    </p>
                </motion.div>

                {/* Partners Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {partners.map((partner, i) => (
                        <motion.div
                            key={partner.name}
                            {...stagger}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Card className="h-full bg-card/50 border-border/60 hover:border-primary/30 transition-all hover:bg-card">
                                <CardContent className="p-6 text-center flex flex-col items-center h-full">
                                    <div className="w-20 h-20 rounded-2xl bg-muted mb-4 overflow-hidden p-1">
                                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover rounded-xl" />
                                    </div>
                                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                                        {partner.type}
                                    </div>
                                    <h3 className="font-display font-bold text-xl mb-2">{partner.name}</h3>
                                    <p className="text-sm text-muted-foreground">{partner.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    {...fadeInUp}
                    className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background border border-border/50 mb-6 shadow-sm">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>

                    <h2 className="text-3xl font-display font-bold mb-4">Devenez Partenaire</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Vous souhaitez soutenir l'innovation en IA, proposer des challenges ou recruter
                        les meilleurs talents ? Rejoignez l'aventure EvalIA.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="gap-2">
                            <Link to="/contact">
                                <UserPlus className="h-4 w-4" />
                                Nous contacter
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="gap-2">
                            <a href="mailto:partners@evalia.ifri.bj">
                                En savoir plus
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
