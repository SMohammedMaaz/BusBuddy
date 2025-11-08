import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bus, MapPin, Zap, Leaf, Shield, MessageCircle, 
  TrendingUp, Users, Clock, Navigation, AlertCircle, FileCheck 
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden hero-gradient">
      {/* Hero Overlay for Readability */}
      <div className="fixed inset-0 hero-overlay" />
      
      {/* Animated Floating Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div
          className="absolute top-20 left-10 floating"
          style={{ animationDelay: "0s" }}
        >
          <Bus className="w-16 h-16 text-white" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 floating"
          style={{ animationDelay: "1s" }}
        >
          <Leaf className="w-20 h-20 text-white" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 floating"
          style={{ animationDelay: "2s" }}
        >
          <MapPin className="w-14 h-14 text-white" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-40 floating"
          style={{ animationDelay: "1.5s" }}
        >
          <Navigation className="w-12 h-12 text-white" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header - Glassmorphism Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E676] to-[#00B0FF] flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bus className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl heading-poppins logo-gradient">
                  BusBuddy
                </h1>
                <p className="text-xs text-white/80 italic">Greener Karnataka</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                onClick={() => setLocation("/dashboard")}
                className="glow-button pulse-glow"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 pb-16">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div {...fadeInUp} className="mb-8">
              <motion.div 
                className="inline-block mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="px-6 py-3 rounded-full glass-card-bright text-sm font-medium text-white border border-white/30 inline-flex items-center gap-2 subheading-nunito">
                  <Leaf className="w-4 h-4" />
                  Green Intelligence: AI for a Sustainable Planet
                </span>
              </motion.div>
              
              {/* Hero Text with Max Width Container */}
              <div className="max-w-4xl mx-auto text-center px-4">
                <motion.h2 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl heading-poppins mb-8 text-white neon-text leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Smarter Routes.
                  <br />
                  Safer Cities.
                  <br />
                  <span className="gradient-text">Greener Karnataka.</span>
                </motion.h2>
              </div>
            </motion.div>
            
            <motion.p 
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed body-inter"
              style={{ fontSize: '1.3rem' }}
            >
              AI-powered bus tracking for <span className="gradient-text">Mysuru</span> and <span className="gradient-text">Bengaluru</span>. 
              Real-time ETA predictions, eco-routing, SOS emergency support, and smart notifications for sustainable urban transport.
            </motion.p>
            
            {/* Single CTA Button - Minimal & Professional */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => setLocation("/dashboard")}
                  className="glow-button pulse-glow text-lg px-12 py-6 h-auto"
                  data-testid="button-hero-get-started"
                >
                  Get Started
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Live Stats */}
            <motion.div 
              className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Card className="p-8 glass-card-bright hover:shadow-2xl transition-all duration-300 border-white/20 floating">
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00E676] to-[#00B0FF] flex items-center justify-center mb-6 mx-auto shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-3xl mb-2 co2-counter text-white heading-poppins">13+ tons</h3>
                  <p className="text-white/80 font-medium body-inter">CO₂ Saved Monthly</p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 glass-card-bright hover:shadow-2xl transition-all duration-300 border-white/20 floating" style={{ animationDelay: "0.5s" }}>
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00B0FF] to-[#00E676] flex items-center justify-center mb-6 mx-auto shadow-lg bus-marker"
                  >
                    <Bus className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-3xl mb-2 co2-counter text-white heading-poppins">500+</h3>
                  <p className="text-white/80 font-medium body-inter">Active Buses Tracked</p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 glass-card-bright hover:shadow-2xl transition-all duration-300 border-white/20 floating" style={{ animationDelay: "1s" }}>
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD54F] to-[#00E676] flex items-center justify-center mb-6 mx-auto shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-3xl mb-2 co2-counter text-white heading-poppins">5,000L</h3>
                  <p className="text-white/80 font-medium body-inter">Diesel Saved Monthly</p>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 relative">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl heading-poppins mb-4 text-white neon-text">
                Intelligent Features for a <span className="gradient-text">Greener Future</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto subheading-nunito">
                Comprehensive ecosystem for passengers, drivers, and administrators
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: MapPin,
                  title: "Real-Time Tracking",
                  description: "Track buses live on Google Maps with AI-powered ETA predictions",
                  color: "from-primary to-primary/70",
                  glow: "electric-glow"
                },
                {
                  icon: Shield,
                  title: "SOS Emergency",
                  description: "One-tap emergency alerts to admin, police, and emergency contacts",
                  color: "from-destructive to-destructive/70",
                  glow: "electric-glow"
                },
                {
                  icon: MessageCircle,
                  title: "AI Chatbot",
                  description: "24/7 intelligent assistant in English & Kannada on every page",
                  color: "from-secondary to-secondary/70",
                  glow: "eco-glow"
                },
                {
                  icon: AlertCircle,
                  title: "Proximity Alerts",
                  description: "Get notified via SMS/WhatsApp when your bus is 1km away",
                  color: "from-accent to-accent/70",
                  glow: "lime-glow"
                },
                {
                  icon: FileCheck,
                  title: "Document Validation",
                  description: "Auto-validate PUC, Fitness, DL, RC certificates with expiry alerts",
                  color: "from-primary to-secondary",
                  glow: "electric-glow"
                },
                {
                  icon: Leaf,
                  title: "Eco Analytics",
                  description: "Track your CO₂ savings, fuel reduction, and environmental impact",
                  color: "from-secondary to-accent",
                  glow: "eco-glow"
                }
              ].map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="p-6 glass-card-bright hover:shadow-2xl transition-all duration-300 border-white/20 h-full">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white subheading-nunito">{feature.title}</h3>
                    <p className="text-white/80 body-inter">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Role-Specific Features */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
                Three Powerful <span className="eco-gradient-text">Dashboards</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  role: "Passenger",
                  icon: Users,
                  features: ["Search & track buses", "Live map with ETA", "Pin bus for alerts", "SOS emergency", "Eco dashboard", "Chatbot support"],
                  color: "primary",
                  action: () => setLocation("/dashboard?role=passenger")
                },
                {
                  role: "Driver",
                  icon: Navigation,
                  features: ["Start/stop trip", "Auto GPS sync", "Upload documents", "Report traffic", "Eco insights", "Fuel usage log"],
                  color: "secondary",
                  action: () => setLocation("/dashboard?role=driver")
                },
                {
                  role: "Admin",
                  icon: Shield,
                  features: ["Fleet live map", "Validate documents", "Monitor SOS", "Analytics & reports", "Driver management", "Broadcast alerts"],
                  color: "accent",
                  action: () => setLocation("/dashboard?role=admin")
                }
              ].map((dashboard, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.7 }}
                >
                  <Card className="p-8 glass-card hover:glass-strong transition-all duration-300 border-primary/10 h-full flex flex-col">
                    <div className={`w-20 h-20 rounded-2xl bg-${dashboard.color} flex items-center justify-center mb-6 mx-auto`}>
                      <dashboard.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl mb-4 text-center eco-gradient-text">{dashboard.role}</h3>
                    <ul className="space-y-3 mb-8 flex-grow">
                      {dashboard.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={dashboard.action}
                      className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                      data-testid={`button-${dashboard.role.toLowerCase()}-dashboard`}
                    >
                      Open {dashboard.role} Dashboard
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">
                Ready to Transform <span className="eco-gradient-text">Karnataka's Transport</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Join BusBuddy today and contribute to a sustainable, safer, and smarter future for Mysuru and Bengaluru.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => setLocation("/dashboard")}
                  className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] text-white text-xl px-16 py-8 h-auto rounded-2xl electric-glow font-bold animate-shimmer"
                  data-testid="button-start-journey"
                >
                  Start Your Journey
                  <Zap className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 glass-card border-t border-primary/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-muted-foreground">
              © 2025 BusBuddy | <span className="eco-gradient-text">Greener Karnataka</span> 🌱
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Mysuru · Bengaluru · Sustainable Transit
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
