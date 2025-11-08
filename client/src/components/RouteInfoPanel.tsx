import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Route, Schedule } from "@shared/schema";
import { MapPin, Clock, Leaf, TrendingDown, Calendar } from "lucide-react";
import { getNextScheduledArrival, getMinutesUntilNextBus, formatETA } from "@/lib/eta-calculator";

interface RouteInfoPanelProps {
  route: Route;
  schedules: Schedule[];
  onSelectRoute?: () => void;
}

export function RouteInfoPanel({ route, schedules, onSelectRoute }: RouteInfoPanelProps) {
  const nextBus = getNextScheduledArrival(schedules);
  const minutesUntil = nextBus ? getMinutesUntilNextBus(nextBus) : null;
  const activeSchedules = schedules.filter(s => s.isActive === 'true').length;

  return (
    <Card className="p-5 glass-card-light hover:shadow-xl transition-all duration-300 border-primary/10">
      <div className="space-y-4">
        {/* Route Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {route.routeNumber && (
                <Badge variant="secondary" className="font-bold heading-poppins">
                  {route.routeNumber}
                </Badge>
              )}
              {route.isEcoRoute === 'true' && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Leaf className="w-3 h-3 mr-1" />
                  Eco
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-lg text-foreground heading-poppins">{route.name}</h3>
            <p className="text-sm text-muted-foreground body-inter">{route.city}</p>
          </div>
          
          {route.serviceClass && (
            <Badge variant="outline" className="shrink-0">
              {route.serviceClass}
            </Badge>
          )}
        </div>

        {/* Route Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-secondary shrink-0" />
            <div className="flex-1">
              <span className="text-muted-foreground body-inter">From:</span>
              <span className="ml-2 font-semibold text-foreground">{route.from}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-destructive shrink-0" />
            <div className="flex-1">
              <span className="text-muted-foreground body-inter">To:</span>
              <span className="ml-2 font-semibold text-foreground">{route.to}</span>
            </div>
          </div>
        </div>

        {/* Next Bus ETA */}
        {nextBus && minutesUntil !== null && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground body-inter">Next Bus</span>
              </div>
              <span className="text-sm text-muted-foreground body-inter">{nextBus}</span>
            </div>
            <div className="text-2xl font-bold text-primary heading-poppins">
              {formatETA(minutesUntil)}
            </div>
          </div>
        )}

        {/* Eco Stats */}
        {route.isEcoRoute === 'true' && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground body-inter">Environmental Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground body-inter">CO₂ Saved</span>
                </div>
                <p className="text-lg font-bold text-primary heading-poppins">
                  {route.estimatedCO2Savings.toFixed(1)} kg
                </p>
              </div>
              <div className="bg-secondary/5 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-secondary" />
                  <span className="text-xs text-muted-foreground body-inter">Schedules</span>
                </div>
                <p className="text-lg font-bold text-secondary heading-poppins">
                  {activeSchedules}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stops */}
        {route.stops && route.stops.length > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-foreground body-inter">Stops ({route.stops.length})</span>
            </div>
            <ScrollArea className="h-24">
              <div className="space-y-1">
                {route.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary' : idx === route.stops.length - 1 ? 'bg-destructive' : 'bg-muted-foreground'}`} />
                    <span className="text-muted-foreground body-inter">{stop.name}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Action Button */}
        {onSelectRoute && (
          <Button 
            onClick={onSelectRoute}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold"
            data-testid={`button-track-route-${route.id}`}
          >
            Track This Route
          </Button>
        )}
      </div>
    </Card>
  );
}
