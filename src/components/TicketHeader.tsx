import { Shield, Ticket } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

export const TicketHeader = () => {
  return (
    <header className="relative">
      {/* Cutout ticket header shape */}
      <div className="crypto-gradient relative overflow-hidden">
        {/* Perforated top edge */}
        <div className="absolute top-0 left-0 w-full h-2 bg-ticket-perforation"></div>
        
        <div className="container mx-auto px-6 py-8 pt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Ticket className="w-10 h-10 text-primary-foreground" />
                <Shield className="w-5 h-5 text-secondary absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground">
                  FHE Ticket Privacy
                </h1>
                <p className="text-primary-foreground/80 font-mono text-sm mt-1">
                  Encrypted Event Tickets • Private Ownership • NFT Technology
                </p>
              </div>
            </div>
            
            <WalletConnect />
          </div>
        </div>

        {/* Cutout bottom edge with ticket stub notches */}
        <div className="absolute bottom-0 left-0 w-full h-6 overflow-hidden">
          <div className="flex justify-center items-end h-full">
            {/* Ticket stub cutouts */}
            <div className="w-8 h-4 bg-background rounded-t-full"></div>
            <div className="w-8 h-4 bg-background rounded-t-full mx-8"></div>
            <div className="w-8 h-4 bg-background rounded-t-full"></div>
          </div>
        </div>
      </div>

      {/* Secondary info bar */}
      <div className="paper-texture border-b border-border py-3">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-muted-foreground font-mono">
              <span>🔒 Fully Homomorphic Encryption</span>
              <span>🎫 NFT Ownership</span>
              <span>🛡️ Privacy First</span>
            </div>
            <div className="text-muted-foreground font-mono">
              Block #1,234,567
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};