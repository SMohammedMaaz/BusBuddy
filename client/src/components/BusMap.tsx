import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Clock } from "lucide-react";
import type { Bus as BusType } from "@shared/schema";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

interface BusMapProps {
  buses: BusType[];
  selectedBus: BusType | null;
  onBusSelect: (bus: BusType) => void;
}

export function BusMap({ buses, selectedBus, onBusSelect }: BusMapProps) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [eta, setEta] = useState<number | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (selectedBus) {
      setMapCenter({ lat: selectedBus.latitude, lng: selectedBus.longitude });
      
      const distance = Math.random() * 5 + 1;
      const speed = selectedBus.currentSpeed || 30;
      const calculatedEta = (distance / speed) * 60;
      setEta(Math.round(calculatedEta));
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

  const busIcon = {
    path: "M12 2C11.45 2 11 2.45 11 3V4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H8V21C8 21.55 8.45 22 9 22C9.55 22 10 21.55 10 21V20H14V21C14 21.55 14.45 22 15 22C15.55 22 16 21.55 16 21V20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4H13V3C13 2.45 12.55 2 12 2M6 8H18V15H6V8Z",
    fillColor: "#16a34a",
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "#ffffff",
    scale: 1.5,
    anchor: { x: 12, y: 12 } as google.maps.Point,
  };

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
            <Marker
              key={bus.id}
              position={{ lat: bus.latitude, lng: bus.longitude }}
              icon={busIcon}
              onClick={() => onBusSelect(bus)}
              title={`Bus ${bus.busNumber} - ${bus.routeName}`}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {selectedBus && eta !== null && (
        <Card className="absolute top-4 right-4 p-4 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-2xl min-w-[200px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold">Bus {selectedBus.busNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ETA</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {eta} min
            </div>
            <Badge variant="outline" className="w-full justify-center">
              {selectedBus.routeName}
            </Badge>
            <div className="text-xs text-muted-foreground text-center">
              {selectedBus.occupancy}% capacity
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
