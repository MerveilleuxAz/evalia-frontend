import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CompetitionProvider } from "@/context/CompetitionContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PrivateRoute } from "@/components/PrivateRoute";

// Pages
import Home from "./pages/Home";
import Competitions from "./pages/Competitions";
import CompetitionDetails from "./pages/CompetitionDetails";
import CompetitionSubmit from "./pages/CompetitionSubmit";
import CreateCompetition from "./pages/CreateCompetition";
import ManageCompetition from "./pages/ManageCompetition";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import Careers from "./pages/Careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Rules from "./pages/Rules";
import Profile from "./pages/Profile";
import MyCompetitions from "./pages/MyCompetitions";
import GettingStarted from "./pages/GettingStarted";
import Tutorials from "./pages/Tutorials";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CompetitionModeration from "./pages/admin/CompetitionModeration";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CompetitionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/competitions" element={<Competitions />} />
                  <Route path="/competitions/:competitionId" element={<CompetitionDetails />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/rules" element={<Rules />} />
                  <Route path="/getting-started" element={<GettingStarted />} />
                  <Route path="/tutorials" element={<Tutorials />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path="/competitions/:competitionId/submit"
                    element={
                      <PrivateRoute>
                        <CompetitionSubmit />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />

                  {/* Organizer Routes */}
                  <Route
                    path="/competitions/create"
                    element={
                      <PrivateRoute>
                        <CreateCompetition />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/competitions/:competitionId/manage"
                    element={
                      <PrivateRoute>
                        <ManageCompetition />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-competitions"
                    element={
                      <PrivateRoute>
                        <MyCompetitions />
                      </PrivateRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute role="administrateur">
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <PrivateRoute role="administrateur">
                        <UserManagement />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/competitions"
                    element={
                      <PrivateRoute role="administrateur">
                        <CompetitionModeration />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <PrivateRoute role="administrateur">
                        <AdminAnalytics />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <PrivateRoute role="administrateur">
                        <AdminSettings />
                      </PrivateRoute>
                    }
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CompetitionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
