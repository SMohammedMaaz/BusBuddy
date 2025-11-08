import { useEffect, useRef, useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { Bus as BusType } from '@shared/schema';
import { Bus, MapPin, Users, Activity } from 'lucide-react';

interface AnimatedBusMarkerProps {
  bus: BusType;
  isSelected: boolean;
  onClick: () => void;
  onClose: () => void;
}

export function AnimatedBusMarker({ bus, isSelected, onClick, onClose }: AnimatedBusMarkerProps) {
  const [position, setPosition] = useState({ lat: bus.latitude, lng: bus.longitude });
  const previousPositionRef = useRef({ lat: bus.latitude, lng: bus.longitude });
  const animationFrameRef = useRef<number>();

  // Smooth animation between positions
  useEffect(() => {
    const startPos = previousPositionRef.current;
    const endPos = { lat: bus.latitude, lng: bus.longitude };
    
    // Only animate if position changed
    if (startPos.lat === endPos.lat && startPos.lng === endPos.lng) {
      return;
    }
    
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth movement
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const lat = startPos.lat + (endPos.lat - startPos.lat) * easeProgress;
      const lng = startPos.lng + (endPos.lng - startPos.lng) * easeProgress;
      
      setPosition({ lat, lng });
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        previousPositionRef.current = endPos;
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bus.latitude, bus.longitude]);

  // Create custom bus icon
  const busIcon = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: bus.status === 'active' ? '#1DB954' : '#94A3B8',
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 1.5,
    anchor: new google.maps.Point(12, 24),
  };

  const getStatusColor = () => {
    if (bus.status === 'active') return 'text-primary';
    if (bus.status === 'stopped') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getOccupancyColor = () => {
    if (bus.occupancy > 70) return 'text-destructive';
    if (bus.occupancy > 40) return 'text-accent';
    return 'text-primary';
  };

  return (
    <>
      <Marker
        position={position}
        onClick={onClick}
        icon={busIcon}
        animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
        data-testid={`bus-marker-${bus.busNumber}`}
      />
      
      {isSelected && (
        <InfoWindow
          position={position}
          onCloseClick={onClose}
        >
          <div className="p-3 min-w-[250px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground heading-poppins">{bus.busNumber}</h3>
                <p className="text-sm text-muted-foreground body-inter">{bus.routeName}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground body-inter">
                  <Activity className="w-4 h-4" />
                  Status
                </span>
                <span className={`font-semibold capitalize ${getStatusColor()}`}>
                  {bus.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground body-inter">
                  <MapPin className="w-4 h-4" />
                  Speed
                </span>
                <span className="font-semibold text-foreground">
                  {bus.currentSpeed.toFixed(0)} km/h
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground body-inter">
                  <Users className="w-4 h-4" />
                  Occupancy
                </span>
                <span className={`font-semibold ${getOccupancyColor()}`}>
                  {bus.occupancy}%
                </span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground body-inter">
                Last updated: {new Date(bus.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
