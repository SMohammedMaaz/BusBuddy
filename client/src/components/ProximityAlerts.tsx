import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, X, Plus, Navigation } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Bus, ProximityAlert } from "@shared/schema";

interface ProximityAlertsProps {
  buses: Bus[];
}

export function ProximityAlerts({ buses }: ProximityAlertsProps) {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const { data: alerts = [], isError: isAlertsError } = useQuery<ProximityAlert[]>({
    queryKey: ["/api/proximity-alerts/user", userData?.id],
    enabled: !!userData?.id,
  });

  const createAlertMutation = useMutation({
    mutationFn: async (busId: string) => {
      if (!userData?.id) throw new Error("User not authenticated");
      return await apiRequest("/api/proximity-alerts", {
        method: "POST",
        body: JSON.stringify({
          userId: userData.id,
          busId,
          alertDistance: 1.0,
          isActive: "true"
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proximity-alerts/user", userData?.id] });
      toast({
        title: "Proximity alert created!",
        description: "You'll be notified when your bus is within 1km"
      });
      setSelectedBusId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to create proximity alert",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      setSelectedBusId(null);
    }
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return await apiRequest(`/api/proximity-alerts/${alertId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proximity-alerts/user", userData?.id] });
      toast({ title: "Proximity alert removed" });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove proximity alert",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });

  const getPinnedBuses = () => {
    return alerts.map(alert => buses.find(bus => bus.id === alert.busId)).filter(Boolean) as Bus[];
  };

  const getAvailableBuses = () => {
    const pinnedBusIds = new Set(alerts.map(a => a.busId));
    return buses.filter(bus => !pinnedBusIds.has(bus.id));
  };

  const pinnedBuses = getPinnedBuses();
  const availableBuses = getAvailableBuses();

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-strong border-blue-500/30" data-testid="card-proximity-alerts">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-500" />
                <span>Proximity Alerts</span>
              </div>
              {!selectedBusId && availableBuses.length > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => setSelectedBusId("select")}
                    className="bg-blue-600 hover:bg-blue-700"
                    data-testid="button-add-alert"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Pin a Bus
                  </Button>
                </motion.div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Error State */}
            {isAlertsError && (
              <div className="text-center py-4 text-destructive">
                <p className="text-sm">Failed to load proximity alerts. Please try again later.</p>
              </div>
            )}

            {/* Bus Selection */}
            <AnimatePresence>
              {selectedBusId === "select" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <Card className="glass p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Select a bus to pin:</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedBusId(null)}
                        data-testid="button-cancel-select"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {availableBuses.map(bus => (
                        <motion.div
                          key={bus.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-start hover-elevate"
                            onClick={() => createAlertMutation.mutate(bus.id)}
                            disabled={createAlertMutation.isPending}
                            data-testid={`button-select-bus-${bus.busNumber}`}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>Bus #{bus.busNumber} - {bus.routeName}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pinned Buses */}
            <div className="space-y-3">
              {pinnedBuses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Navigation className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No buses pinned yet</p>
                  <p className="text-sm">Pin a bus to get notified when it's within 1km</p>
                </div>
              ) : (
                pinnedBuses.map((bus, index) => {
                  const alert = alerts.find(a => a.busId === bus.id);
                  
                  return (
                    <motion.div
                      key={bus.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      data-testid={`pinned-bus-${bus.busNumber}`}
                    >
                      <Card className="glass hover-elevate active-elevate-2">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <h4 className="font-semibold" data-testid={`alert-bus-${bus.busNumber}`}>
                                  Bus #{bus.busNumber}
                                </h4>
                                <Badge variant="secondary" className="bg-blue-500/20">
                                  <Bell className="w-3 h-3 mr-1" />
                                  Active
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{bus.routeName}</p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Alert Distance: 1.0 km</span>
                                <span>Speed: {bus.currentSpeed} km/h</span>
                              </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => alert && deleteAlertMutation.mutate(alert.id)}
                                disabled={deleteAlertMutation.isPending}
                                data-testid={`button-remove-alert-${bus.busNumber}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
