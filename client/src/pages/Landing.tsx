import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Zap, Leaf, Shield, TrendingUp, Users } from "lucide-react";

export default function Landing() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();

  if (currentUser) {
    setLocation("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              BusBuddy
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setAuthModalOpen(true)}
              data-testid="button-signin-header"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              data-testid="button-get-started-header"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-float">
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-green-600 via-green-700 to-green-800 dark:from-green-400 dark:via-green-500 dark:to-green-600 bg-clip-text text-transparent">
              Green Intelligence for
              <br />
              Sustainable Transit
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track your city bus in real-time with AI-powered ETA predictions. Save CO₂, reduce fuel waste, and contribute to a sustainable planet.
          </p>
          <Button
            size="lg"
            onClick={() => setAuthModalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-6 h-auto"
            data-testid="button-get-started-hero"
          >
            Get Started
            <Zap className="ml-2 h-5 w-5" />
          </Button>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-white/20 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1.2M kg CO₂ Saved</h3>
              <p className="text-sm text-muted-foreground">This month across all cities</p>
            </Card>
            <Card className="p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-white/20 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">500+ Active Buses</h3>
              <p className="text-sm text-muted-foreground">Real-time tracking nationwide</p>
            </Card>
            <Card className="p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-white/20 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">50K+ Users</h3>
              <p className="text-sm text-muted-foreground">Making eco-friendly choices daily</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center mb-16">
            Intelligent Features for a Greener Future
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time GPS Tracking</h3>
              <p className="text-muted-foreground">
                See exactly where your bus is on an interactive map with live location updates every few seconds.
              </p>
            </Card>

            <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered ETA</h3>
              <p className="text-muted-foreground">
                Get accurate arrival predictions using machine learning that factors in traffic, speed, and historical patterns.
              </p>
            </Card>

            <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Eco-Route Optimizer</h3>
              <p className="text-muted-foreground">
                Discover the most fuel-efficient routes and see your personal CO₂ savings grow with every trip.
              </p>
            </Card>

            <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Tailored dashboards for passengers, drivers, and administrators with features specific to each role.
              </p>
            </Card>

            <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Track your environmental impact with beautiful visualizations of CO₂ savings and fuel efficiency.
              </p>
            </Card>

            <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
              <p className="text-muted-foreground">
                Join thousands making a difference. See collective sustainability achievements across all users.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join BusBuddy today and be part of the movement towards sustainable urban transportation.
          </p>
          <Button
            size="lg"
            onClick={() => setAuthModalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-6 h-auto"
            data-testid="button-get-started-footer"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
