import { TicketHeader } from "@/components/TicketHeader";
import { TicketCard } from "@/components/TicketCard";
import { TicketDetailsModal } from "@/components/TicketDetailsModal";
import { BuyTicketModal } from "@/components/BuyTicketModal";
import { CreateTicketModal } from "@/components/CreateTicketModal";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const mockTickets = [
  {
    id: "TK001",
    name: "Crypto Summit 2024",
    venue: "Convention Center",
    date: "Dec 15, 2024",
    time: "7:00 PM",
    price: "0.5 ETH",
    category: "premium" as const,
    isEncrypted: true,
    seatNumber: "A-12"
  },
  {
    id: "TK002",
    name: "NFT Art Gallery Opening",
    venue: "Digital Arts Museum",
    date: "Dec 18, 2024",
    time: "6:30 PM",
    price: "0.2 ETH",
    category: "vip" as const,
    isEncrypted: true,
    seatNumber: "VIP-05"
  },
  {
    id: "TK003",
    name: "Web3 Developer Meetup",
    venue: "Tech Hub",
    date: "Dec 20, 2024",
    time: "5:00 PM",
    price: "0.1 ETH",
    category: "standard" as const,
    isEncrypted: true
  },
  {
    id: "TK004",
    name: "DeFi Conference 2024",
    venue: "Finance Center",
    date: "Dec 22, 2024",
    time: "9:00 AM",
    price: "0.8 ETH",
    category: "premium" as const,
    isEncrypted: true,
    seatNumber: "B-08"
  },
  {
    id: "TK005",
    name: "Blockchain Workshop",
    venue: "Innovation Lab",
    date: "Dec 25, 2024",
    time: "2:00 PM",
    price: "0.3 ETH",
    category: "vip" as const,
    isEncrypted: true,
    seatNumber: "W-15"
  },
  {
    id: "TK006",
    name: "Smart Contract Seminar",
    venue: "University Auditorium",
    date: "Dec 28, 2024",
    time: "11:00 AM",
    price: "0.15 ETH",
    category: "standard" as const,
    isEncrypted: true
  }
];

const Index = () => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState(mockTickets);

  const handleViewDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const handleBuyTicket = () => {
    setShowDetailsModal(false);
    setShowBuyModal(true);
  };

  const handlePurchaseComplete = () => {
    setShowBuyModal(false);
    toast({
      title: "Purchase Successful!",
      description: "Your encrypted ticket has been added to your wallet.",
    });
  };

  const handleCreateTicket = (ticketData: any) => {
    const newTicket = {
      ...ticketData,
      id: `TK${String(tickets.length + 1).padStart(3, '0')}`,
      price: `${ticketData.price} ETH`,
      onViewDetails: () => handleViewDetails(newTicket)
    };
    setTickets([...tickets, newTicket]);
    toast({
      title: "Ticket Created!",
      description: `${ticketData.name} ticket has been created successfully.`,
    });
  };

  // Add onViewDetails to existing tickets
  const ticketsWithHandlers = tickets.map(ticket => ({
    ...ticket,
    onViewDetails: () => handleViewDetails(ticket)
  }));

  return (
    <div className="min-h-screen bg-background">
      <TicketHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search encrypted tickets..."
              className="pl-10 font-mono"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-mono">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              size="sm" 
              className="crypto-gradient text-primary-foreground border-0 font-mono"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ticketsWithHandlers.map((ticket) => (
            <TicketCard key={ticket.id} event={ticket} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="paper-texture p-6 rounded-lg border border-border text-center">
            <div className="text-2xl font-bold text-primary font-mono">256</div>
            <div className="text-muted-foreground font-mono text-sm">Total Encrypted Tickets</div>
          </div>
          <div className="paper-texture p-6 rounded-lg border border-border text-center">
            <div className="text-2xl font-bold text-secondary font-mono">42.7 ETH</div>
            <div className="text-muted-foreground font-mono text-sm">Total Volume</div>
          </div>
          <div className="paper-texture p-6 rounded-lg border border-border text-center">
            <div className="text-2xl font-bold text-accent font-mono">128</div>
            <div className="text-muted-foreground font-mono text-sm">Active Events</div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedTicket && (
        <>
          <TicketDetailsModal
            open={showDetailsModal}
            onOpenChange={setShowDetailsModal}
            ticket={selectedTicket}
            onBuyTicket={handleBuyTicket}
          />
          <BuyTicketModal
            open={showBuyModal}
            onOpenChange={setShowBuyModal}
            ticket={selectedTicket}
            onPurchaseComplete={handlePurchaseComplete}
          />
        </>
      )}
      
      <CreateTicketModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateTicket={handleCreateTicket}
      />
    </div>
  );
};

export default Index;