import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SOSButton } from "@/components/SOSButton";
import { Chatbot } from "@/components/Chatbot";
import { BusMap } from "@/components/BusMap";
import { DriverInterface } from "@/components/DriverInterface";
import { AdminPanel } from "@/components/AdminPanel";
import { 
  Bus, MapPin, LogOut, Search, Navigation, Shield, 
  Users, TrendingUp, FileCheck, Clock, AlertCircle,
  Upload, Leaf, BarChart3, Bell, Settings
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Bus as BusType, EcoStats, Analytics } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [activeRole, setActiveRole] = useState<"passenger" | "driver" | "admin">("passenger");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  // Get role from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role === "driver" || role === "admin") {
      setActiveRole(role);
    }
  }, []);

  // Fetch buses data
  const { data: buses = [] } = useQuery<BusType[]>({
    queryKey: ["/api/buses"],
    refetchInterval: 3000,
  });

  // Derive selected bus from live buses array
  const selectedBus = selectedBusId ? buses.find(b => b.id === selectedBusId) || null : null;

  // Fetch eco stats
  const { data: ecoStats } = useQuery<EcoStats[]>({
    queryKey: ["/api/eco-stats"],
  });

  // Fetch analytics
  const { data: analytics = [] } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
  });

  const latestStats = ecoStats?.[0];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 animated-gradient-bg opacity-40" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-card border-b border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary electric-glow flex items-center justify-center">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold eco-gradient-text">BusBuddy</h1>
                  <p className="text-xs text-muted-foreground">Karnataka Transit</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Role Selector */}
                <div className="hidden sm:flex items-center gap-1 glass rounded-lg p-1">
                  {["passenger", "driver", "admin"].map((role) => (
                    <Button
                      key={role}
                      variant={activeRole === role ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveRole(role as typeof activeRole)}
                      className={activeRole === role ? "bg-gradient-to-r from-primary to-secondary text-white" : ""}
                      data-testid={`button-role-${role}`}
                    >
                      {role === "passenger" && <Users className="w-4 h-4 mr-1" />}
                      {role === "driver" && <Navigation className="w-4 h-4 mr-1" />}
                      {role === "admin" && <Shield className="w-4 h-4 mr-1" />}
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocation("/")}
                  data-testid="button-logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Passenger Dashboard */}
          {activeRole === "passenger" && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-foreground">
                  Welcome, <span className="eco-gradient-text">Traveler</span>
                </h2>
                <p className="text-muted-foreground">Track your bus in real-time and save the planet</p>
              </motion.div>

              {/* Search Bar */}
              <Card className="glass-card border-primary/10 p-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search bus number or route (e.g., 145B, VVIET to Mysuru)"
                      className="pl-10 glass border-primary/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-bus"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white" data-testid="button-search">
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="border-accent text-accent hover-elevate" data-testid="button-pin-bus">
                    <Bell className="w-5 h-5 mr-2" />
                    Pin Bus
                  </Button>
                </div>
              </Card>

              {/* Eco Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card border-secondary/20 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 eco-glow flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                      <h3 className="text-2xl font-bold co2-counter text-secondary">
                        {latestStats?.co2Saved?.toFixed(1) || "0.0"} kg
                      </h3>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card border-primary/20 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/70 electric-glow flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Eco Score</p>
                      <h3 className="text-2xl font-bold text-primary">87</h3>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card border-accent/20 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-accent/70 lime-glow flex items-center justify-center">
                      <Users className="w-8 h-8 text-background" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Buses</p>
                      <h3 className="text-2xl font-bold text-accent">{buses.length}</h3>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Live Bus Map */}
              <Card className="glass-card border-primary/10 p-6 h-96">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Live Bus Tracking Map
                </h3>
                <div className="h-80">
                  <BusMap 
                    buses={buses} 
                    selectedBus={selectedBus}
                    onBusSelect={(bus) => setSelectedBusId(bus.id)}
                  />
                </div>
              </Card>

              {/* Available Buses */}
              <Card className="glass-card border-primary/10 p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Available Buses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buses.slice(0, 6).map((bus) => (
                    <Card key={bus.id} className="glass border-primary/10 p-4 hover:glass-strong transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary electric-glow flex items-center justify-center">
                            <Bus className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{bus.busNumber}</h4>
                            <p className="text-sm text-muted-foreground">{bus.routeName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-secondary/20 text-secondary">
                            {bus.currentSpeed} km/h
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {bus.status === "active" ? "On Route" : "Stopped"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Driver Dashboard */}
          {activeRole === "driver" && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-foreground">
                  Driver <span className="eco-gradient-text">Dashboard</span>
                </h2>
                <p className="text-muted-foreground">Manage your route and upload documents</p>
              </motion.div>

              {/* Driver Interface Component */}
              <DriverInterface 
                busNumber="145B"
                route="VVIET College → Mysuru City Bus Stand"
                nextStops={["Bannimantap Junction", "Kuvempunagar Circle", "City Bus Stand"]}
              />

              {/* Document Upload */}
              <Card className="glass-card border-primary/10 p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-primary" />
                  Document Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "PUC Certificate", valid: "2026-03-15", status: "valid" },
                    { name: "Fitness Certificate", valid: "2025-11-20", status: "expiring" },
                    { name: "Driving License", valid: "2027-05-10", status: "valid" },
                    { name: "RC Certificate", valid: "2026-08-30", status: "valid" }
                  ].map((doc, index) => (
                    <Card key={index} className="glass border-primary/10 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-foreground">{doc.name}</h4>
                        <Badge className={doc.status === "valid" ? "bg-secondary/20 text-secondary" : "bg-accent/20 text-accent"}>
                          {doc.status === "valid" ? "✓ Valid" : "⚠ Expiring Soon"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Valid until: {doc.valid}</p>
                      <Button size="sm" variant="outline" className="w-full border-primary/20" data-testid={`button-upload-${doc.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New
                      </Button>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Eco Insights */}
              <Card className="glass-card border-secondary/10 p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-secondary" />
                  Eco Driving Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 glass rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Daily Fuel Usage</p>
                    <h4 className="text-2xl font-bold text-primary">48.3 L</h4>
                  </div>
                  <div className="p-4 glass rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Eco Score</p>
                    <h4 className="text-2xl font-bold text-secondary">92/100</h4>
                  </div>
                  <div className="p-4 glass rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">AI Tip</p>
                    <p className="text-sm text-accent">Avoid long idling</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Admin Dashboard */}
          {activeRole === "admin" && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-foreground">
                  Admin <span className="eco-gradient-text">Control Center</span>
                </h2>
                <p className="text-muted-foreground">Monitor fleet, validate documents, and view analytics</p>
              </motion.div>

              {/* Admin Panel Component */}
              <AdminPanel 
                buses={buses}
                analytics={analytics}
                totalUsers={1000}
              />

              {/* Fleet Map Placeholder */}
              <Card className="glass-card border-primary/10 p-6 h-96">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Live Fleet Map
                </h3>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary electric-glow flex items-center justify-center bus-marker">
                          <Bus className="w-8 h-8 text-white" />
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      Multi-bus tracking map with real-time GPS updates
                    </p>
                  </div>
                </div>
              </Card>

              {/* Document Validation */}
              <Card className="glass-card border-primary/10 p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-primary" />
                  Document Validation Center
                </h3>
                <div className="space-y-3">
                  {[
                    { bus: "KA09 F 1234", driver: "Rajesh Kumar", status: "valid", expiring: null },
                    { bus: "KA09 G 5678", driver: "Suresh Patil", status: "expiring", expiring: "Fitness - 15 days" },
                    { bus: "KA09 H 9012", driver: "Manjunath R", status: "expired", expiring: "PUC Certificate" }
                  ].map((item, index) => (
                    <div key={index} className="p-4 glass rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Bus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{item.bus}</h4>
                          <p className="text-sm text-muted-foreground">{item.driver}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.expiring && (
                          <span className="text-sm text-accent">{item.expiring}</span>
                        )}
                        <Badge className={
                          item.status === "valid" ? "bg-secondary/20 text-secondary" :
                          item.status === "expiring" ? "bg-accent/20 text-accent" :
                          "bg-destructive/20 text-destructive"
                        }>
                          {item.status === "valid" ? "✅ Valid" :
                           item.status === "expiring" ? "⚠️ Expiring" :
                           "❌ Expired"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Analytics */}
              <Card className="glass-card border-primary/10 p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  System Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 glass rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">Monthly CO₂ Savings</p>
                    <h4 className="text-3xl font-bold co2-counter text-secondary mb-2">13+ tons</h4>
                    <p className="text-sm text-accent">↑ 40% from last month</p>
                  </div>
                  <div className="p-4 glass rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">Fuel Saved</p>
                    <h4 className="text-3xl font-bold text-primary mb-2">5,000 L</h4>
                    <p className="text-sm text-accent">↑ 25% improvement</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Floating Components */}
      <SOSButton />
      <Chatbot />
    </div>
  );
}
