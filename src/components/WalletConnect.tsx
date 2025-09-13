import { ConnectButton } from '@rainbow-me/rainbowkit';
import { cn } from "@/lib/utils";

interface WalletConnectProps {
  className?: string;
}

export const WalletConnect = ({ className }: WalletConnectProps) => {
  return (
    <div className={cn("", className)}>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className={cn(
                        "crypto-gradient text-primary-foreground border-0 hover:opacity-90 transition-all duration-200",
                        "font-mono text-sm font-semibold shadow-ticket px-4 py-2 rounded-md",
                        className
                      )}
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className={cn(
                        "bg-red-500 text-white border-0 hover:opacity-90 transition-all duration-200",
                        "font-mono text-sm font-semibold px-4 py-2 rounded-md",
                        className
                      )}
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex gap-2">
                    <button
                      onClick={openChainModal}
                      type="button"
                      className={cn(
                        "paper-texture border-border hover:bg-muted/50 transition-all duration-200",
                        "font-mono text-sm px-3 py-2 rounded-md border",
                        className
                      )}
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className={cn(
                        "paper-texture border-border hover:bg-muted/50 transition-all duration-200",
                        "font-mono text-sm px-3 py-2 rounded-md border",
                        className
                      )}
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};