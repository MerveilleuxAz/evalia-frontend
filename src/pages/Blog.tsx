import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const blogPosts = [
    {
        title: "Lancement de la plateforme EvalIA v2",
        excerpt: "Découvrez les nouvelles fonctionnalités de notre plateforme de compétition IA repensée pour une meilleure expérience utilisateur.",
        date: "15 Fév 2026",
        author: "Équipe EvalIA",
        category: "Nouveautés",
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&fit=crop"
    },
    {
        title: "Comment gagner un challenge de Deep Learning ?",
        excerpt: "Retour d'expérience des vainqueurs de la dernière compétition sur la reconnaissance de plantes médicinales.",
        date: "02 Fév 2026",
        author: "Aminata Diallo",
        category: "Conseils",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop"
    },
    {
        title: "L'IA au service de l'agriculture au Bénin",
        excerpt: "Focus sur nos initiatives locales utilisant le machine learning pour optimiser les rendements agricoles.",
        date: "20 Jan 2026",
        author: "Prof. Adama",
        category: "Impact",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&fit=crop"
    },
    {
        title: "Partenariat avec l'IFRI pour la recherche",
        excerpt: "Nous renforçons nos liens académiques pour offrir des challenges toujours plus innovants aux étudiants.",
        date: "10 Jan 2026",
        author: "Dr. Kouassi",
        category: "Institutionnel",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&fit=crop"
    }
];

export default function Blog() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Le Blog EvalIA</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Actualités, conseils techniques et récits d'impact de la communauté IA au Bénin.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {blogPosts.map((post, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="flex flex-col md:flex-row h-full overflow-hidden border-border/60 hover:shadow-2xl transition-all group cursor-pointer">
                                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="shadow-lg">{post.category}</Badge>
                                    </div>
                                </div>

                                <div className="md:w-3/5 flex flex-col p-6">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {post.author}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                                        {post.title}
                                    </h2>

                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <Button variant="ghost" className="w-fit p-0 h-auto gap-2 text-primary hover:bg-transparent hover:gap-3 transition-all">
                                        Lire la suite <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-12 rounded-3xl bg-primary/5 border border-primary/10 text-center"
                >
                    <h2 className="text-3xl font-display font-bold mb-6">Abonnez-vous à notre newsletter</h2>
                    <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
                        Recevez les nouveaux challenges et articles directement dans votre boîte mail.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input placeholder="votre@email.com" className="bg-background h-12" />
                        <Button className="h-12 px-8">S'abonner</Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
