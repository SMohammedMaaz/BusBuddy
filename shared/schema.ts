import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("passenger"),
  ecoPoints: integer("eco_points").notNull().default(0),
  favoriteStops: jsonb("favorite_stops").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const buses = pgTable("buses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  busNumber: text("bus_number").notNull().unique(),
  routeName: text("route_name").notNull(),
  driverId: varchar("driver_id").references(() => users.id),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  status: text("status").notNull().default("active"),
  currentSpeed: real("current_speed").notNull().default(0),
  occupancy: integer("occupancy").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  stops: jsonb("stops").$type<Array<{name: string, lat: number, lng: number}>>().notNull(),
  isEcoRoute: text("is_eco_route").notNull().default("false"),
  estimatedCO2Savings: real("estimated_co2_savings").notNull().default(0),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull().defaultNow(),
  totalCO2Saved: real("total_co2_saved").notNull().default(0),
  totalFuelSaved: real("total_fuel_saved").notNull().default(0),
  totalTrips: integer("total_trips").notNull().default(0),
  avgBusSpeed: real("avg_bus_speed").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertBusSchema = createInsertSchema(buses).omit({
  id: true,
  lastUpdated: true,
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBus = z.infer<typeof insertBusSchema>;
export type Bus = typeof buses.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
