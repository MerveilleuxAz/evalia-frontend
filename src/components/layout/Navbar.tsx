import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  Plus,
  Trophy,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { name: 'Événements', href: '/events' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'À propos', href: '/about' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg group-hover:bg-primary/30 transition-colors" />
              <img src="/evalia.png" alt="EvalIA Logo" className="h-12 w-12 object-contain" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Eval<span className="text-primary">IA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {hasRole('organisateur') && (
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link to="/events/create">
                      <Plus className="h-4 w-4" />
                      Créer un événement
                    </Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline text-sm font-medium">
                        {user?.name}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Mon Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Mon Profil
                      </Link>
                    </DropdownMenuItem>
                    {hasRole('organisateur') && (
                      <DropdownMenuItem asChild>
                        <Link to="/my-events" className="cursor-pointer">
                          <Trophy className="mr-2 h-4 w-4" />
                          Mes Événements
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {hasRole('administrateur') && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                  <Link to="/register">
                    <LogIn className="mr-2 h-4 w-4" />
                    S'inscrire
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      >
                        Mon Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      >
                        Mon Profil
                      </Link>
                      {hasRole('organisateur') && (
                        <Link
                          to="/my-events"
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          Mes Événements
                        </Link>
                      )}
                      {hasRole('administrateur') && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                      >
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2 px-4">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          Se connecter
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          S'inscrire
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
