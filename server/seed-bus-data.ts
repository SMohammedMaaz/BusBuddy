import { db } from './db';
import { routes, schedules, buses } from '@shared/schema';

// Real Mysuru bus data
const mysuruBusData = [
  {
    busNo: "MYS101",
    routeName: "City Bus Stand → Chamundi Hill",
    from: "City Bus Stand",
    to: "Chamundi Hill",
    via: ["Race Course", "Nanjumalige", "Hill Base"],
    departureTime: "07:00",
    gps: { lat: 12.2987, lng: 76.6575 },
    currentStatus: "active"
  },
  {
    busNo: "MYS102",
    routeName: "City Bus Stand → Bannur",
    from: "City Bus Stand",
    to: "Bannur",
    via: ["Mullahalli", "Kadakola"],
    departureTime: "07:45",
    gps: { lat: 12.2679, lng: 76.7463 },
    currentStatus: "active"
  },
  {
    busNo: "MYS103",
    routeName: "City Bus Stand → Bogadi 2nd Stage",
    from: "City Bus Stand",
    to: "Bogadi 2nd Stage",
    via: ["Akashvani", "Kuvempunagar", "Hebbal"],
    departureTime: "08:30",
    gps: { lat: 12.3091, lng: 76.6205 },
    currentStatus: "active"
  },
  {
    busNo: "MYS104",
    routeName: "City Bus Stand → Srirampura",
    from: "City Bus Stand",
    to: "Srirampura",
    via: ["Vivekananda Circle", "Jayalakshmipuram"],
    departureTime: "09:15",
    gps: { lat: 12.3274, lng: 76.6398 },
    currentStatus: "active"
  },
  {
    busNo: "MYS105",
    routeName: "City Bus Stand → KRS",
    from: "City Bus Stand",
    to: "Krishna Raja Sagar (KRS)",
    via: ["Metagalli", "Koorgalli", "Brindavan Gardens"],
    departureTime: "10:00",
    gps: { lat: 12.4246, lng: 76.5681 },
    currentStatus: "inactive"
  }
];

// Real Bengaluru bus data
const bengaluruBusData = [
  {
    busNo: "BLR13",
    routeName: "Shivajinagar → Banashankari TTMC",
    from: "Shivajinagar Bus Station",
    to: "Banashankari TTMC",
    via: ["Richmond Circle", "Lalbagh", "Jayanagar 4th Block"],
    departureTime: "06:45",
    gps: { lat: 12.9374, lng: 77.5868 },
    currentStatus: "active"
  },
  {
    busNo: "BLR61",
    routeName: "Majestic → Vijayanagar TTMC",
    from: "Kempegowda Bus Station (Majestic)",
    to: "Vijayanagar TTMC",
    via: ["Corporation Circle", "Hosahalli", "Maruthi Mandir"],
    departureTime: "07:20",
    gps: { lat: 12.9716, lng: 77.5545 },
    currentStatus: "active"
  },
  {
    busNo: "BLR171",
    routeName: "Majestic → Koramangala 1st Block",
    from: "Majestic",
    to: "Koramangala 1st Block",
    via: ["Richmond Circle", "Adugodi", "Forum Mall"],
    departureTime: "08:10",
    gps: { lat: 12.9361, lng: 77.6129 },
    currentStatus: "active"
  },
  {
    busNo: "BLR333E",
    routeName: "Majestic → Kadugodi (Whitefield)",
    from: "Majestic",
    to: "Kadugodi",
    via: ["Indiranagar", "KR Puram", "Whitefield"],
    departureTime: "09:00",
    gps: { lat: 12.9859, lng: 77.7326 },
    currentStatus: "active"
  },
  {
    busNo: "BLR365J",
    routeName: "Majestic → Jigani APC Circle",
    from: "Majestic",
    to: "Jigani APC Circle",
    via: ["BTM", "Electronic City", "Bommasandra"],
    departureTime: "09:40",
    gps: { lat: 12.8221, lng: 77.6764 },
    currentStatus: "active"
  }
];

// Helper to generate stop coordinates along a route
function generateStops(from: string, to: string, via: string[], startLat: number, startLng: number, endLat: number, endLng: number) {
  const stops = [{ name: from, lat: startLat, lng: startLng }];
  
  // Generate intermediate stops
  const totalStops = via.length + 2; // from + via + to
  for (let i = 0; i < via.length; i++) {
    const ratio = (i + 1) / (totalStops - 1);
    const lat = startLat + (endLat - startLat) * ratio;
    const lng = startLng + (endLng - startLng) * ratio;
    stops.push({ name: via[i], lat, lng });
  }
  
  stops.push({ name: to, lat: endLat, lng: endLng });
  return stops;
}

