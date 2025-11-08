import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your BusBuddy assistant. Ask me about bus locations, ETAs, eco-stats, or anything else! 🌱",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");

  const quickReplies = [
    "Where is Bus 145B?",
    "Show my CO₂ savings",
    "When will bus arrive?",
    "Help / SOS"
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(input),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("bus") && lowerQuery.includes("where")) {
      return "Bus 145B is currently near Bannimantap Junction, 2.3 km away. ETA: 6 minutes. Would you like me to track it for you?";
    }
    if (lowerQuery.includes("co2") || lowerQuery.includes("savings") || lowerQuery.includes("eco")) {
      return "Great question! You've saved 2.1 kg of CO₂ this week by using public transport. That's equivalent to planting 0.5 trees! 🌳";
    }
    if (lowerQuery.includes("eta") || lowerQuery.includes("arrive") || lowerQuery.includes("when")) {
      return "The next bus on Route 145B will arrive at your stop in approximately 8 minutes. Would you like me to send you a notification when it's 1 km away?";
    }
    if (lowerQuery.includes("sos") || lowerQuery.includes("help") || lowerQuery.includes("emergency")) {
      return "For emergencies, please click the red SOS button at the bottom right. It will instantly alert admin, police, and your emergency contacts. Stay safe!";
    }
    
    return "I'm here to help! You can ask me about bus locations, ETAs, eco-statistics, routes, or emergency assistance. What would you like to know?";
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-2xl flex items-center justify-center border-2 border-white/20 electric-glow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          data-testid="button-chatbot"
        >
          {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="glass-card border-primary/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">BusBuddy AI</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  <span className="text-xs text-white/80">Online</span>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-96 p-4 bg-background/40">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`max-w-[80%] ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                        {msg.sender === "bot" && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs text-muted-foreground">BusBuddy</span>
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-primary to-secondary text-white"
                              : "glass border border-primary/10"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Quick Replies */}
              {messages.length <= 1 && (
                <div className="p-3 border-t border-border/50 bg-background/20">
                  <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs glass border-primary/20 hover-elevate"
                        data-testid={`button-quick-reply-${index}`}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border/50 bg-background/20">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="glass border-primary/20 flex-1"
                    data-testid="input-chatbot-message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-gradient-to-r from-primary to-secondary text-white"
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Available in English & ಕನ್ನಡ
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
