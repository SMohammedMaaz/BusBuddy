import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function SOSButton() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendSOS = async () => {
    setSending(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Send SOS alert to backend
          const response = await fetch("/api/sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude,
              longitude,
              message,
              timestamp: new Date().toISOString()
            })
          });

          if (response.ok) {
            toast({
              title: "SOS Alert Sent Successfully! ✅",
              description: "Emergency services and admin have been notified. Help is on the way.",
              className: "eco-glow",
            });
            setShowModal(false);
            setMessage("");
          } else {
            throw new Error("Failed to send SOS");
          }
        } catch (error) {
          toast({
            title: "Error Sending SOS",
            description: "Please try again or call emergency services directly.",
            variant: "destructive",
          });
        } finally {
          setSending(false);
        }
      },
      () => {
        toast({
          title: "Location Access Denied",
          description: "Please enable location services to send SOS alerts.",
          variant: "destructive",
        });
        setSending(false);
      }
    );
  };

  return (
    <>
      {/* Floating SOS Button */}
      <motion.div
        className="fixed bottom-24 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setShowModal(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-destructive to-destructive/80 text-white shadow-2xl flex items-center justify-center border-2 border-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(239, 68, 68, 0.5)",
              "0 0 40px rgba(239, 68, 68, 0.8)",
              "0 0 20px rgba(239, 68, 68, 0.5)",
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          data-testid="button-sos"
        >
          <AlertCircle className="w-8 h-8" />
        </motion.button>
      </motion.div>

      {/* SOS Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="glass-card border-destructive/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-foreground">Emergency SOS</h3>
                      <p className="text-sm text-muted-foreground">Send alert to admin & emergency services</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowModal(false)}
                    data-testid="button-close-sos"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/20">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Your current location will be shared</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Additional Message (Optional)
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your emergency..."
                      className="glass border-primary/20 min-h-24"
                      data-testid="textarea-sos-message"
                    />
                  </div>

                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-foreground font-medium mb-2">Alert will be sent to:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        Admin Control Room
                      </li>
                      <li className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        Nearest Police Station
                      </li>
                      <li className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        Emergency Contact (SMS/WhatsApp)
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowModal(false)}
                      className="flex-1 border-border"
                      data-testid="button-cancel-sos"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendSOS}
                      disabled={sending}
                      className="flex-1 bg-gradient-to-r from-destructive to-destructive/80 text-white"
                      data-testid="button-send-sos"
                    >
                      {sending ? "Sending..." : "Send SOS"}
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
