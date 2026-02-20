import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  plateforme: [
    { name: 'Événements', href: '/events' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Documentation', href: '/docs' },
    { name: 'API', href: '/api' },
  ],
  ressources: [
    { name: 'Guide de démarrage', href: '/getting-started' },
    { name: 'Tutoriels', href: '/tutorials' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
  ],
  ifri: [
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Partenaires', href: '/partners' },
    { name: 'Carrières', href: '/careers' },
  ],
  legal: [
    { name: 'Conditions d\'utilisation', href: '/terms' },
    { name: 'Politique de confidentialité', href: '/privacy' },
    { name: 'Règlement des compétitions', href: '/rules' },
  ],
};

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/ifri' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/ifri' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/ifri' },
  { name: 'Email', icon: Mail, href: 'mailto:contact@evalia.ifri.bj' },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/evalia.png" alt="EvalIA Logo" className="h-12 w-12 object-contain" />
              <span className="font-display font-bold text-xl">
                Eval<span className="text-primary">IA</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Plateforme de compétitions d'intelligence artificielle de l'IFRI.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Plateforme</h3>
            <ul className="space-y-2">
              {footerLinks.plateforme.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Ressources</h3>
            <ul className="space-y-2">
              {footerLinks.ressources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">IFRI</h3>
            <ul className="space-y-2">
              {footerLinks.ifri.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EvalIA - IFRI. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground">
            Fait avec ❤️ à Cotonou, Bénin
          </p>
        </div>
      </div>
    </footer>
  );
}
