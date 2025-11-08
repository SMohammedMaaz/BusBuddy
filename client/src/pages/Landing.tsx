import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import BgBuses from "@/components/BgBuses";
import { FeatureCards } from "@/components/FeatureCards";
import { MapPin, Zap, TrendingUp, Users, Leaf } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

export default function Landing() {
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();

  if (currentUser) {
    setLocation("/dashboard");
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 animated-gradient-bg" />
      
      {/* Floating buses animation */}
      <BgBuses />
      
      {/* Content */}
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-display font-bold eco-gradient-text">
                BusBuddy
              </h1>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setLocation("/dashboard")}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                  data-testid="button-get-started-header"
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              {...fadeInUp}
              className="mb-8"
            >
              <motion.h2 
                className="text-5xl md:text-7xl font-display font-bold mb-6 text-white drop-shadow-2xl"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(16, 185, 129, 0.5)",
                    "0 0 40px rgba(16, 185, 129, 0.8)",
                    "0 0 20px rgba(16, 185, 129, 0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Green Intelligence for
                <br />
                <span className="eco-gradient-text">Sustainable Transit</span>
              </motion.h2>
            </motion.div>
            
            <motion.p 
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow-lg"
            >
              Track your city bus in real-time with AI-powered ETA predictions. Save CO₂, reduce fuel waste, and contribute to a sustainable planet.
            </motion.p>
            
            <motion.div
              {...scaleIn}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => setLocation("/dashboard")}
                className="bg-white text-green-700 hover:bg-white/90 text-lg px-12 py-8 h-auto rounded-2xl shadow-2xl font-bold animate-float"
                data-testid="button-get-started-hero"
              >
                Get Started
                <Zap className="ml-2 h-6 w-6 animate-pulse" />
              </Button>
            </motion.div>

            <motion.div 
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Card className="p-8 glass-strong hover:scale-105 transition-transform duration-300 border-white/20">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 mx-auto shadow-xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <TrendingUp className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-2xl mb-2 eco-gradient-text">1.2M kg</h3>
                  <p className="text-white/80 font-medium">CO₂ Saved This Month</p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 glass-strong hover:scale-105 transition-transform duration-300 border-white/20">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 mx-auto shadow-xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-2xl mb-2 text-blue-300">500+</h3>
                  <p className="text-white/80 font-medium">Active Buses Tracked</p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 glass-strong hover:scale-105 transition-transform duration-300 border-white/20">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 mx-auto shadow-xl"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-2xl mb-2 text-purple-300">50K+</h3>
                  <p className="text-white/80 font-medium">Eco-Conscious Users</p>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="relative z-10">
            <motion.h2 
              className="text-5xl font-display font-bold text-center mb-8 text-white drop-shadow-lg px-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Intelligent Features for a <span className="eco-gradient-text">Greener Future</span>
            </motion.h2>
            <FeatureCards />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-5xl font-display font-bold mb-8 text-white drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Make a <span className="eco-gradient-text">Difference</span>?
            </motion.h2>
            <motion.p 
              className="text-2xl text-white/90 mb-12 drop-shadow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Join BusBuddy today and be part of the movement towards sustainable urban transportation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => setLocation("/dashboard")}
                className="bg-white text-green-700 hover:bg-white/90 text-xl px-12 py-8 h-auto rounded-2xl shadow-2xl font-bold"
                data-testid="button-get-started-footer"
              >
                Get Started Now
                <Zap className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
