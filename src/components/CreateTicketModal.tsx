import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Shield, Calendar, MapPin, Clock, CreditCard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useContract } from "@/hooks/useContract";

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTicket: (ticketData: any) => void;
}

export const CreateTicketModal = ({ open, onOpenChange, onCreateTicket }: CreateTicketModalProps) => {
  const { createEvent } = useContract();
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    description: '',
    date: '',
    time: '',
    price: '',
    category: '' as 'premium' | 'standard' | 'vip',
    maxSupply: '',
    seatNumbers: '',
    isEncrypted: true,
    transferable: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create event first
      const eventDate = new Date(`${formData.date} ${formData.time}`).getTime() / 1000;
      
      await createEvent.mutateAsync({
        name: formData.name,
        description: formData.description,
        venue: formData.venue,
        date: formData.date,
        time: formData.time,
        eventDate: eventDate,
        totalTickets: parseInt(formData.maxSupply),
        maxPrice: parseFloat(formData.price) * 1e18, // Convert to wei
      });
      
      onCreateTicket(formData);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: '',
        venue: '',
        description: '',
        date: '',
        time: '',
        price: '',
        category: '' as any,
        maxSupply: '',
        seatNumbers: '',
        isEncrypted: true,
        transferable: true
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const categoryStyles = {
    premium: "premium-gradient",
    vip: "crypto-gradient",
    standard: "paper-texture"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
            <Plus className="w-6 h-6 text-primary" />
            Create Encrypted Ticket
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Event Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  placeholder="Web3 Conference 2024"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  placeholder="Convention Center"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the event..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Event Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Ticket Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Ticket Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (ETH) *</Label>
                <Input
                  id="price"
                  placeholder="0.5"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSupply">Max Supply</Label>
                <Input
                  id="maxSupply"
                  placeholder="100"
                  type="number"
                  value={formData.maxSupply}
                  onChange={(e) => setFormData({...formData, maxSupply: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seatNumbers">Seat Numbers (optional)</Label>
              <Input
                id="seatNumbers"
                placeholder="A-1, A-2, B-1 (comma separated)"
                value={formData.seatNumbers}
                onChange={(e) => setFormData({...formData, seatNumbers: e.target.value})}
                className="font-mono"
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Security Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="font-medium">End-to-End Encryption</div>
                  <div className="text-sm text-muted-foreground">
                    Protect ticket data with FHE technology
                  </div>
                </div>
                <Switch
                  checked={formData.isEncrypted}
                  onCheckedChange={(checked) => setFormData({...formData, isEncrypted: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="font-medium">Transferable</div>
                  <div className="text-sm text-muted-foreground">
                    Allow ticket transfers between wallets
                  </div>
                </div>
                <Switch
                  checked={formData.transferable}
                  onCheckedChange={(checked) => setFormData({...formData, transferable: checked})}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.category && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className={cn(
                "p-4 rounded-lg border",
                categoryStyles[formData.category]
              )}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {formData.category.toUpperCase()}
                  </Badge>
                  {formData.isEncrypted && <Shield className="w-4 h-4" />}
                </div>
                <h4 className="font-serif font-bold">
                  {formData.name || "Event Name"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.venue || "Venue"} • {formData.date || "Date"}
                </p>
                <p className="font-mono font-bold mt-2">
                  {formData.price ? `${formData.price} ETH` : "Price"}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 crypto-gradient text-primary-foreground border-0 font-mono"
              disabled={!formData.name || !formData.venue || !formData.date || !formData.time || !formData.price || !formData.category}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};