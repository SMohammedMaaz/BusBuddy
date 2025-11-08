import { storage } from "./storage";

function getRandomOffset(max: number = 0.002): number {
  return (Math.random() - 0.5) * max;
}

export function startBusSimulator() {
  let updateCount = 0;
  
  setInterval(async () => {
    try {
      const buses = await storage.getAllBuses();
      let activeBusesUpdated = 0;
      
      for (const bus of buses) {
        if (bus.status === "active") {
          const newLat = bus.latitude + getRandomOffset();
          const newLng = bus.longitude + getRandomOffset();
          const speedVariation = (Math.random() - 0.5) * 10;
          const newSpeed = Math.max(15, Math.min(45, (bus.currentSpeed || 30) + speedVariation));
          
          await storage.updateBusLocation(
            bus.id.toString(),
            newLat,
            newLng,
            Math.round(newSpeed)
          );
          activeBusesUpdated++;
        }
      }
      
      updateCount++;
      if (updateCount % 10 === 0) {
        console.log(`🚌 Simulator update #${updateCount}: ${activeBusesUpdated} active buses updated`);
      }
    } catch (error) {
      console.error("Bus simulation error:", error);
    }
  }, 3000);
  
  console.log("🚌 Bus location simulator started (updates every 3s)");
}
