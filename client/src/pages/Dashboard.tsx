import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { BusMap } from "@/components/BusMap";
import { EcoAnalytics } from "@/components/EcoAnalytics";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { DriverInterface } from "@/components/DriverInterface";
import { AdminPanel } from "@/components/AdminPanel";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Bus, Analytics } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

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

  const { data: buses = [] } = useQuery<Bus[]>({
    queryKey: ["/api/buses"],
    refetchInterval: 5000,
  });

  const { data: analytics = [] } = useQuery<Analytics[]>({
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" data-testid="button-menu">
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                BusBuddy
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{userData.name}</p>
                <p className="text-xs text-muted-foreground">{userData.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                data-testid="button-signout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <RoleSwitcher currentRole={activeRole} onRoleChange={setActiveRole} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeRole === "passenger" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 overflow-hidden h-[600px]">
                <BusMap
                  buses={buses}
                  selectedBus={selectedBus}
                  onBusSelect={setSelectedBus}
                />
              </Card>

              <div className="space-y-4">
                <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 p-6">
                  <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-track-bus">
                      Track My Bus
                    </Button>
                    <Button className="w-full justify-start" variant="outline" data-testid="button-view-routes">
                      View Routes
                    </Button>
                    <Button className="w-full justify-start" variant="outline" data-testid="button-eco-tips">
                      Eco Tips
                    </Button>
                  </div>
                </Card>

                {buses.length > 0 && (
                  <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 p-6">
                    <h3 className="font-semibold text-lg mb-4">Nearby Buses</h3>
                    <ul className="space-y-3">
                      {buses.slice(0, 3).map((bus) => (
                        <li
                          key={bus.id}
                          onClick={() => setSelectedBus(bus)}
                          className="p-3 rounded-lg border border-border hover-elevate cursor-pointer"
                          data-testid={`button-select-bus-${bus.id}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Bus {bus.busNumber}</p>
                              <p className="text-xs text-muted-foreground">{bus.routeName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                {Math.floor(Math.random() * 10 + 2)} min
                              </p>
                              <p className="text-xs text-muted-foreground">{bus.occupancy}% full</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            </div>

            <EcoAnalytics analytics={analytics} userEcoPoints={userData.ecoPoints} />
          </div>
        )}

        {activeRole === "driver" && (
          <DriverInterface
            busNumber="94"
            route="Green Line North"
            nextStops={["City Center", "University Ave", "Park Station", "North Terminal"]}
          />
        )}

        {activeRole === "admin" && (
          <AdminPanel buses={buses} analytics={analytics} totalUsers={12500} />
        )}
      </main>
    </div>
  );
}
