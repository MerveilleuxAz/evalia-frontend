import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

export default function Contact() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement form submission logic
        console.log('Form submitted');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Mail className="h-4 w-4" />
                        <span>Contactez-nous</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        Nous sommes à votre <span className="gradient-text">écoute</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Une question sur une compétition ? Une suggestion pour la plateforme ?
                        Ou simplement envie de discuter IA ? N'hésitez pas.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="grid gap-6">
                            <Card className="bg-card/50 border-border/60">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email</h3>
                                        <p className="text-muted-foreground mb-2">Notre équipe est réactive.</p>
                                        <a href="mailto:contact@evalia.ifri.bj" className="text-primary hover:underline font-medium">
                                            contact@evalia.ifri.bj
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 border-border/60">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-secondary/10 p-3 rounded-lg">
                                        <MapPin className="h-6 w-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Bureaux</h3>
                                        <p className="text-muted-foreground mb-2">Venez nous rencontrer.</p>
                                        <p className="font-medium">
                                            Institut de Formation et de Recherche en Informatique (IFRI)<br />
                                            Université d'Abomey-Calavi<br />
                                            Bénin
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 border-border/60">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-accent/10 p-3 rounded-lg">
                                        <Info className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Support Technique</h3>
                                        <p className="text-muted-foreground mb-2">Pour les problèmes liés à la plateforme.</p>
                                        <a href="mailto:support@evalia.ifri.bj" className="text-accent hover:underline font-medium">
                                            support@evalia.ifri.bj
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card className="border-border/60 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                                <CardDescription>
                                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Prénom</Label>
                                            <Input id="firstName" placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Nom</Label>
                                            <Input id="lastName" placeholder="Doe" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="john.doe@example.com" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Sujet</Label>
                                        <Input id="subject" placeholder="Comment pouvons-nous vous aider ?" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Votre message ici..."
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full gap-2">
                                        <Send className="h-4 w-4" />
                                        Envoyer le message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
