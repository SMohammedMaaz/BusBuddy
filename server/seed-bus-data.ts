import { db } from './db';
import { routes, schedules, buses } from '@shared/schema';

// Sample bus data based on Mysuru and Bengaluru routes
const mysuruRoutes = [
  {
    name: 'City Bus Stand to Bannuru',
    from: 'City Bus Stand',
    to: 'Bannuru',
    serviceClass: 'ORD',
    via: 'Mellahalli',
    times: ['06:35', '06:40', '08:00', '08:30', '08:45', '09:00', '09:15', '10:00', '10:15', '10:30']
  },
  {
    name: 'City Bus Stand to BEML Nagara',
    from: 'City Bus Stand',
    to: 'BEML Nagara',
    serviceClass: 'CITY',
    via: 'Ashoka Circle',
    times: ['06:35', '07:15', '07:50', '08:20', '08:45', '09:10', '09:15', '09:25', '09:30', '09:40']
  },
  {
    name: 'City Bus Stand to Belawadi',
    from: 'City Bus Stand',
    to: 'Belawadi',
    serviceClass: 'CITY',
    via: 'Ambedkar Circle',
    times: ['06:30', '07:50', '09:20', '10:55', '14:30', '15:50', '17:35', '18:55', '20:20', '22:00']
  },
  {
    name: 'City Bus Stand to Ambedkar Colony',
    from: 'City Bus Stand',
    to: 'Ambedkar Colony',
    serviceClass: 'CITY',
    via: 'Triveni Circle',
    times: ['06:35', '08:00', '09:05', '10:40', '12:00', '13:25', '15:10', '16:35', '17:40', '19:15']
  },
  {
    name: 'City Bus Stand to KRS',
    from: 'City Bus Stand',
    to: 'KRS Dam',
    serviceClass: 'ORD',
    via: 'Barath Cancer Hospital',
    times: ['07:10', '09:30', '12:00', '14:30', '16:50', '18:15']
  },
];

