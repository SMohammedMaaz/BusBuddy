import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MapPin, Zap, Leaf, Shield, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description: "Track your bus location with GPS precision and AI-powered ETA predictions",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Get notified when your bus is nearby with smart proximity alerts",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Routes",
    description: "Save CO₂ and reduce fuel waste with AI-optimized green routing",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Shield,
    title: "Compliance Tracking",
    description: "Monitor bus fitness and pollution certificates for eco-validation",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: TrendingUp,
    title: "Live Analytics",
    description: "View real-time eco metrics, CO₂ savings, and environmental impact",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Passenger, driver, and admin dashboards for seamless coordination",
    color: "from-pink-500 to-pink-600"
  }
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100
    }
  })
};

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 py-16">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ 
              scale: 1.1, 
              y: -10,
              boxShadow: "0px 15px 40px rgba(0,166,150,0.6)",
              transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
            whileTap={{ scale: 0.95 }}
            data-testid={`card-feature-${index}`}
          >
            <Card className="glass-strong border-white/20 p-6 text-center cursor-pointer h-full hover-elevate active-elevate-2 overflow-visible relative">
              <motion.div 
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mx-auto mb-4`}
                whileHover={{ 
                  rotate: 360,
                  scale: 1.2,
                  transition: { duration: 0.6 }
                }}
                data-testid={`icon-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 eco-gradient-text" data-testid={`title-${index}`}>
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`description-${index}`}>
                {feature.description}
              </p>
              
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
