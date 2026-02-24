import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, BookOpen, Clock, BarChart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tutorials = [
    {
        title: "Introduction à la Classification avec Scikit-Learn",
        description: "Apprenez les bases de la classification binaire et multi-classe pour vos premières compétitions.",
        category: "Débutant",
        duration: "15 min",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&fit=crop",
        views: "1.2k"
    },
    {
        title: "Deep Learning pour la Vision par Ordinateur",
        description: "Utilisez PyTorch et les CNN pour classifier des images complexes avec une haute précision.",
        category: "Avancé",
        duration: "45 min",
        image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&fit=crop",
        views: "850"
    },
    {
        title: "Nettoyage et Préparation des Données",
        description: "La clé de la performance réside dans la donnée. Découvrez nos meilleures pratiques.",
        category: "Intermédiaire",
        duration: "25 min",
        image: "https://images.unsplash.com/photo-1551288049-bbdac8626ad1?w=800&fit=crop",
        views: "2.5k"
    },
    {
        title: "NLP : Du Texte aux Embeddings",
        description: "Comment transformer du texte brut en vecteurs numériques pour vos modèles de langage.",
        category: "Intermédiaire",
        duration: "30 min",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&fit=crop",
        views: "1.1k"
    }
];

export default function Tutorials() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gradient">Tutoriels & Guides</h1>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Maîtrisez les outils de l'IA et apprenez à gagner vos compétitions avec nos tutoriels d'experts.
                        </p>
                    </motion.div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher un tutoriel..." className="pl-10" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutorials.map((tutorial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full border-border/60 overflow-hidden hover:shadow-xl transition-all group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={tutorial.image}
                                        alt={tutorial.title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300" />
                                    </div>
                                    <Badge className="absolute top-4 left-4 shadow-lg">{tutorial.category}</Badge>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                                        {tutorial.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                        {tutorial.description}
                                    </p>
                                </CardContent>

                                <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border/50">
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {tutorial.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BarChart className="h-3 w-3" />
                                            {tutorial.views} vues
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 gap-2">
                                        Lire plus <BookOpen className="h-3 w-3" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
