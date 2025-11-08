import { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Clock, MapPin } from "lucide-react";
import type { Bus as BusType } from "@shared/schema";
import { AnimatedBusMarker } from "./AnimatedBusMarker";
import { calculateETA, formatETA, getETAStatusColor } from "@/lib/eta-calculator";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem",
};

// Karnataka center point between Mysuru (12.2958, 76.6394) and Bengaluru (12.9716, 77.5946)
const defaultCenter = {
  lat: 12.6337,
  lng: 77.1175,
};

interface BusMapProps {
  buses: BusType[];
  selectedBus: BusType | null;
  onBusSelect: (bus: BusType) => void;
}

export function BusMap({ buses, selectedBus, onBusSelect }: BusMapProps) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [eta, setEta] = useState<number | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (selectedBus) {
      setMapCenter({ lat: selectedBus.latitude, lng: selectedBus.longitude });
      setSelectedBusId(selectedBus.id);
      
      // Calculate ETA to a point 2km ahead (simulating nearest stop)
      const nearestStop = {
        lat: selectedBus.latitude + 0.018, // ~2km north
        lng: selectedBus.longitude
      };
      
      const calculatedEta = calculateETA(selectedBus, nearestStop);
      setEta(calculatedEta);
    }
  }, [selectedBus]);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-2xl">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To display the live bus tracking map, please add your Google Maps API key to the secrets.
          </p>
          <p className="text-xs text-muted-foreground">
            Add VITE_GOOGLE_MAPS_API_KEY to your environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={13}
          options={{
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ saturation: -20 }]
              }
            ],
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
          }}
        >
          {buses.map((bus) => (
            <AnimatedBusMarker
              key={bus.id}
              bus={bus}
              isSelected={bus.id === selectedBusId}
              onClick={() => onBusSelect(bus)}
              onClose={() => setSelectedBusId(null)}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {selectedBus && eta !== null && (
        <Card className="absolute top-4 right-4 p-5 glass-card-light shadow-2xl min-w-[280px]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground heading-poppins">{selectedBus.busNumber}</h3>
                <p className="text-sm text-muted-foreground body-inter">Live Tracking</p>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground body-inter">ETA to Next Stop</span>
                </div>
              </div>
              <div className={`text-4xl font-bold ${getETAStatusColor(eta)} heading-poppins`}>
                {formatETA(eta)}
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-sm font-semibold text-foreground body-inter">{selectedBus.routeName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground body-inter">Occupancy</span>
                <Badge variant={selectedBus.occupancy > 70 ? "destructive" : "secondary"} className="font-semibold">
                  {selectedBus.occupancy}%
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
