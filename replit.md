# RBTC/USDT0 Lending Protocol - Full Stack dApp

## Overview
This is a Rootstock (RSK) blockchain lending boilerplate project that demonstrates how to:
- Deposit RBTC (native token) as collateral
- Borrow USDT0 (ERC-20, 6 decimals) against collateral
- Query prices via UmbrellaOracleAdapter (mock oracle)
- Compute health factor for loan positions
- **Full Stack React Frontend** with Web3 wallet integration

**Educational purposes only - not audited for production use**

## Recent Changes
**2025-12-15**: Added Full Stack Frontend
- Created React + TypeScript + Vite frontend in `/frontend`
- Implemented wagmi + viem for Web3 wallet connectivity
- Added TailwindCSS v4 with custom RSK theme and animations
- Built stunning animated Dashboard with glass-card effects
- Created components: Header, HealthCard, ActionCards, StatsGrid, Footer
- Custom hooks for all contract interactions

**2025-09-30**: Initial project setup
- Upgraded to Node.js v22.17.0 (required by Hardhat)
- Installed npm dependencies
- Configured Demo workflow to run the lending demo

## Project Architecture

### Frontend (`/frontend`)
- **Framework**: React 19 + TypeScript + Vite
- **Web3**: wagmi v2 + viem + @tanstack/react-query
- **Styling**: TailwindCSS v4 with custom theme
- **Animations**: Framer Motion
- **Icons**: Lucide React

#### Key Components
- `Header.tsx` - Connect wallet button with dropdown menu
- `HealthCard.tsx` - Visual health factor display with status indicators
- `ActionCards.tsx` - Deposit, Withdraw, Borrow, Repay tabbed interface
- `StatsGrid.tsx` - Protocol statistics display
- `Footer.tsx` - Links and credits

#### Hooks
- `useLendingPool.ts` - All contract interaction hooks (deposit, borrow, repay, etc.)

#### Configuration
- `config/wagmi.ts` - RSK Testnet and Mainnet chain definitions
- `config/contracts.ts` - Contract addresses (configurable via env vars)
- `abi/LendingPool.ts` - LendingPool ABI
- `abi/ERC20.ts` - ERC20 ABI for USDT0 approvals

### Smart Contracts (`/contracts`)
- **LendingPool.sol**: Core lending logic (deposit, borrow, repay, withdraw)
- **UmbrellaOracleAdapter.sol**: Mock price oracle with owner-settable prices
- **MockUSDT0.sol**: ERC-20 token (6 decimals) for testing
- **IPriceOracle.sol**: Price oracle interface

### Contract Functions
| Action | Function | Parameters |
|--------|----------|------------|
| Deposit Collateral | `depositRBTC()` | payable - sends RBTC as value |
| Withdraw Collateral | `withdrawRBTC(amountWei)` | uint256 |
| Borrow | `borrowUSDT0(amount)` | uint256 (6 decimals) |
| Repay | `repayUSDT0(amount)` | uint256 - requires ERC20 approval |
| Get Account Data | `getAccountData(user)` | address |
| Health Factor | `healthFactorE18(user)` | address |

### Key Features
- Collateral: RBTC (18 decimals)
- Borrow Asset: USDT0 (6 decimals)
- Oracle: Returns USD prices with 18 decimals
- LTV (Loan-to-Value): 70% configured
- Health Factor calculation for position monitoring

## Technology Stack
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, Framer Motion
- **Web3**: wagmi v2, viem, ethers
- **Smart Contracts**: Hardhat v2.22.7, Solidity 0.8.19
- **Node.js**: v22.17.0

## Workflows
- **Frontend**: `cd frontend && npm run dev` (port 5000, webview)
- **Demo**: `echo "n" | npx hardhat run scripts/demo.js` (console)

## Environment Variables
Create `.env` in frontend folder:
```
VITE_LENDING_POOL_ADDRESS=0x...
VITE_USDT0_ADDRESS=0x...
VITE_ORACLE_ADDRESS=0x...
```

## Deployment
1. Deploy contracts to RSK Testnet: `npx hardhat run scripts/demo-testnet.js --network rskTestnet`
2. Copy deployed contract addresses to frontend `.env`
3. Restart frontend workflow

## User Preferences
- None documented yet

## Omitted Features (By Design)
- Interest rate calculations
- Liquidation mechanisms
- Multiple collateral types
- Production oracle integration
- Role-based access beyond Ownable