const bengaluruRoutes = [
  {
    routeNumber: '13',
    name: 'Shivajinagara to Banashankari',
    from: 'Shivajinagara Bus Station',
    to: 'Banashankari TTMC',
    times: ['06:00', '07:30', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00']
  },
  {
    routeNumber: '25A',
    name: 'Kempegowda to BTM Layout',
    from: 'Kempegowda Bus Station',
    to: 'BTM Layout',
    times: ['06:15', '07:45', '09:15', '11:15', '13:15', '15:15', '17:15', '19:15']
  },
  {
    routeNumber: '96',
    name: 'Kempegowda Circular',
    from: 'Kempegowda Bus Station',
    to: 'Kempegowda Bus Station',
    times: ['06:30', '08:00', '09:30', '11:30', '13:30', '15:30', '17:30', '19:30']
  },
  {
    routeNumber: '500A',
    name: 'Banashankari to Hebbal',
    from: 'Banashankari TTMC',
    to: 'Hebbal',
    times: ['06:00', '07:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
  },
  {
    routeNumber: 'KIA9',
    name: 'Kempegowda to Airport',
    from: 'Kempegowda Bus Station',
    to: 'Kempegowda International Airport',
    times: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
  },
];

function generateStops(from: string, to: string, via: string, city: 'Mysuru' | 'Bengaluru'): Array<{name: string, lat: number, lng: number}> {
  const stops = [];
  
  // Base coordinates
  const coords = city === 'Mysuru' 
    ? { lat: 12.2958, lng: 76.6394 }
    : { lat: 12.9716, lng: 77.5946 };
  
  // Starting stop
  stops.push({
    name: from,
    lat: coords.lat,
    lng: coords.lng
  });
  
  // Via stops
  if (via) {
    const viaStops = via.split(',').map(s => s.trim());
    viaStops.forEach((stop, idx) => {
      const ratio = (idx + 1) / (viaStops.length + 1);
      stops.push({
        name: stop,
        lat: coords.lat + (Math.random() - 0.5) * 0.05,
        lng: coords.lng + (Math.random() - 0.5) * 0.05
      });
    });
  }
  
  // Ending stop
  stops.push({
    name: to,
    lat: coords.lat + (Math.random() - 0.5) * 0.1,
    lng: coords.lng + (Math.random() - 0.5) * 0.1
  });
  
  return stops;
}

async function seedMysuruRoutes() {
  console.log('Seeding Mysuru routes...');
  
  for (const route of mysuruRoutes) {
    try {
      const [insertedRoute] = await db.insert(routes).values({
        name: route.name,
        from: route.from,
        to: route.to,
        serviceClass: route.serviceClass,
        city: 'Mysuru',
        stops: generateStops(route.from, route.to, route.via, 'Mysuru'),
        isEcoRoute: route.serviceClass === 'SUB' ? 'true' : 'false',
        estimatedCO2Savings: Math.random() * 50 + 10,
      }).returning();
      
      // Add schedules
      for (const time of route.times) {
        await db.insert(schedules).values({
          routeId: insertedRoute.id,
          departureTime: time,
          isActive: 'true',
        });
      }
      
      console.log(`✓ ${route.name} (${route.times.length} schedules)`);
    } catch (error) {
      console.error(`Error seeding ${route.name}:`, error);
    }
  }
}

async function seedBengaluruRoutes() {
  console.log('\nSeeding Bengaluru routes...');
  
  for (const route of bengaluruRoutes) {
    try {
      const [insertedRoute] = await db.insert(routes).values({
        routeNumber: route.routeNumber,
        name: route.name,
        from: route.from,
        to: route.to,
        serviceClass: 'ORD',
        city: 'Bengaluru',
        stops: generateStops(route.from, route.to, '', 'Bengaluru'),
        isEcoRoute: 'false',
        estimatedCO2Savings: Math.random() * 30 + 5,
      }).returning();
      
      // Add schedules
      for (const time of route.times) {
        await db.insert(schedules).values({
          routeId: insertedRoute.id,
          departureTime: time,
          isActive: 'true',
        });
      }
      
      console.log(`✓ Route ${route.routeNumber}: ${route.name} (${route.times.length} schedules)`);
    } catch (error) {
      console.error(`Error seeding route ${route.routeNumber}:`, error);
    }
  }
}

async function seedBuses() {
  console.log('\nSeeding active buses...');
  
  // Get all routes
  const allRoutes = await db.select().from(routes);
  
  // Create 10 buses on random routes
  const busNumbers = ['KA-09-A-1234', 'KA-09-B-5678', 'KA-09-C-9012', 'KA-09-D-3456', 'KA-09-E-7890',
                      'KA-05-F-1111', 'KA-05-G-2222', 'KA-05-H-3333', 'KA-05-I-4444', 'KA-05-J-5555'];
  
  for (let i = 0; i < 10; i++) {
    const randomRoute = allRoutes[Math.floor(Math.random() * allRoutes.length)];
    const coords = randomRoute.city === 'Mysuru' 
      ? { lat: 12.2958, lng: 76.6394 }
      : { lat: 12.9716, lng: 77.5946 };
    
    try {
      await db.insert(buses).values({
        busNumber: busNumbers[i],
        routeName: randomRoute.name,
        latitude: coords.lat + (Math.random() - 0.5) * 0.05,
        longitude: coords.lng + (Math.random() - 0.5) * 0.05,
        status: 'active',
        currentSpeed: Math.random() * 30 + 15,
        occupancy: Math.floor(Math.random() * 60) + 10,
      });
      
      console.log(`✓ Bus ${busNumbers[i]} on ${randomRoute.name}`);
    } catch (error) {
      console.error(`Error seeding bus ${busNumbers[i]}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('🚌 Starting BusBuddy data seeding...\n');
    
    await seedMysuruRoutes();
    await seedBengaluruRoutes();
    await seedBuses();
    
    console.log('\n✅ All bus data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

main();
