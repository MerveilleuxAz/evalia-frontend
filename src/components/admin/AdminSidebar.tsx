import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    Settings,
    BarChart3,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
    {
        title: "Vue d'ensemble",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Utilisateurs",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Modération Événements",
        href: "/admin/events",
        icon: ShieldCheck,
    },
    {
        title: "Statistiques",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Paramètres",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const { logout } = useAuth();

    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col h-[calc(100vh-4rem)] sticky top-16">
            <div className="p-6 flex-1">
                <div className="mb-8 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Menu Administration
                </div>
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === '/admin'}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent/50",
                                    isActive
                                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                                        : "text-muted-foreground"
                                )
                            }
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-border mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                </Button>
            </div>
        </aside>
    );
}
