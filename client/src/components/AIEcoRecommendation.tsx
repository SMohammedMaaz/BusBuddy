import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, X, TrendingDown, Clock, MapPin } from "lucide-react";

interface AIEcoRecommendationProps {
  busNumber?: string;
  routeName?: string;
}

export function AIEcoRecommendation({ busNumber, routeName }: AIEcoRecommendationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const recommendation = {
    title: "🌱 AI Eco-Route Available!",
    description: `We found a greener route for ${routeName || "your destination"}`,
    savings: {
      co2: "2.5 kg",
      fuel: "1.2 L",
      time: "5 min"
    },
    confidence: 94
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-strong border-green-500/30 shadow-2xl w-96 overflow-hidden relative">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 animate-pulse-slow" />
              
              {/* Sparkle animation */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-green-400" />
              </motion.div>

              <div className="relative z-10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 eco-gradient-text flex items-center gap-2">
                      {recommendation.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible(false)}
                    className="hover-elevate -mr-2 -mt-2"
                    data-testid="button-close-recommendation"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <motion.div 
                    className="glass rounded-lg p-3 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">CO₂ Saved</p>
                    <motion.p 
                      className="font-bold eco-text-shift"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {recommendation.savings.co2}
                    </motion.p>
                  </motion.div>

                  <motion.div 
                    className="glass rounded-lg p-3 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <TrendingDown className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Fuel Saved</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {recommendation.savings.fuel}
                    </p>
                  </motion.div>

                  <motion.div 
                    className="glass rounded-lg p-3 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Time</p>
                    <p className="font-bold text-purple-600 dark:text-purple-400">
                      +{recommendation.savings.time}
                    </p>
                  </motion.div>
                </div>

                {/* AI Confidence meter */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">AI Confidence</span>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {recommendation.confidence}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${recommendation.confidence}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      data-testid="button-accept-recommendation"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Use This Route
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline"
                      onClick={() => setIsVisible(false)}
                      className="hover-elevate"
                      data-testid="button-dismiss-recommendation"
                    >
                      Maybe Later
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
