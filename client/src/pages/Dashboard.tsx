import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { BusMap } from "@/components/BusMap";
import { EcoAnalytics } from "@/components/EcoAnalytics";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { DriverInterface } from "@/components/DriverInterface";
import { AdminPanel } from "@/components/AdminPanel";
import { AIEcoRecommendation } from "@/components/AIEcoRecommendation";
import { ProximityAlerts } from "@/components/ProximityAlerts";
import { BusCompliancePanel } from "@/components/BusCompliancePanel";
import { LogOut, Menu, Moon, Sun, AlertCircle, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Bus, Analytics } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner, LoadingSkeleton } from "@/components/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { currentUser, userData, signOut } = useAuth();
  const { toast } = useToast();
  const [activeRole, setActiveRole] = useState<string>("passenger");
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  useEffect(() => {
    if (userData?.role) {
      setActiveRole(userData.role);
    }
  }, [userData]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const { data: buses = [], isLoading: busesLoading, error: busesError } = useQuery<Bus[]>({
    queryKey: ["/api/buses"],
    refetchInterval: 5000,
  });

  const { data: analytics = [], isLoading: analyticsLoading } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
  });

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out successfully" });
    setLocation("/");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  if (!currentUser || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-950/50 dark:to-blue-950/50" />
      
      {/* Glassmorphic overlay pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10">
        <motion.header 
          className="sticky top-0 z-50 glass border-b border-white/10 shadow-lg"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <Button variant="ghost" size="icon" className="lg:hidden hover-elevate" data-testid="button-menu">
                  <Menu className="w-5 h-5" />
                </Button>
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-display font-bold eco-gradient-text">
                    BusBuddy
                  </h1>
                </motion.div>
              </motion.div>

              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="hover-elevate"
                    data-testid="button-theme-toggle"
                  >
                    {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </Button>
                </motion.div>
                <motion.div 
                  className="hidden sm:block glass px-4 py-2 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm font-semibold">{userData.name}</p>
                  <p className="text-xs text-muted-foreground">{userData.email}</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="hover-elevate"
                    data-testid="button-signout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              </div>
            </div>

            <motion.div 
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <RoleSwitcher currentRole={activeRole} onRoleChange={setActiveRole} />
            </motion.div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {busesError && (
            <motion.div {...fadeIn}>
              <Alert variant="destructive" className="mb-6 glass-strong">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load bus data. Please refresh the page.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeRole === "passenger" && (
              <motion.div 
                key="passenger"
                {...fadeIn}
                className="space-y-6"
              >
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div 
                    className="lg:col-span-2"
                    variants={fadeIn}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="glass-strong border-white/20 overflow-hidden h-[600px] shadow-2xl">
                      {busesLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <LoadingSpinner message="Loading map..." />
                        </div>
                      ) : (
                        <BusMap
                          buses={buses}
                          selectedBus={selectedBus}
                          onBusSelect={setSelectedBus}
                        />
                      )}
                    </Card>
                  </motion.div>

                  <motion.div 
                    className="space-y-4"
                    variants={fadeIn}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="glass-strong border-white/20 p-6 shadow-xl">
                        <h3 className="font-bold text-lg mb-4 eco-gradient-text">Quick Actions</h3>
                        <div className="space-y-3">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button className="w-full justify-start hover-elevate" variant="outline" data-testid="button-track-bus">
                              Track My Bus
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button className="w-full justify-start hover-elevate" variant="outline" data-testid="button-view-routes">
                              View Routes
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button className="w-full justify-start hover-elevate" variant="outline" data-testid="button-eco-tips">
                              Eco Tips
                            </Button>
                          </motion.div>
                        </div>
                      </Card>
                    </motion.div>

                    {buses.length > 0 && (
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="glass-strong border-white/20 p-6 shadow-xl">
                          <h3 className="font-bold text-lg mb-4 eco-gradient-text">Nearby Buses</h3>
                          <ul className="space-y-3">
                            {buses.slice(0, 3).map((bus, index) => (
                              <motion.li
                                key={bus.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.03, x: 4 }}
                                onClick={() => setSelectedBus(bus)}
                                className="p-4 rounded-xl glass border border-white/20 hover-elevate cursor-pointer"
                                data-testid={`button-select-bus-${bus.id}`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold">Bus {bus.busNumber}</p>
                                    <p className="text-xs text-muted-foreground">{bus.routeName}</p>
                                  </div>
                                  <div className="text-right">
                                    <motion.p 
                                      className="text-sm font-bold eco-text-shift"
                                      animate={{ scale: [1, 1.05, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      {Math.floor(Math.random() * 10 + 2)} min
                                    </motion.p>
                                    <p className="text-xs text-muted-foreground">{bus.occupancy}% full</p>
                                  </div>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </Card>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {analyticsLoading ? (
                  <Card className="glass-strong border-white/20 p-6">
                    <LoadingSkeleton />
                  </Card>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <EcoAnalytics analytics={analytics} userEcoPoints={userData.ecoPoints} />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <ProximityAlerts buses={buses} />
                </motion.div>

                {/* AI Eco Route Recommendation Popup */}
                <AIEcoRecommendation 
                  busNumber={selectedBus?.busNumber}
                  routeName={selectedBus?.routeName}
                />
              </motion.div>
            )}

            {activeRole === "driver" && (
              <motion.div key="driver" {...fadeIn}>
                <DriverInterface
                  busNumber="94"
                  route="Green Line North"
                  nextStops={["City Center", "University Ave", "Park Station", "North Terminal"]}
                />
              </motion.div>
            )}

            {activeRole === "admin" && (
              <motion.div key="admin" {...fadeIn} className="space-y-6">
                <AdminPanel buses={buses} analytics={analytics} totalUsers={12500} />
                <BusCompliancePanel buses={buses} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
