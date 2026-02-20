import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Target,
  Users,
  Trophy,
  Lightbulb,
  GraduationCap,
  Globe,
  Code2,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const features = [
  {
    icon: Trophy,
    title: 'Compétitions IA',
    description: 'Participez à des challenges variés en classification, régression, NLP et vision par ordinateur.',
  },
  {
    icon: BarChart3,
    title: 'Classements en temps réel',
    description: 'Suivez votre progression et comparez vos performances avec les autres participants.',
  },
  {
    icon: Code2,
    title: 'Multi-formats',
    description: 'Soumettez vos modèles en .pkl, .h5, .pt, .onnx et bien d\'autres formats.',
  },
  {
    icon: ShieldCheck,
    title: 'Évaluation automatique',
    description: 'Vos modèles sont évalués automatiquement sur des données de test privées.',
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Rejoignez une communauté de passionnés d\'IA et apprenez ensemble.',
  },
  {
    icon: GraduationCap,
    title: 'Apprentissage',
    description: 'Progressez en résolvant des problèmes concrets avec des données réelles.',
  },
];

const teamMembers = [
  {
    name: 'Prof. Adama',
    role: 'Directeur Scientifique',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adama',
    bio: 'Professeur en Intelligence Artificielle à l\'IFRI',
  },
  {
    name: 'Dr. Kouassi',
    role: 'Responsable Compétitions',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kouassi',
    bio: 'Chercheur en Machine Learning et Vision par Ordinateur',
  },
  {
    name: 'Club IA IFRI',
    role: 'Organisation étudiante',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ClubIA',
    bio: 'Le club étudiant dédié à l\'intelligence artificielle',
  },
];

const stats = [
  { value: '500+', label: 'Participants' },
  { value: '15+', label: 'Compétitions' },
  { value: '2000+', label: 'Soumissions' },
  { value: '6', label: 'Thématiques IA' },
];

export default function About() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">À propos d'EvalIA</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              La plateforme de compétitions{' '}
              <span className="gradient-text">IA de l'IFRI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              EvalIA est la plateforme de référence pour les compétitions d'intelligence artificielle
              de l'Institut de Formation et de Recherche en Informatique (IFRI).
              Participez, apprenez et excellez.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                {...stagger}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Notre Mission</h2>
            <p className="text-muted-foreground text-lg">
              Démocratiser l'accès aux compétitions d'IA en Afrique de l'Ouest et fournir un
              environnement d'apprentissage pratique pour les étudiants et chercheurs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Problèmes réels',
                text: 'Nos challenges abordent des problématiques africaines concrètes : santé, agriculture, énergie, finance.',
              },
              {
                icon: Lightbulb,
                title: 'Innovation locale',
                text: 'Encourager les solutions IA développées par et pour les communautés africaines.',
              },
              {
                icon: Globe,
                title: 'Ouvert à tous',
                text: 'Étudiants, chercheurs, professionnels : tous les niveaux sont les bienvenus.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="bg-card/60 border-border/50 hover:border-primary/30 transition-colors h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Fonctionnalités</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tout ce qu'il faut pour organiser et participer à des compétitions IA de qualité.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...stagger}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className="bg-card/60 border-border/50 hover:border-primary/20 transition-colors h-full">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Profils */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Pour chaque profil</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              EvalIA s'adapte à votre rôle et vous offre les outils adaptés.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: 'Participants',
                color: 'text-primary',
                bg: 'bg-primary/10',
                items: [
                  'Parcourir et rejoindre les compétitions',
                  'Soumettre des modèles et suivre les scores',
                  'Consulter le classement en temps réel',
                  'Dashboard personnel multi-événements',
                  'Historique complet des soumissions',
                ],
              },
              {
                icon: GraduationCap,
                title: 'Organisateurs',
                color: 'text-secondary',
                bg: 'bg-secondary/10',
                items: [
                  'Créer des événements avec un wizard guidé',
                  'Uploader datasets et configurer métriques',
                  'Gérer participants et soumissions',
                  'Statistiques et analytics en temps réel',
                  'Modération et communication',
                ],
              },
              {
                icon: ShieldCheck,
                title: 'Administrateurs',
                color: 'text-accent',
                bg: 'bg-accent/10',
                items: [
                  'Vue globale de la plateforme',
                  'Gestion de tous les utilisateurs',
                  'Modération des événements',
                  'Statistiques globales',
                  'Configuration de la plateforme',
                ],
              },
            ].map((profile, i) => (
              <motion.div
                key={profile.title}
                {...stagger}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="bg-card/60 border-border/50 h-full hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${profile.bg} mb-4`}>
                      <profile.icon className={`h-6 w-6 ${profile.color}`} />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-4">{profile.title}</h3>
                    <ul className="space-y-2">
                      {profile.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">L'équipe</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Les personnes derrière EvalIA, au service de la communauté IA de l'IFRI.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                {...stagger}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <Avatar className="w-20 h-20 mx-auto mb-4 ring-2 ring-primary/20">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-1">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-2xl mx-auto text-center glass rounded-2xl p-10"
          >
            <h2 className="text-2xl font-display font-bold mb-4">
              Prêt à relever le défi ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Rejoignez la communauté EvalIA et participez aux prochaines compétitions d'intelligence artificielle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/register">
                      <Users className="h-4 w-4" />
                      Créer un compte
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/events">
                      Voir les événements
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/events">
                      <Trophy className="h-4 w-4" />
                      Explorer les compétitions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/dashboard">
                      Mon Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contact@evalia-ifri.bj
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                IFRI, Université d'Abomey-Calavi, Bénin
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
