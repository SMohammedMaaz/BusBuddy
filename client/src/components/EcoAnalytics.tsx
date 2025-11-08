import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingUp, Droplet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import type { Analytics } from "@shared/schema";

interface EcoAnalyticsProps {
  analytics: Analytics[];
  userEcoPoints: number;
}

export function EcoAnalytics({ analytics, userEcoPoints }: EcoAnalyticsProps) {
  const latestAnalytics = analytics[analytics.length - 1] || {
    totalCO2Saved: 0,
    totalFuelSaved: 0,
    totalTrips: 0,
    avgBusSpeed: 0,
  };

  const chartData = analytics.slice(-7).map((item, index) => ({
    day: `Day ${index + 1}`,
    co2: item.totalCO2Saved,
    fuel: item.totalFuelSaved,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CO₂ Saved Today</CardTitle>
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {latestAnalytics.totalCO2Saved.toFixed(1)} kg
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span>12% increase from yesterday</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Equivalent to planting {Math.round(latestAnalytics.totalCO2Saved / 20)} trees
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Eco Points</CardTitle>
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {userEcoPoints}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            You're in the top 20% of eco-conscious riders
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
          <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Droplet className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {latestAnalytics.totalFuelSaved.toFixed(1)} L
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Through optimized eco-routes this week
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 hover-elevate lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Weekly CO₂ Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.9)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="co2" 
                stroke="#16a34a" 
                strokeWidth={2}
                fill="url(#colorCo2)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
