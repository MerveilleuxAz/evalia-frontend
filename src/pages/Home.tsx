import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Trophy,
  Users,
  Zap,
  Code2,
  Target,
  ChevronRight,
  Play,
  BarChart3,
  Shield,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventCard } from '@/components/events/EventCard';
import { mockEvents } from '@/data/mockData';

const features = [
  {
    icon: Brain,
    title: 'Défis IA Variés',
    description: 'Classification, régression, NLP, vision par ordinateur et plus encore.',
  },
  {
    icon: Trophy,
    title: 'Leaderboards Temps Réel',
    description: 'Suivez votre progression et comparez-vous aux meilleurs.',
  },
  {
    icon: Code2,
    title: 'Évaluation Automatique',
    description: 'Soumettez vos modèles et obtenez des résultats instantanés.',
  },
  {
    icon: Users,
    title: 'Communauté Active',
    description: 'Apprenez et collaborez avec des passionnés d\'IA.',
  },
];

const stats = [
  { value: '500+', label: 'Participants actifs' },
  { value: '25+', label: 'Compétitions terminées' },
  { value: '10K+', label: 'Modèles soumis' },
  { value: '15', label: 'Événements actifs' },
];

export default function Home() {
  const activeEvents = mockEvents.filter((e) => e.status === 'active').slice(0, 3);
  const upcomingEvents = mockEvents.filter((e) => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Cinematic Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="/hero-arena.png"
              alt="Competition Arena"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
          </motion.div>

          {/* Animated Glow Overlays */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] animate-pulse-glow" />
        </div>

        {/* Floating Particles/Elements Simulation */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.05] z-1" />

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-md shadow-lg shadow-primary/10">
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  3 Compétitions Actives — 1.2k Participants
                </span>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-display text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]"
              >
                ENTREZ DANS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  L'ARÈNE DE L'IA
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium"
              >
                La plateforme de référence pour les challenges de Machine Learning.
                Relevez des défis réels, grimpez le classement et montrez vos talents.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Button asChild size="xl" className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 rounded-full shadow-2xl shadow-primary/30 group transition-all duration-300 hover:scale-105">
                  <Link to="/events" className="flex items-center gap-2">
                    REJOINDRE LA COMPÉTITION
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="h-14 px-10 text-lg font-bold rounded-full border-2 hover:bg-muted/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Link to="/register" className="flex items-center gap-2">
                    DÉMARRER GRATUITEMENT
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">Explorer</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Fonctionnalités</Badge>
            <h2 className="font-display text-4xl font-bold mb-4">
              Une plateforme complète
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour apprendre, pratiquer et exceller
              dans le domaine de l'intelligence artificielle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Events Section */}
      {activeEvents.length > 0 && (
        <section className="py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Badge className="mb-4 status-active border">
                  <Play className="mr-1 h-3 w-3" />
                  En cours
                </Badge>
                <h2 className="font-display text-3xl font-bold">
                  Événements actifs
                </h2>
              </div>
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/events?status=active">
                  Voir tout
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Badge className="mb-4 status-upcoming border">
                  <Zap className="mr-1 h-3 w-3" />
                  Bientôt
                </Badge>
                <h2 className="font-display text-3xl font-bold">
                  Événements à venir
                </h2>
              </div>
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/events?status=upcoming">
                  Voir tout
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-10" />
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />

            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Prêt à relever le défi ?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Rejoignez des centaines de passionnés d'IA et commencez
                à développer vos compétences dès aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 gap-2 bg-primary hover:bg-primary/90">
                  <Link to="/register">
                    Créer un compte gratuitement
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/about">En savoir plus</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
