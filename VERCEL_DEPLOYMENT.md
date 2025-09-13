# Vercel Deployment Guide for Secret Ticket Vault

This guide provides step-by-step instructions for deploying the Secret Ticket Vault application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: The project should be pushed to GitHub (already completed)
3. **Node.js**: Version 18+ (Vercel will handle this automatically)

## Step-by-Step Deployment Process

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click on "New Project" or "Import Project"
3. Connect your GitHub account if not already connected
4. Find and select the `miaclark94/secret-ticket-vault` repository

### Step 2: Configure Project Settings

#### Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables
Add the following environment variables in Vercel dashboard:

```
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
```

**Important Configuration Notes:**
- Replace `your_walletconnect_project_id` with your actual WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)
- Replace `your_deployed_contract_address` with the deployed SecretTicketVault contract address
- Replace `your_infura_key` with your Infura API key for Sepolia testnet
- The chain ID `11155111` is for Sepolia testnet

### Step 3: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Vercel will provide you with a deployment URL

### Step 4: Post-Deployment Configuration

#### Update Contract Configuration
1. After deployment, update the contract address in your code:
   - Go to `src/lib/wallet.ts`
   - Update the `CONTRACT_ADDRESS` constant with your deployed contract address
   - Commit and push changes to trigger a new deployment

#### Domain Configuration (Optional)
1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains" section
3. Add your custom domain if you have one
4. Follow Vercel's DNS configuration instructions

## Important Configuration Parameters

### WalletConnect Project ID
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID
4. Add it to Vercel environment variables as `VITE_WALLETCONNECT_PROJECT_ID`

### Contract Deployment
Before deploying to Vercel, ensure your smart contract is deployed:

1. **Deploy Contract to Sepolia**:
   ```bash
   # Using Hardhat or Foundry
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. **Update Contract Address**:
   - Copy the deployed contract address
   - Update `src/hooks/useContract.ts` with the correct address
   - Add to Vercel environment variables

### RPC Configuration
For Sepolia testnet, you can use:
- **Infura**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **Alchemy**: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
- **Public RPC**: `https://rpc.sepolia.org`

## Build Optimization

### Vite Configuration
The project is already configured with optimal Vite settings:
- Tree shaking enabled
- Code splitting
- Asset optimization
- TypeScript compilation

### Bundle Analysis
To analyze bundle size:
```bash
npm run build
npx vite-bundle-analyzer dist
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

2. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID is correct
   - Check network configuration
   - Ensure contract address is correct

3. **Contract Interaction Issues**:
   - Verify contract is deployed and verified
   - Check RPC URL is accessible
   - Ensure user has sufficient testnet ETH

### Environment Variables Checklist
- [ ] `VITE_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID
- [ ] `VITE_CONTRACT_ADDRESS` - Deployed contract address
- [ ] `VITE_CHAIN_ID` - Network chain ID (11155111 for Sepolia)
- [ ] `VITE_RPC_URL` - RPC endpoint URL

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to the repository
2. **Contract Verification**: Verify your smart contract on Etherscan
3. **HTTPS**: Vercel automatically provides HTTPS
4. **CORS**: Configure CORS settings if needed for API calls

## Performance Optimization

1. **Image Optimization**: Vercel automatically optimizes images
2. **CDN**: Vercel provides global CDN
3. **Caching**: Configure appropriate cache headers
4. **Bundle Size**: Monitor bundle size and optimize imports

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider adding Sentry or similar
3. **Performance Monitoring**: Use Vercel's built-in monitoring

## Support

For deployment issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check GitHub repository for any issues

## Next Steps After Deployment

1. Test all functionality on the deployed site
2. Verify wallet connections work properly
3. Test contract interactions
4. Set up monitoring and analytics
5. Configure custom domain if needed
6. Set up automated deployments from main branch
