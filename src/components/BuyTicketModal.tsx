import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, Shield, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useContract } from "@/hooks/useContract";

interface BuyTicketModalProps {
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
  };
  onPurchaseComplete: () => void;
}

export const BuyTicketModal = ({ open, onOpenChange, ticket, onPurchaseComplete }: BuyTicketModalProps) => {
  const { purchaseTicket } = useContract();
  const [step, setStep] = useState<'payment' | 'processing' | 'complete'>('payment');
  const [walletAddress, setWalletAddress] = useState('');

  const handlePurchase = async () => {
    setStep('processing');
    
    try {
      // Convert price to wei (assuming price is in ETH)
      const priceInWei = parseFloat(ticket.price.replace(' ETH', '')) * 1e18;
      
      await purchaseTicket.mutateAsync({
        ticketId: parseInt(ticket.id.replace('TK', '')),
        amount: priceInWei.toString(),
      });
      
      setStep('complete');
      setTimeout(() => {
        onPurchaseComplete();
        setStep('payment');
      }, 2000);
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
      setStep('payment');
    }
  };

  const categoryStyles = {
    premium: "premium-gradient",
    vip: "crypto-gradient", 
    standard: "paper-texture"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <CreditCard className="w-5 h-5 text-primary" />
            Purchase Encrypted Ticket
          </DialogTitle>
        </DialogHeader>

        {step === 'payment' && (
          <div className="space-y-6">
            {/* Ticket Summary */}
            <div className={cn(
              "p-4 rounded-lg border",
              categoryStyles[ticket.category]
            )}>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {ticket.category.toUpperCase()}
                </Badge>
                <span className="font-mono text-sm">#{ticket.id}</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-1">{ticket.name}</h3>
              <p className="text-sm text-muted-foreground">{ticket.venue}</p>
              <p className="text-sm text-muted-foreground">{ticket.date} at {ticket.time}</p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Ticket Price</span>
                <span className="font-mono">{ticket.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Platform Fee</span>
                <span className="font-mono">0.01 ETH</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Gas Fee (Est.)</span>
                <span className="font-mono">0.005 ETH</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="font-mono">{parseFloat(ticket.price.replace(' ETH', '')) + 0.015} ETH</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <Label>Wallet Address</Label>
              <Input
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Payment will be processed securely via smart contract</span>
              </div>
            </div>

            <Button
              onClick={handlePurchase}
              className="w-full crypto-gradient text-primary-foreground border-0 font-mono"
              disabled={!walletAddress}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Confirm Purchase
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div className="text-center">
              <h3 className="font-semibold mb-1">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">
                Your transaction is being confirmed on the blockchain...
              </p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-1">Purchase Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Your encrypted ticket has been added to your wallet
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};