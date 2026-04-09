# RBTC Lending Frontend

React + TypeScript + Vite frontend for the RBTC/USDT0 lending pool.

This app connects to Rootstock networks using RainbowKit, wagmi and WalletConnect v2.

## Prerequisites

- Node.js 18+ and npm
- A WalletConnect Cloud account and project
- A browser wallet that supports Rootstock (for example, Rabby or MetaMask configured for Rootstock Testnet)

## Environment variables

RainbowKit requires a WalletConnect Cloud project id.  
Without it, you will see an error similar to:

`Error: No projectId found. Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2`

Create a `.env` file in this `frontend` folder based on `.env.example`:

```bash
cd frontend
cp .env.example .env
```

Then set at least:

```bash
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

Optional overrides (defaults live in `src/config/contracts.ts`):

```bash
VITE_LENDING_POOL_ADDRESS=...
VITE_USDT0_ADDRESS=...
VITE_ORACLE_ADDRESS=...
```

You can obtain the WalletConnect project id from the [WalletConnect Cloud](https://cloud.walletconnect.com/) dashboard.

## Contract configuration

The frontend is preconfigured to talk to the deployed contracts on Rootstock Testnet:

- LendingPool: `0x65eB9d654c7170bD2b1fB1070437DF5CC5E8da01`
- MockUSDT0: `0xad28C3C13a14baFD41B38633E4dE5f71F56C2FA5`

If you deploy new contracts, update the addresses in the config at:

- `src/config/contracts.ts`

## Install and run

From the repository root:

```bash
cd frontend
npm install
cp .env.example .env
# edit .env and set VITE_WALLET_CONNECT_PROJECT_ID
npm run dev
```

Then open the URL printed by Vite (by default `http://localhost:5173`).

## Build and lint

To run the type check and production build:

```bash
npm run build
```

To run the linter:

```bash
npm run lint
```
