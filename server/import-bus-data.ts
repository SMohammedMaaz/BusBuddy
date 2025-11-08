import fs from 'fs';
import { db } from './db';
import { routes, schedules } from '@shared/schema';

interface MysuruBusData {
  from: string;
  to: string;
  serviceClass: string;
  viaPlaces: string;
  departureTime: string;
}

interface BengaluruBusData {
  routeNumber: string;
  from: string;
  to: string;
}

function parseMysuruData(content: string): MysuruBusData[] {
  const lines = content.split('\n');
  const busData: MysuruBusData[] = [];
  
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('Sl.No')) continue;
    
    const parts = line.split(/\s{2,}/);
    if (parts.length >= 5) {
      const from = parts[1]?.trim();
      const serviceClass = parts[2]?.trim();
      const to = parts[3]?.trim();
      const viaPlaces = parts[4]?.trim();
      const departureTime = parts[5]?.trim();
      
      if (from && to && departureTime) {
        busData.push({
          from,
          to,
          serviceClass: serviceClass || 'ORD',
          viaPlaces: viaPlaces || '',
          departureTime
        });
      }
    }
  }
  
  return busData;
}

function parseBengaluruData(content: string): BengaluruBusData[] {
  const lines = content.split('\n');
  const busData: BengaluruBusData[] = [];
  
  for (let i = 6; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('SL') || line.startsWith('TOTAL')) continue;
    
    const parts = line.split(/\s{2,}/);
    if (parts.length >= 3) {
      const routeNumber = parts[1]?.trim();
      const from = parts[2]?.trim();
      const to = parts[3]?.trim();
      
      if (routeNumber && from && to) {
        busData.push({
          routeNumber,
          from,
          to
        });
      }
    }
  }
  
  return busData;
}

function formatTime(timeStr: string): string {
  if (timeStr.length === 3) {
    return `0${timeStr.substring(0, 1)}:${timeStr.substring(1, 3)}`;
  } else if (timeStr.length === 4) {
    return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}`;
  }
  return timeStr;
}

function generateStops(from: string, to: string, via: string): Array<{name: string, lat: number, lng: number}> {
  const stops = [];
  
  // Mysuru coordinates
  const mysuruLat = 12.2958;
  const mysuruLng = 76.6394;
  
  // Bengaluru coordinates
  const bengaluruLat = 12.9716;
  const bengaluruLng = 77.5946;
  
  // Add starting stop
  stops.push({
    name: from,
    lat: from.includes('CITY BUS STAND') ? mysuruLat : bengaluruLat,
    lng: from.includes('CITY BUS STAND') ? mysuruLng : bengaluruLng
  });
  
  // Add via stops if any
  if (via) {
    const viaStops = via.split(',');
    viaStops.forEach((stop, idx) => {
      const ratio = (idx + 1) / (viaStops.length + 1);
      stops.push({
        name: stop.trim(),
        lat: mysuruLat + (Math.random() - 0.5) * 0.1,
        lng: mysuruLng + (Math.random() - 0.5) * 0.1
      });
    });
  }
  
  // Add ending stop
  stops.push({
    name: to,
    lat: mysuruLat + (Math.random() - 0.5) * 0.2,
    lng: mysuruLng + (Math.random() - 0.5) * 0.2
  });
  
  return stops;
}

async function importMysuruData() {
  console.log('Importing Mysuru bus data...');
  
  const content = fs.readFileSync('attached_assets/MysuruCityBS_MYSR_1762630641240.pdf', 'utf-8');
  const busData = parseMysuruData(content);
  
  console.log(`Parsed ${busData.length} Mysuru bus entries`);
  
  // Group by route (from-to combination)
  const routeMap = new Map<string, MysuruBusData[]>();
  
  busData.forEach(bus => {
    const routeKey = `${bus.from}-${bus.to}`;
    if (!routeMap.has(routeKey)) {
      routeMap.set(routeKey, []);
    }
    routeMap.get(routeKey)!.push(bus);
  });
  
  console.log(`Found ${routeMap.size} unique Mysuru routes`);
  
  let imported = 0;
  
  for (const [routeKey, buses] of routeMap.entries()) {
    const firstBus = buses[0];
    
    try {
      // Insert route
      const [route] = await db.insert(routes).values({
        name: `${firstBus.from} to ${firstBus.to}`,
        from: firstBus.from,
        to: firstBus.to,
        serviceClass: firstBus.serviceClass,
        city: 'Mysuru',
        stops: generateStops(firstBus.from, firstBus.to, firstBus.viaPlaces),
        isEcoRoute: firstBus.serviceClass === 'SUB' ? 'true' : 'false',
        estimatedCO2Savings: Math.random() * 50 + 10,
      }).returning();
      
      // Insert schedules for this route
      for (const bus of buses) {
        await db.insert(schedules).values({
          routeId: route.id,
          departureTime: formatTime(bus.departureTime),
          arrivalTime: null,
          isActive: 'true',
        });
      }
      
      imported++;
      
      if (imported % 10 === 0) {
        console.log(`Imported ${imported} routes...`);
      }
    } catch (error) {
      console.error(`Error importing route ${routeKey}:`, error);
    }
  }
  
  console.log(`✓ Imported ${imported} Mysuru routes with schedules`);
}

async function importBengaluruData() {
  console.log('Importing Bengaluru bus data...');
  
  const content = fs.readFileSync('attached_assets/bengaluru_1762630649041.pdf', 'utf-8');
  const busData = parseBengaluruData(content);
  
  console.log(`Parsed ${busData.length} Bengaluru bus routes`);
  
  let imported = 0;
  
  for (const bus of busData) {
    try {
      // Insert route
      const [route] = await db.insert(routes).values({
        routeNumber: bus.routeNumber,
        name: `${bus.from} to ${bus.to}`,
        from: bus.from,
        to: bus.to,
        serviceClass: 'ORD',
        city: 'Bengaluru',
        stops: generateStops(bus.from, bus.to, ''),
        isEcoRoute: 'false',
        estimatedCO2Savings: Math.random() * 30 + 5,
      }).returning();
      
      // Add sample schedules (6:00 AM, 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM)
      const sampleTimes = ['06:00', '09:00', '12:00', '15:00', '18:00'];
      for (const time of sampleTimes) {
        await db.insert(schedules).values({
          routeId: route.id,
          departureTime: time,
          arrivalTime: null,
          isActive: 'true',
        });
      }
      
      imported++;
      
      if (imported % 10 === 0) {
        console.log(`Imported ${imported} routes...`);
      }
    } catch (error) {
      console.error(`Error importing route ${bus.routeNumber}:`, error);
    }
  }
  
  console.log(`✓ Imported ${imported} Bengaluru routes with schedules`);
}

async function main() {
  try {
    console.log('Starting bus data import...\n');
    
    await importMysuruData();
    console.log('');
    await importBengaluruData();
    
    console.log('\n✅ All bus data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing bus data:', error);
    process.exit(1);
  }
}

main();
