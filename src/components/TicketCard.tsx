import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Shield, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  event: {
    id: string;
    name: string;
    venue: string;
    date: string;
    time: string;
    price: string;
    category: "premium" | "standard" | "vip";
    isEncrypted: boolean;
    seatNumber?: string;
    onViewDetails?: () => void;
  };
  className?: string;
}

export const TicketCard = ({ event, className }: TicketCardProps) => {
  const categoryStyles = {
    premium: "premium-gradient text-secondary-foreground",
    vip: "crypto-gradient text-primary-foreground",
    standard: "paper-texture text-card-foreground"
  };

  return (
    <Card className={cn(
      "ticket-stub ticket-perforation overflow-hidden hover:scale-[1.02] transition-all duration-300",
      "border-l-4 border-l-primary/20",
      className
    )}>
      {/* Ticket Header */}
      <div className={cn(
        "p-4 border-b border-dashed border-border/50",
        categoryStyles[event.category]
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {event.isEncrypted && (
              <Shield className="w-4 h-4" />
            )}
            <Badge variant="secondary" className="font-mono text-xs">
              {event.category.toUpperCase()}
            </Badge>
          </div>
          <span className="font-mono text-sm font-bold">#{event.id}</span>
        </div>
      </div>

      {/* Ticket Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-foreground mb-1">
            {event.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-sm">{event.venue}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{event.time}</span>
          </div>
        </div>

        {event.seatNumber && (
          <div className="text-sm font-mono">
            <span className="text-muted-foreground">Seat: </span>
            <span className="font-semibold text-foreground">{event.seatNumber}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-dashed border-border/50">
          <span className="font-bold text-lg text-foreground">{event.price}</span>
          <Button 
            size="sm" 
            variant="outline"
            className="font-mono text-xs"
            onClick={event.onViewDetails}
          >
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};