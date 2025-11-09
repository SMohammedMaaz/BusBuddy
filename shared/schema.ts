import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("passenger"),
  vehicleNumber: text("vehicle_number"),
  drivingLicense: text("driving_license"),
  assignedRoute: text("assigned_route"),
  ecoPoints: integer("eco_points").notNull().default(0),
  ecoScore: integer("eco_score").notNull().default(0),
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
  routeNumber: text("route_number"),
  name: text("name").notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  serviceClass: text("service_class"),
  city: text("city").notNull().default("Mysuru"),
  stops: jsonb("stops").$type<Array<{name: string, lat: number, lng: number}>>().notNull(),
  isEcoRoute: text("is_eco_route").notNull().default("false"),
  estimatedCO2Savings: real("estimated_co2_savings").notNull().default(0),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").references(() => routes.id).notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time"),
  daysOfWeek: jsonb("days_of_week").$type<string[]>().default(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
  isActive: text("is_active").notNull().default("true"),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull().defaultNow(),
  totalCO2Saved: real("total_co2_saved").notNull().default(0),
  totalFuelSaved: real("total_fuel_saved").notNull().default(0),
  totalTrips: integer("total_trips").notNull().default(0),
  avgBusSpeed: real("avg_bus_speed").notNull().default(0),
});

export const busCompliance = pgTable("bus_compliance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  busId: varchar("bus_id").references(() => buses.id).notNull(),
  pollutionCertExpiry: timestamp("pollution_cert_expiry"),
  fitnessCertExpiry: timestamp("fitness_cert_expiry"),
  pollutionCertUrl: text("pollution_cert_url"),
  fitnessCertUrl: text("fitness_cert_url"),
  complianceStatus: text("compliance_status").notNull().default("unknown"),
  lastChecked: timestamp("last_checked").notNull().defaultNow(),
});

export const proximityAlerts = pgTable("proximity_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  busId: varchar("bus_id").references(() => buses.id).notNull(),
  alertDistance: real("alert_distance").notNull().default(1.0),
  isActive: text("is_active").notNull().default("true"),
  lastAlertSent: timestamp("last_alert_sent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).notNull(),
  vehicleNumber: text("vehicle_number").notNull(),
  pucValid: timestamp("puc_valid"),
  fitnessValid: timestamp("fitness_valid"),
  dlValid: timestamp("dl_valid"),
  rcValid: timestamp("rc_valid"),
  pucUrl: text("puc_url"),
  fitnessUrl: text("fitness_url"),
  dlUrl: text("dl_url"),
  rcUrl: text("rc_url"),
  validationStatus: text("validation_status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sosAlerts = pgTable("sos_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  senderRole: text("sender_role").notNull(),
  vehicleNumber: text("vehicle_number"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  message: text("message"),
  resolved: text("resolved").notNull().default("false"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ecoStats = pgTable("eco_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull().defaultNow(),
  fuelSaved: real("fuel_saved").notNull().default(0),
  co2Saved: real("co2_saved").notNull().default(0),
  avgDelay: real("avg_delay").notNull().default(0),
  totalTrips: integer("total_trips").notNull().default(0),
  city: text("city").notNull().default("Mysuru"),
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

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

export const insertBusComplianceSchema = createInsertSchema(busCompliance).omit({
  id: true,
  lastChecked: true,
});

export const insertProximityAlertSchema = createInsertSchema(proximityAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertSosAlertSchema = createInsertSchema(sosAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertEcoStatsSchema = createInsertSchema(ecoStats).omit({
  id: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBus = z.infer<typeof insertBusSchema>;
export type Bus = typeof buses.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertBusCompliance = z.infer<typeof insertBusComplianceSchema>;
export type BusCompliance = typeof busCompliance.$inferSelect;
export type InsertProximityAlert = z.infer<typeof insertProximityAlertSchema>;
export type ProximityAlert = typeof proximityAlerts.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertSosAlert = z.infer<typeof insertSosAlertSchema>;
export type SosAlert = typeof sosAlerts.$inferSelect;
export type InsertEcoStats = z.infer<typeof insertEcoStatsSchema>;
export type EcoStats = typeof ecoStats.$inferSelect;
