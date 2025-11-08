import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingUp, Droplet, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import type { Analytics } from "@shared/schema";

interface EcoAnalyticsProps {
  analytics: Analytics[];
  userEcoPoints: number;
}

// Count-up animation hook with decimal support
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Preserve decimals by animating the raw float value
      setCount(progress * end);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
}

export function EcoAnalytics({ analytics, userEcoPoints }: EcoAnalyticsProps) {
  const latestAnalytics = analytics[analytics.length - 1] || {
    totalCO2Saved: 0,
    totalFuelSaved: 0,
    totalTrips: 0,
    avgBusSpeed: 0,
  };

  const co2Count = useCountUp(latestAnalytics.totalCO2Saved);
  const fuelCount = useCountUp(latestAnalytics.totalFuelSaved);
  const pointsCount = useCountUp(userEcoPoints);

  const chartData = analytics.slice(-7).map((item, index) => ({
    day: `Day ${index + 1}`,
    co2: item.totalCO2Saved,
    fuel: item.totalFuelSaved,
  }));

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        data-testid="card-co2-wrapper"
        style={{ display: "block", transformOrigin: "center" }}
      >
        <Card className="glass-strong border-white/20 shadow-xl relative" data-testid="card-co2">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 animate-pulse-slow" />
          
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium">CO₂ Saved Today</CardTitle>
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Leaf className="w-6 h-6 text-white" />
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10">
            <motion.div 
              className="text-4xl font-bold eco-gradient-text"
              animate={{
                filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {co2Count.toFixed(1)} kg
            </motion.div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 animate-bounce-slow" />
              <span className="text-green-600 dark:text-green-400 font-medium">12% increase from yesterday</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Equivalent to planting {Math.round(latestAnalytics.totalCO2Saved / 20)} trees
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        data-testid="card-points-wrapper"
        style={{ display: "block", transformOrigin: "center" }}
      >
        <Card className="glass-strong border-white/20 shadow-xl relative" data-testid="card-points">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 animate-pulse-slow" />
          
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Your Eco Points</CardTitle>
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10">
            <motion.div 
              className="text-4xl font-bold"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {Math.round(pointsCount)}
            </motion.div>
            <p className="text-sm font-medium mt-3 text-blue-600 dark:text-blue-400">
              You're in the top 20% of eco-conscious riders
            </p>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: "80%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        data-testid="card-fuel-wrapper"
        style={{ display: "block", transformOrigin: "center" }}
      >
        <Card className="glass-strong border-white/20 shadow-xl relative" data-testid="card-fuel">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 animate-pulse-slow" />
          
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg"
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Droplet className="w-6 h-6 text-white" />
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10">
            <motion.div 
              className="text-4xl font-bold"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {fuelCount.toFixed(1)} L
            </motion.div>
            <p className="text-sm text-muted-foreground mt-3">
              Through optimized eco-routes this week
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        data-testid="card-trend-wrapper"
        style={{ display: "block", transformOrigin: "center" }}
      >
        <Card className="glass-strong border-white/20 shadow-xl lg:col-span-1" data-testid="card-trend">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <span className="eco-gradient-text">Weekly CO₂ Trend</span>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear",
                    repeatType: "loop"
                  }}
                >
                  <Sparkles className="w-4 h-4 text-green-500" data-testid="icon-sparkle-rotating" />
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="co2" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#colorCo2)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
