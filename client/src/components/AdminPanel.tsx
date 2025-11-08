import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, TrendingUp, Users, Truck } from "lucide-react";
import type { Bus, Analytics } from "@shared/schema";

interface AdminPanelProps {
  buses: Bus[];
  analytics: Analytics[];
  totalUsers: number;
}

export function AdminPanel({ buses, analytics, totalUsers }: AdminPanelProps) {
  const activeBuses = buses.filter(b => b.status === "active").length;
  const latestAnalytics = analytics[analytics.length - 1] || {
    totalCO2Saved: 0,
    totalTrips: 0,
    avgBusSpeed: 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <Truck className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBuses}/{buses.length}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips Today</CardTitle>
            <Activity className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestAnalytics.totalTrips}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Speed</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestAnalytics.avgBusSpeed.toFixed(1)} km/h</div>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20">
        <CardHeader>
          <CardTitle>Fleet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus Number</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Driver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id} data-testid={`row-bus-${bus.id}`}>
                  <TableCell className="font-medium">{bus.busNumber}</TableCell>
                  <TableCell>{bus.routeName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(bus.status)}`} />
                      <Badge variant="outline">{bus.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{bus.currentSpeed.toFixed(1)} km/h</TableCell>
                  <TableCell>{bus.occupancy}%</TableCell>
                  <TableCell className="text-muted-foreground">
                    {bus.driverId ? `Driver-${bus.driverId.slice(0, 6)}` : "Unassigned"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
