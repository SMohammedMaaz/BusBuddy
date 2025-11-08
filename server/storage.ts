import { 
  type User, 
  type InsertUser, 
  type Bus, 
  type InsertBus, 
  type Analytics, 
  type InsertAnalytics,
  type Route,
  type InsertRoute,
  type BusCompliance,
  type InsertBusCompliance,
  type ProximityAlert,
  type InsertProximityAlert,
  users,
  buses,
  routes,
  analytics,
  busCompliance,
  proximityAlerts
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserEcoPoints(id: string, points: number): Promise<void>;
  
  getAllBuses(): Promise<Bus[]>;
  getBus(id: string): Promise<Bus | undefined>;
  createBus(bus: InsertBus): Promise<Bus>;
  updateBusLocation(id: string, latitude: number, longitude: number, speed: number): Promise<void>;
  
  getAllRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  getAllAnalytics(): Promise<Analytics[]>;
  getLatestAnalytics(): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: string, data: Partial<Analytics>): Promise<void>;
  
  getAllCompliance(): Promise<BusCompliance[]>;
  getComplianceByBusId(busId: string): Promise<BusCompliance | undefined>;
  createCompliance(compliance: InsertBusCompliance): Promise<BusCompliance>;
  updateCompliance(id: string, data: Partial<BusCompliance>): Promise<void>;
  
  getProximityAlerts(userId: string): Promise<ProximityAlert[]>;
  getProximityAlertByUserAndBus(userId: string, busId: string): Promise<ProximityAlert | undefined>;
  createProximityAlert(alert: InsertProximityAlert): Promise<ProximityAlert>;
  deleteProximityAlert(id: string): Promise<void>;
  updateProximityAlert(id: string, data: Partial<ProximityAlert>): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserEcoPoints(id: string, points: number): Promise<void> {
    await db.update(users).set({ ecoPoints: points }).where(eq(users.id, id));
  }

  async getAllBuses(): Promise<Bus[]> {
    return await db.select().from(buses);
  }

  async getBus(id: string): Promise<Bus | undefined> {
    const result = await db.select().from(buses).where(eq(buses.id, id)).limit(1);
    return result[0];
  }

  async createBus(insertBus: InsertBus): Promise<Bus> {
    const result = await db.insert(buses).values(insertBus).returning();
    return result[0];
  }

  async updateBusLocation(id: string, latitude: number, longitude: number, speed: number): Promise<void> {
    await db.update(buses)
      .set({ 
        latitude, 
        longitude, 
        currentSpeed: speed,
        lastUpdated: new Date()
      })
      .where(eq(buses.id, id));
  }

  async getAllRoutes(): Promise<Route[]> {
    return await db.select().from(routes);
  }

  async getRoute(id: string): Promise<Route | undefined> {
    const result = await db.select().from(routes).where(eq(routes.id, id)).limit(1);
    return result[0];
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const result = await db.insert(routes).values(insertRoute).returning();
    return result[0];
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics).orderBy(analytics.date);
  }

  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const result = await db.select().from(analytics).orderBy(desc(analytics.date)).limit(1);
    return result[0];
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const result = await db.insert(analytics).values(insertAnalytics).returning();
    return result[0];
  }

  async updateAnalytics(id: string, data: Partial<Analytics>): Promise<void> {
    await db.update(analytics).set(data).where(eq(analytics.id, id));
  }

  async getAllCompliance(): Promise<BusCompliance[]> {
    return await db.select().from(busCompliance);
  }

  async getComplianceByBusId(busId: string): Promise<BusCompliance | undefined> {
    const result = await db.select().from(busCompliance).where(eq(busCompliance.busId, busId)).limit(1);
    return result[0];
  }

  async createCompliance(insertCompliance: InsertBusCompliance): Promise<BusCompliance> {
    const result = await db.insert(busCompliance).values(insertCompliance).returning();
    return result[0];
  }

  async updateCompliance(id: string, data: Partial<BusCompliance>): Promise<void> {
    await db.update(busCompliance).set(data).where(eq(busCompliance.id, id));
  }

  async getProximityAlerts(userId: string): Promise<ProximityAlert[]> {
    return await db.select().from(proximityAlerts).where(eq(proximityAlerts.userId, userId));
  }

  async getProximityAlertByUserAndBus(userId: string, busId: string): Promise<ProximityAlert | undefined> {
    const result = await db.select().from(proximityAlerts)
      .where(and(
        eq(proximityAlerts.userId, userId),
        eq(proximityAlerts.busId, busId)
      ))
      .limit(1);
    return result[0];
  }

  async createProximityAlert(insertAlert: InsertProximityAlert): Promise<ProximityAlert> {
    const result = await db.insert(proximityAlerts).values(insertAlert).returning();
    return result[0];
  }

  async deleteProximityAlert(id: string): Promise<void> {
    await db.delete(proximityAlerts).where(eq(proximityAlerts.id, id));
  }

  async updateProximityAlert(id: string, data: Partial<ProximityAlert>): Promise<void> {
    await db.update(proximityAlerts).set(data).where(eq(proximityAlerts.id, id));
  }
}

export const storage = new DbStorage();

export async function seedDatabase() {
  const existingBuses = await storage.getAllBuses();
  if (existingBuses.length > 0) {
    return;
  }

  const today = new Date();
  
  await storage.createAnalytics({
    date: today,
    totalCO2Saved: 125.6,
    totalFuelSaved: 45.2,
    totalTrips: 342,
    avgBusSpeed: 32.5,
  });

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    await storage.createAnalytics({
      date,
      totalCO2Saved: 100 + Math.random() * 50,
      totalFuelSaved: 35 + Math.random() * 20,
      totalTrips: 300 + Math.floor(Math.random() * 100),
      avgBusSpeed: 28 + Math.random() * 8,
    });
  }

  const sampleBuses = [
    { busNumber: "94", routeName: "Green Line North", lat: 40.7580, lng: -73.9855, speed: 28 },
    { busNumber: "42", routeName: "Blue Line East", lat: 40.7489, lng: -73.9680, speed: 32 },
    { busNumber: "18", routeName: "Red Line South", lat: 40.7128, lng: -74.0060, speed: 25 },
    { busNumber: "67", routeName: "Yellow Line West", lat: 40.7282, lng: -73.7949, speed: 30 },
    { busNumber: "101", routeName: "Express Downtown", lat: 40.7614, lng: -73.9776, speed: 35 },
  ];

  for (const [index, bus] of sampleBuses.entries()) {
    await storage.createBus({
      busNumber: bus.busNumber,
      routeName: bus.routeName,
      driverId: null,
      latitude: bus.lat,
      longitude: bus.lng,
      status: index === 0 ? "active" : index === 3 ? "idle" : "active",
      currentSpeed: bus.speed,
      occupancy: 40 + Math.floor(Math.random() * 50),
    });
  }

  console.log("✅ Database seeded successfully");
}