// Helper to generate multiple schedules throughout the day
function generateSchedules(baseTime: string): string[] {
  const times = [baseTime];
  const [hours, minutes] = baseTime.split(':').map(Number);
  
  // Generate 6-8 schedules throughout the day
  for (let i = 1; i < 7; i++) {
    const newHour = (hours + i * 2) % 24;
    const newTime = `${newHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    times.push(newTime);
  }
  
  return times;
}

export async function seedBusData() {
  console.log('🌱 Starting database seeding with real Karnataka bus data...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.delete(schedules);
    await db.delete(buses);
    await db.delete(routes);

    const insertedRoutes: any[] = [];
    
    // Seed Mysuru routes and buses
    console.log('🚌 Seeding Mysuru routes and buses...');
    for (const busData of mysuruBusData) {
      // Estimate end coordinates (slight variation from start)
      const endLat = busData.gps.lat + (Math.random() * 0.1 - 0.05);
      const endLng = busData.gps.lng + (Math.random() * 0.1 - 0.05);
      
      const stops = generateStops(
        busData.from,
        busData.to,
        busData.via,
        busData.gps.lat,
        busData.gps.lng,
        endLat,
        endLng
      );

      // Insert route
      const [route] = await db.insert(routes).values({
        routeNumber: busData.busNo,
        name: busData.routeName,
        from: busData.from,
        to: busData.to,
        serviceClass: 'ORD',
        city: 'Mysuru',
        stops: stops,
        isEcoRoute: Math.random() > 0.5 ? 'true' : 'false',
        estimatedCO2Savings: Math.random() * 50 + 20,
      }).returning();

      insertedRoutes.push(route);

      // Insert bus
      await db.insert(buses).values({
        busNumber: busData.busNo,
        routeName: busData.routeName,
        latitude: busData.gps.lat,
        longitude: busData.gps.lng,
        status: busData.currentStatus,
        currentSpeed: busData.currentStatus === 'active' ? Math.floor(Math.random() * 30) + 20 : 0,
        occupancy: busData.currentStatus === 'active' ? Math.floor(Math.random() * 40) + 10 : 0,
      });

      // Insert schedules
      const scheduleTimes = generateSchedules(busData.departureTime);
      for (const time of scheduleTimes) {
        await db.insert(schedules).values({
          routeId: route.id,
          departureTime: time,
          isActive: 'true',
        });
      }
    }

    // Seed Bengaluru routes and buses
    console.log('🚌 Seeding Bengaluru routes and buses...');
    for (const busData of bengaluruBusData) {
      // Estimate end coordinates (slight variation from start)
      const endLat = busData.gps.lat + (Math.random() * 0.1 - 0.05);
      const endLng = busData.gps.lng + (Math.random() * 0.1 - 0.05);
      
      const stops = generateStops(
        busData.from,
        busData.to,
        busData.via,
        busData.gps.lat,
        busData.gps.lng,
        endLat,
        endLng
      );

      // Insert route
      const [route] = await db.insert(routes).values({
        routeNumber: busData.busNo,
        name: busData.routeName,
        from: busData.from,
        to: busData.to,
        serviceClass: 'CITY',
        city: 'Bengaluru',
        stops: stops,
        isEcoRoute: Math.random() > 0.5 ? 'true' : 'false',
        estimatedCO2Savings: Math.random() * 80 + 30,
      }).returning();

      insertedRoutes.push(route);

      // Insert bus
      await db.insert(buses).values({
        busNumber: busData.busNo,
        routeName: busData.routeName,
        latitude: busData.gps.lat,
        longitude: busData.gps.lng,
        status: busData.currentStatus,
        currentSpeed: busData.currentStatus === 'active' ? Math.floor(Math.random() * 40) + 25 : 0,
        occupancy: busData.currentStatus === 'active' ? Math.floor(Math.random() * 50) + 15 : 0,
      });

      // Insert schedules
      const scheduleTimes = generateSchedules(busData.departureTime);
      for (const time of scheduleTimes) {
        await db.insert(schedules).values({
          routeId: route.id,
          departureTime: time,
          isActive: 'true',
        });
      }
    }

    // Summary
    const totalBuses = await db.select().from(buses);
    const totalRoutes = await db.select().from(routes);
    const totalSchedules = await db.select().from(schedules);

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Routes: ${totalRoutes.length} (${mysuruBusData.length} Mysuru + ${bengaluruBusData.length} Bengaluru)`);
    console.log(`   - Buses: ${totalBuses.length}`);
    console.log(`   - Schedules: ${totalSchedules.length}`);
    console.log(`   - Cities: Mysuru, Bengaluru`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedBusData()
    .then(() => {
      console.log('✨ Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}
