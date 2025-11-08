import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBusSchema, insertUserSchema, insertAnalyticsSchema, insertRouteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/buses", async (_req, res) => {
    try {
      const buses = await storage.getAllBuses();
      res.json(buses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch buses" });
    }
  });

  app.get("/api/buses/:id", async (req, res) => {
    try {
      const bus = await storage.getBus(req.params.id);
      if (!bus) {
        return res.status(404).json({ error: "Bus not found" });
      }
      res.json(bus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bus" });
    }
  });

  app.post("/api/buses", async (req, res) => {
    try {
      const validatedData = insertBusSchema.parse(req.body);
      const bus = await storage.createBus(validatedData);
      res.status(201).json(bus);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create bus" });
    }
  });

  app.patch("/api/buses/:id/location", async (req, res) => {
    try {
      const { latitude, longitude, speed } = req.body;
      
      if (typeof latitude !== "number" || typeof longitude !== "number" || typeof speed !== "number") {
        return res.status(400).json({ error: "Invalid location data" });
      }

      await storage.updateBusLocation(req.params.id, latitude, longitude, speed);
      const updatedBus = await storage.getBus(req.params.id);
      res.json(updatedBus);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bus location" });
    }
  });

  app.get("/api/users/:firebaseUid", async (req, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.params.firebaseUid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByFirebaseUid(validatedData.firebaseUid);
      
      if (existingUser) {
        return res.json(existingUser);
      }

      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id/eco-points", async (req, res) => {
    try {
      const { points } = req.body;
      
      if (typeof points !== "number") {
        return res.status(400).json({ error: "Invalid eco points value" });
      }

      await storage.updateUserEcoPoints(req.params.id, points);
      const user = await storage.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update eco points" });
    }
  });

  app.get("/api/analytics", async (_req, res) => {
    try {
      const analytics = await storage.getAllAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/latest", async (_req, res) => {
    try {
      const analytics = await storage.getLatestAnalytics();
      if (!analytics) {
        return res.status(404).json({ error: "No analytics found" });
      }
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest analytics" });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const validatedData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalytics(validatedData);
      res.status(201).json(analytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create analytics" });
    }
  });

  app.get("/api/routes", async (_req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  app.post("/api/routes", async (req, res) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(validatedData);
      res.status(201).json(route);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create route" });
    }
  });

  app.post("/api/eta/calculate", async (req, res) => {
    try {
      const { busId, destinationLat, destinationLng } = req.body;
      
      const bus = await storage.getBus(busId);
      if (!bus) {
        return res.status(404).json({ error: "Bus not found" });
      }

      const R = 6371;
      const dLat = (destinationLat - bus.latitude) * Math.PI / 180;
      const dLon = (destinationLng - bus.longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(bus.latitude * Math.PI / 180) * Math.cos(destinationLat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      const speed = bus.currentSpeed || 30;
      const eta = (distance / speed) * 60;

      res.json({
        eta: Math.round(eta),
        distance: distance.toFixed(2),
        busSpeed: speed,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate ETA" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
