import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Bus, BusCompliance } from "@shared/schema";

interface BusCompliancePanelProps {
  buses: Bus[];
}

export function BusCompliancePanel({ buses }: BusCompliancePanelProps) {
  const { data: complianceData = [], isError: isComplianceError } = useQuery<BusCompliance[]>({
    queryKey: ["/api/compliance"],
    refetchInterval: 30000,
  });

  const getComplianceStatus = (bus: Bus) => {
    const compliance = complianceData.find(c => c.busId === bus.id);
    if (!compliance) return { status: "unknown", label: "No Data", icon: AlertTriangle, color: "text-gray-500" };

    const now = new Date();
    const pollutionExpiry = compliance.pollutionCertExpiry ? new Date(compliance.pollutionCertExpiry) : null;
    const fitnessExpiry = compliance.fitnessCertExpiry ? new Date(compliance.fitnessCertExpiry) : null;

    const pollutionDaysLeft = pollutionExpiry ? Math.floor((pollutionExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
    const fitnessDaysLeft = fitnessExpiry ? Math.floor((fitnessExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

    if ((pollutionDaysLeft !== null && pollutionDaysLeft < 0) || (fitnessDaysLeft !== null && fitnessDaysLeft < 0)) {
      return { status: "expired", label: "Expired", icon: AlertTriangle, color: "text-red-500", compliance };
    }

    if ((pollutionDaysLeft !== null && pollutionDaysLeft < 15) || (fitnessDaysLeft !== null && fitnessDaysLeft < 15)) {
      return { status: "expiring", label: "Expiring Soon", icon: Clock, color: "text-yellow-500", compliance };
    }

    return { status: "valid", label: "Valid", icon: CheckCircle2, color: "text-green-500", compliance };
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-strong border-purple-500/30" data-testid="card-compliance-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-500" />
              <span>Bus Documentation & Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Error State */}
            {isComplianceError && (
              <div className="text-center py-4 text-destructive mb-4">
                <p className="text-sm">Failed to load compliance data. Please try again later.</p>
              </div>
            )}

            <div className="space-y-3">
              {buses.map((bus, index) => {
                const { status, label, icon: Icon, color, compliance } = getComplianceStatus(bus);
                
                return (
                  <motion.div
                    key={bus.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    data-testid={`compliance-row-${bus.busNumber}`}
                  >
                    <Card className="glass hover-elevate active-elevate-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold" data-testid={`bus-number-${bus.busNumber}`}>
                                Bus #{bus.busNumber}
                              </h4>
                              <Badge variant={status === "valid" ? "default" : status === "expiring" ? "secondary" : "destructive"} data-testid={`status-${bus.busNumber}`}>
                                <Icon className="w-3 h-3 mr-1" />
                                {label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{bus.routeName}</p>
                            
                            {compliance && (
                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-blue-500" />
                                  <span>Pollution: {formatDate(compliance.pollutionCertExpiry)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-green-500" />
                                  <span>Fitness: {formatDate(compliance.fitnessCertExpiry)}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {status === "expired" || status === "expiring" ? (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                  data-testid={`button-renew-${bus.busNumber}`}
                                >
                                  Renew Certificates
                                </Button>
                              </motion.div>
                            ) : (
                              <Button size="sm" variant="outline" data-testid={`button-view-${bus.busNumber}`}>
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
