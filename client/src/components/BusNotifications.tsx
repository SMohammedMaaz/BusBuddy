import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Bus } from "@shared/schema";

interface BusNotificationsProps {
  userLocation?: { lat: number; lng: number };
  maxDistance?: number;
}

export function BusNotifications({ userLocation, maxDistance = 5 }: BusNotificationsProps) {
  const { data: buses = [] } = useQuery<Bus[]>({
    queryKey: ["/api/buses"],
    refetchInterval: 3000,
  });

  // Filter nearby buses (in a real app, this would use actual distance calculation)
  const nearbyBuses = buses
    .filter(bus => bus.status === "active")
    .slice(0, 3); // Show top 3 for demo

  const totalActive = buses.filter(bus => bus.status === "active").length;

  return (
    <Card className="glass-card-light border-primary/10" data-testid="card-bus-notifications">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <span className="text-lg">Bus Notifications</span>
          </div>
          <Badge className="bg-primary/20 text-primary" data-testid="badge-active-count">
            {totalActive} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nearbyBuses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BellOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No nearby buses at the moment</p>
          </div>
        ) : (
          nearbyBuses.map((bus) => (
            <Card
              key={bus.id}
              className="glass-card-light border-primary/10 hover-elevate"
              data-testid={`notification-bus-${bus.busNumber}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {bus.busNumber.substring(0, 3)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">
                        {bus.routeName.split("→")[0].trim()}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {bus.routeName.split("→")[1]?.trim() || "West"}
                      </p>
                      <p className="text-xs text-secondary font-medium mt-1">
                        Speed: {Math.round(bus.currentSpeed)} km/h
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0"
                    data-testid={`button-notify-${bus.busNumber}`}
                  >
                    Notify
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
