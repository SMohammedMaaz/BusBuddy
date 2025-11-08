import { Bus, Schedule, Route } from '@shared/schema';

interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(point1: LatLng, point2: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate ETA for a bus to reach a specific stop
 */
export function calculateETA(
  bus: Bus,
  destinationStop: LatLng,
  route?: Route
): number {
  const busPosition: LatLng = {
    lat: bus.latitude,
    lng: bus.longitude
  };
  
  // Calculate straight-line distance
  const distance = calculateDistance(busPosition, destinationStop);
  
  // Add 20% for road curvature
  const actualDistance = distance * 1.2;
  
  // Get current speed or use average city speed
  const speed = bus.currentSpeed || 25; // km/h
  
  // Calculate time in hours, then convert to minutes
  const timeInHours = actualDistance / speed;
  const etaMinutes = timeInHours * 60;
  
  // Add traffic buffer (2-5 minutes)
  const trafficBuffer = Math.random() * 3 + 2;
  
  return Math.round(etaMinutes + trafficBuffer);
}

/**
 * Get the next bus arrival time based on schedule
 */
export function getNextScheduledArrival(schedules: Schedule[]): string | null {
  if (!schedules || schedules.length === 0) return null;
  
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  // Find next departure after current time
  const upcomingSchedules = schedules
    .filter(s => s.isActive === 'true' && s.departureTime > currentTime)
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  
  if (upcomingSchedules.length > 0) {
    return upcomingSchedules[0].departureTime;
  }
  
  // If no more buses today, return first bus tomorrow
  const firstSchedule = schedules
    .filter(s => s.isActive === 'true')
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime))[0];
  
  return firstSchedule ? firstSchedule.departureTime : null;
}

/**
 * Calculate minutes until next scheduled departure
 */
export function getMinutesUntilNextBus(nextScheduledTime: string | null): number | null {
  if (!nextScheduledTime) return null;
  
  const now = new Date();
  const [hours, minutes] = nextScheduledTime.split(':').map(Number);
  
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  // If scheduled time is in the past today, it's tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const diffMs = scheduledTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  return diffMinutes;
}

/**
 * Format ETA for display
 */
export function formatETA(minutes: number): string {
  if (minutes < 1) return 'Arriving now';
  if (minutes === 1) return '1 min';
  if (minutes < 60) return `${minutes} mins`;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) return hours === 1 ? '1 hour' : `${hours} hours`;
  return `${hours}h ${mins}m`;
}

/**
 * Get ETA status color
 */
export function getETAStatusColor(minutes: number): string {
  if (minutes < 5) return 'text-primary'; // Green - arriving soon
  if (minutes < 15) return 'text-accent'; // Yellow - moderate wait
  return 'text-muted-foreground'; // Gray - long wait
}
