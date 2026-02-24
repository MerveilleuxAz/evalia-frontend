import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, Trophy, Target } from 'lucide-react';

const growthData = [
    { name: 'Jan', users: 400, submissions: 240 },
    { name: 'Fév', users: 600, submissions: 480 },
    { name: 'Mar', users: 800, submissions: 700 },
    { name: 'Avr', users: 1100, submissions: 900 },
    { name: 'Mai', users: 1400, submissions: 1200 },
    { name: 'Juin', users: 1800, submissions: 1500 },
];

const categoryData = [
    { name: 'Vison', value: 400 },
    { name: 'NLP', value: 300 },
    { name: 'Regression', value: 300 },
    { name: 'Audio', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function AdminAnalytics() {
    return (
        <div className="flex min-h-screen bg-background pt-16">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <header>
                        <h1 className="text-3xl font-display font-bold">Statistiques Plateforme</h1>
                        <p className="text-muted-foreground mt-2">Analyse détaillée de la croissance et des performances d'EvalIA.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Croissance des Utilisateurs & Soumissions</CardTitle>
                                <CardDescription>Évolution mensuelle sur le dernier semestre</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={growthData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                            itemStyle={{ fontSize: '12px' }}
                                        />
                                        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Utilisateurs" />
                                        <Line type="monotone" dataKey="submissions" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Soumissions" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Répartition par Thématique</CardTitle>
                                <CardDescription>Popularité des catégories de challenges</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: '8px',
                                                color: 'hsl(var(--foreground))'
                                            }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold">1,2k</span>
                                    <span className="text-xs text-muted-foreground">Total Challenges</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Activité Hebdomadaire</CardTitle>
                                <CardDescription>Volume de soumissions par jour de la semaine</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { day: 'Lun', value: 45 },
                                        { day: 'Mar', value: 52 },
                                        { day: 'Mer', value: 48 },
                                        { day: 'Jeu', value: 61 },
                                        { day: 'Ven', value: 55 },
                                        { day: 'Sam', value: 67 },
                                        { day: 'Dim', value: 72 },
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Soumissions" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
