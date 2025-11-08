import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Navigation, AlertTriangle, Clock } from "lucide-react";

interface DriverInterfaceProps {
  busNumber: string;
  route: string;
  nextStops: string[];
}

export function DriverInterface({ busNumber, route, nextStops }: DriverInterfaceProps) {
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [trafficReport, setTrafficReport] = useState("");

  const handleTrafficReport = () => {
    console.log("Traffic report submitted:", trafficReport);
    setTrafficReport("");
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-green-600" />
            Active Route
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bus Number</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{busNumber}</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {route}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <Label htmlFor="gps-toggle" className="flex items-center gap-2 cursor-pointer">
              <MapPin className="w-4 h-4" />
              GPS Location Sharing
            </Label>
            <Switch
              id="gps-toggle"
              checked={gpsEnabled}
              onCheckedChange={setGpsEnabled}
              data-testid="switch-gps-sharing"
            />
          </div>
          {gpsEnabled && (
            <p className="text-xs text-muted-foreground">
              Your location is being shared in real-time with passengers
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Next Stops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {nextStops.map((stop, index) => (
              <li key={index} className="flex items-center gap-3 p-3 rounded-lg hover-elevate border border-border">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-semibold text-green-600 dark:text-green-400">
                  {index + 1}
                </div>
                <span className="font-medium">{stop}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Report Traffic Delay
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the traffic situation or delay..."
            value={trafficReport}
            onChange={(e) => setTrafficReport(e.target.value)}
            className="min-h-[100px]"
            data-testid="textarea-traffic-report"
          />
          <Button
            onClick={handleTrafficReport}
            disabled={!trafficReport.trim()}
            className="w-full"
            data-testid="button-submit-traffic-report"
          >
            Submit Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
