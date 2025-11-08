import { 
  type User, 
  type InsertUser, 
  type Bus, 
  type InsertBus, 
  type Analytics, 
  type InsertAnalytics,
  type Route,
  type InsertRoute
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private buses: Map<string, Bus>;
  private routes: Map<string, Route>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.users = new Map();
    this.buses = new Map();
    this.routes = new Map();
    this.analytics = new Map();
    
    this.seedData();
  }

  private seedData() {
    const today = new Date();
    const analyticsId = randomUUID();
    this.analytics.set(analyticsId, {
      id: analyticsId,
      date: today,
      totalCO2Saved: 125.6,
      totalFuelSaved: 45.2,
      totalTrips: 342,
      avgBusSpeed: 32.5,
    });

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const id = randomUUID();
      this.analytics.set(id, {
        id,
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

    sampleBuses.forEach((bus, index) => {
      const id = randomUUID();
      this.buses.set(id, {
        id,
        busNumber: bus.busNumber,
        routeName: bus.routeName,
        driverId: null,
        latitude: bus.lat,
        longitude: bus.lng,
        status: index === 0 ? "active" : index === 3 ? "idle" : "active",
        currentSpeed: bus.speed,
        occupancy: 40 + Math.floor(Math.random() * 50),
        lastUpdated: new Date(),
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserEcoPoints(id: string, points: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.ecoPoints = points;
      this.users.set(id, user);
    }
  }

  async getAllBuses(): Promise<Bus[]> {
    return Array.from(this.buses.values());
  }

  async getBus(id: string): Promise<Bus | undefined> {
    return this.buses.get(id);
  }

  async createBus(insertBus: InsertBus): Promise<Bus> {
    const id = randomUUID();
    const bus: Bus = { 
      ...insertBus, 
      id,
      lastUpdated: new Date(),
    };
    this.buses.set(id, bus);
    return bus;
  }

  async updateBusLocation(id: string, latitude: number, longitude: number, speed: number): Promise<void> {
    const bus = this.buses.get(id);
    if (bus) {
      bus.latitude = latitude;
      bus.longitude = longitude;
      bus.currentSpeed = speed;
      bus.lastUpdated = new Date();
      this.buses.set(id, bus);
    }
  }

  async getAllRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = { ...insertRoute, id };
    this.routes.set(id, route);
    return route;
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    );
  }

  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const all = await this.getAllAnalytics();
    return all[all.length - 1];
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = { ...insertAnalytics, id };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async updateAnalytics(id: string, data: Partial<Analytics>): Promise<void> {
    const analytics = this.analytics.get(id);
    if (analytics) {
      Object.assign(analytics, data);
      this.analytics.set(id, analytics);
    }
  }
}

export const storage = new MemStorage();
