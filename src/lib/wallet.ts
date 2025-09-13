import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Secret Ticket Vault',
  projectId: 'YOUR_PROJECT_ID', // Get this from https://cloud.walletconnect.com/
  chains: [sepolia, mainnet, polygon, arbitrum, optimism],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export const supportedChains = [sepolia, mainnet, polygon, arbitrum, optimism];
