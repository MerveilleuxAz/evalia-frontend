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
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompetitionCard } from '@/components/competitions/CompetitionCard';
import { useCompetitions } from '@/hooks/useApi';

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
  { value: '15', label: 'Compétitions actifs' },
];

export default function Home() {
  const { data: activeEventsData } = useCompetitions({ status: 'active', per_page: 3 });
  const { data: upcomingEventsData } = useCompetitions({ status: 'upcoming', per_page: 3 });

  const activeEvents = activeEventsData?.competitions || [];
  const upcomingEvents = upcomingEventsData?.competitions || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Dynamic Background Elements */}
        {/* Deep background space */}
        <div className="absolute inset-0 bg-[#0B0F19]" />
        
        {/* Glow meshes */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-competitions-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] pointer-competitions-none" />
        
        {/* Interactive Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        />

        <div className="container mx-auto px-4 relative z-10 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & CTA */}
            <div className="max-w-2xl text-left">
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-semibold text-primary/90">
                    Saison 3 en cours • Rejoignez l'arène
                  </span>
                </div>
              </motion.div> */}

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1]"
              >
                <span className="text-foreground">Défiez les limites avec</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-300 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  l'Intelligence Artificielle
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-muted-foreground/90 mb-10 leading-relaxed max-w-xl"
              >
                La plateforme de référence pour les compétitions de Machine Learning. 
                Construisez, déployez et comparez vos modèles contre les meilleurs développeurs du monde entier.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="xl" className="relative group h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] border border-primary/50">
                  <Link to="/competitions" className="flex items-center gap-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    <span>Démarrer l'aventure</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="h-14 px-8 text-base font-semibold rounded-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Link to="/dashboard" className="flex items-center gap-2 text-foreground/80 hover:text-foreground">
                    <Terminal className="h-4 w-4" />
                    Voir le classement
                  </Link>
                </Button>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-12 flex items-center gap-6 text-sm text-muted-foreground/60 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary/60" />
                  <span>Évaluations temps réel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary/60" />
                  <span>Prise en charge de Python & R</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: 3D Floating Elements */}
            <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
              <motion.div
                initial={{ opacity: 0, rotateY: -20, rotateX: 10, x: 50 }}
                animate={{ opacity: 1, rotateY: -15, rotateX: 5, x: 0 }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="absolute inset-0 preserve-3d"
              >
                {/* Main Code Editor Card */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                  <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 font-mono">model_training.py</span>
                  </div>
                  <div className="p-6 font-mono text-sm">
                    <div className="flex">
                      <span className="text-muted-foreground/50 w-8 select-none">1</span>
                      <span className="text-purple-400">import</span> <span className="text-white ml-2">tensorflow</span> <span className="text-purple-400 ml-2">as</span> <span className="text-white ml-2">tf</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground/50 w-8 select-none">2</span>
                      <span className="text-purple-400">from</span> <span className="text-white ml-2">evalia</span> <span className="text-purple-400 ml-2">import</span> <span className="text-cyan-300 ml-2">Competition</span>
                    </div>
                    <div className="flex mt-2">
                      <span className="text-muted-foreground/50 w-8 select-none">3</span>
                      <span className="text-muted-foreground italic"># Initialize competition environment</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground/50 w-8 select-none">4</span>
                      <span className="text-yellow-200">comp</span> <span className="text-pink-400 mx-2">=</span> <span className="text-cyan-300">Competition</span><span className="text-white">(</span><span className="text-green-300">'nlp-challenge'</span><span className="text-white">)</span>
                    </div>
                    <div className="flex mt-4">
                      <span className="text-muted-foreground/50 w-8 select-none">5</span>
                      <span className="text-white">model</span> <span className="text-pink-400 mx-2">=</span> <span className="text-white">tf.keras.Sequential([</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground/50 w-8 select-none">6</span>
                      <span className="text-white ml-4">tf.keras.layers.Dense(</span><span className="text-orange-300">128</span><span className="text-white">, activation=</span><span className="text-green-300">'relu'</span><span className="text-white">)</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground/50 w-8 select-none">7</span>
                      <span className="text-white">])</span>
                    </div>
                    <div className="flex mt-4">
                      <span className="text-muted-foreground/50 w-8 select-none">8</span>
                      <span className="text-yellow-200">comp</span><span className="text-white">.submit(</span><span className="text-white">model</span><span className="text-white">)</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Leaderboard Card */}
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-12 bottom-1/4 w-[300px] bg-card/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-30"
                >
                  <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <span className="text-sm font-semibold flex items-center gap-2">
                       <Trophy className="h-4 w-4 text-yellow-500" /> Top Modèles
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-primary/20 text-primary">Live</Badge>
                  </div>
                  <div className="p-2">
                    {[
                      { pos: 1, name: "NeuralNinjas", acc: "99.4%" },
                      { pos: 2, name: "DeepLearner", acc: "98.9%" },
                      { pos: 3, name: "DataWizard", acc: "98.2%" }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold ${i === 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>#{row.pos}</span>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-[10px] font-bold">
                            {row.name.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-foreground/90">{row.name}</span>
                        </div>
                        <span className="text-xs font-mono text-primary/80">{row.acc}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Floating Accuracy Badge */}
                <motion.div 
                  animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute right-12 -top-8 bg-green-500/10 backdrop-blur-md border border-green-500/20 px-4 py-3 rounded-xl shadow-lg z-10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-green-400/80 uppercase font-bold tracking-wider mb-0.5">Précision Max</div>
                      <div className="text-sm font-bold text-green-300">99.94%</div>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </div>
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

      {/* Active Competitions Section */}
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
                  Compétitions actifs
                </h2>
              </div>
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/competitions?status=active">
                  Voir tout
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.map((competition, index) => (
                <CompetitionCard key={competition.id} competition={competition} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Competitions Section */}
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
                  Compétitions à venir
                </h2>
              </div>
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/competitions?status=upcoming">
                  Voir tout
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((competition, index) => (
                <CompetitionCard key={competition.id} competition={competition} index={index} />
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
