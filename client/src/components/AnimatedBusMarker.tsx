import { useEffect, useRef, useState } from 'react';
import { Marker, InfoWindow, Polyline, Circle } from '@react-google-maps/api';
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
  const [heading, setHeading] = useState(0);
  const [trail, setTrail] = useState<google.maps.LatLngLiteral[]>([]);
  const [pulseRadius, setPulseRadius] = useState(50);
  const [pulseOpacity, setPulseOpacity] = useState(0.2);
  const previousPositionRef = useRef({ lat: bus.latitude, lng: bus.longitude });
  const animationFrameRef = useRef<number>();
  const pulseAnimationRef = useRef<number>();
  const growingRef = useRef(true);
  const currentRadiusRef = useRef(50);

  // Calculate heading/direction of movement
  const calculateHeading = (from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral) => {
    const dLng = to.lng - from.lng;
    const dLat = to.lat - from.lat;
    const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
    return angle;
  };

  // Pulsing animation for active buses
  useEffect(() => {
    if (bus.status !== 'active') {
      return;
    }

    const pulseSpeed = 0.5;
    const minRadius = 40;
    const maxRadius = 80;
    const minOpacity = 0.1;
    const maxOpacity = 0.4;
    
    const animatePulse = () => {
      // Update radius using ref to maintain state
      if (growingRef.current) {
        currentRadiusRef.current += pulseSpeed;
        if (currentRadiusRef.current >= maxRadius) {
          currentRadiusRef.current = maxRadius;
          growingRef.current = false;
        }
      } else {
        currentRadiusRef.current -= pulseSpeed;
        if (currentRadiusRef.current <= minRadius) {
          currentRadiusRef.current = minRadius;
          growingRef.current = true;
        }
      }
      
      const newRadius = currentRadiusRef.current;
      const radiusProgress = (newRadius - minRadius) / (maxRadius - minRadius);
      const newOpacity = maxOpacity - (radiusProgress * (maxOpacity - minOpacity));
      
      setPulseRadius(newRadius);
      setPulseOpacity(newOpacity);
      
      pulseAnimationRef.current = requestAnimationFrame(animatePulse);
    };
    
    pulseAnimationRef.current = requestAnimationFrame(animatePulse);
    
    return () => {
      if (pulseAnimationRef.current) {
        cancelAnimationFrame(pulseAnimationRef.current);
      }
    };
  }, [bus.status]);

  // Smooth animation between positions
  useEffect(() => {
    const startPos = previousPositionRef.current;
    const endPos = { lat: bus.latitude, lng: bus.longitude };
    
    // Only animate if position changed
    if (startPos.lat === endPos.lat && startPos.lng === endPos.lng) {
      return;
    }
    
    // Calculate heading for rotation
    const newHeading = calculateHeading(startPos, endPos);
    setHeading(newHeading);
    
    // Update trail (keep last 10 positions)
    setTrail(prev => {
      const newTrail = [...prev, startPos];
      return newTrail.slice(-10);
    });
    
    const duration = 2500; // 2.5 seconds for smoother animation
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smoother easing function (ease-in-out cubic)
      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
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

  // Enhanced bus icon with direction indicator (arrow/bus shape)
  const busIcon = {
    path: 'M12 2 L16 6 L14 6 L14 14 L16 16 L12 20 L8 16 L10 14 L10 6 L8 6 Z',
    fillColor: bus.status === 'active' ? '#1DB954' : '#94A3B8',
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 1.2,
    anchor: new google.maps.Point(12, 12),
    rotation: heading,
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
      {/* Movement trail - shows bus path */}
      {trail.length > 1 && (
        <Polyline
          path={[...trail, position]}
          options={{
            strokeColor: bus.status === 'active' ? '#1DB954' : '#94A3B8',
            strokeOpacity: 0.6,
            strokeWeight: 3,
            geodesic: true,
          }}
        />
      )}
      
      {/* Pulsing circle for active buses */}
      {bus.status === 'active' && (
        <Circle
          center={position}
          radius={pulseRadius}
          options={{
            strokeColor: '#1DB954',
            strokeOpacity: pulseOpacity + 0.3,
            strokeWeight: 2,
            fillColor: '#1DB954',
            fillOpacity: pulseOpacity,
          }}
        />
      )}
      
      {/* Animated bus marker with direction */}
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
