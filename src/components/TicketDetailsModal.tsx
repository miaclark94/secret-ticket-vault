import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Shield, CreditCard, User, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: {
    id: string;
    name: string;
    venue: string;
    date: string;
    time: string;
    price: string;
    category: "premium" | "standard" | "vip";
    isEncrypted: boolean;
    seatNumber?: string;
  };
  onBuyTicket: () => void;
}

export const TicketDetailsModal = ({ open, onOpenChange, ticket, onBuyTicket }: TicketDetailsModalProps) => {
  const categoryStyles = {
    premium: "premium-gradient",
    vip: "crypto-gradient", 
    standard: "paper-texture"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
            <Shield className="w-6 h-6 text-primary" />
            Encrypted Ticket Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Ticket Header */}
          <div className={cn(
            "p-6 rounded-lg border",
            categoryStyles[ticket.category]
          )}>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="font-mono">
                {ticket.category.toUpperCase()}
              </Badge>
              <span className="font-mono text-sm font-bold">#{ticket.id}</span>
            </div>
            
            <h2 className="font-serif text-3xl font-bold mb-2">{ticket.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{ticket.venue}</span>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Date</div>
                  <div className="text-muted-foreground">{ticket.date}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Time</div>
                  <div className="text-muted-foreground">{ticket.time}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {ticket.seatNumber && (
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold">Seat</div>
                    <div className="text-muted-foreground font-mono">{ticket.seatNumber}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Price</div>
                  <div className="text-muted-foreground font-mono text-lg">{ticket.price}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">Security Features</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• End-to-end encryption with FHE technology</li>
              <li>• Private ownership verification</li>
              <li>• Anti-counterfeiting protection</li>
              <li>• Secure transfer capabilities</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onBuyTicket}
              className="flex-1 crypto-gradient text-primary-foreground border-0 font-mono"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Purchase Ticket
            </Button>
            <Button variant="outline" className="font-mono">
              <Hash className="w-4 h-4 mr-2" />
              Verify Authenticity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};