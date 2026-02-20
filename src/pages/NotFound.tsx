import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.02]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-md"
      >
        <div className="text-[150px] font-display font-bold leading-none gradient-text mb-4">
          404
        </div>
        <h1 className="text-2xl font-display font-bold mb-4">
          Page non trouvée
        </h1>
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/events">
              <Search className="h-4 w-4" />
              Explorer les événements
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
