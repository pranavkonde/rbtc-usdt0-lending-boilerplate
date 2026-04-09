[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/rsksmart/rbtc-usdt0-lending-boilerplate/badge)](https://scorecard.dev/viewer/?uri=github.com/rsksmart/rbtc-usdt0-lending-boilerplate)
[![CodeQL](https://github.com/rsksmart/rbtc-usdt0-lending-boilerplate/workflows/CodeQL/badge.svg)](https://github.com/rsksmart/rbtc-usdt0-lending-boilerplate/actions?query=workflow%3ACodeQL)

<img src="rootstock-logo.png" alt="RSK Logo" style="width:100%; height: auto;" />

⚠️ **Educational only. Not audited. Do NOT deploy to mainnet.**
# Rootstock Lending Boilerplate – Frontend Application
A complete DeFi lending application on the Rootstock blockchain with a modern React frontend, enabling users to deposit RBTC as collateral and borrow USDT0 stablecoin.

> **Note:** This project is based on the [Rootstock Lending Boilerplate](https://github.com/rsksmart/rbtc-usdt0-lending-boilerplate). 

## 🌟 Live Demo

- **Application:** [https://2d179262-6166-446b-92ae-820914941f6d-00-3hb58x1k7qbp8.pike.replit.dev](https://2d179262-6166-446b-92ae-820914941f6d-00-3hb58x1k7qbp8.pike.replit.dev)
- **Repository:** [https://replit.com/@rythmern02/Rootstock-Lending-Boilerplate](https://replit.com/@rythmern02/Rootstock-Lending-Boilerplate)

## ✨ Features

### Smart Contracts
- **Lending Pool:** Minimal yet powerful lending pool implementation
- **RBTC Collateral:** Native RBTC deposits as collateral
- **USDT0 Borrowing:** ERC-20 stablecoin (6 decimals) for borrowing
- **Oracle Integration:** UmbrellaOracleAdapter for real-time price feeds
- **Health Factor:** Automated collateralization ratio monitoring

### Frontend Application
- **🔐 Wallet Integration:** Seamless MetaMask and Web3 wallet connectivity
- **📊 Real-time Dashboard:** Live account balances, collateral, and debt positions
- **💰 Deposit RBTC:** User-friendly interface for collateral deposits
- **💵 Borrow USDT0:** Smart borrowing with automated health factor checks
- **♻️ Repay Debt:** Easy USDT0 repayment functionality
- **🏦 Withdraw Collateral:** Safe RBTC withdrawal with ratio validation
- **📈 Health Monitoring:** Visual health factor indicator
- **💱 Price Display:** Real-time RBTC and USDT0 price feeds

### Development Tools
- **Vite:** Lightning-fast build tool and dev server
- **Hardhat:** Complete Ethereum development environment
- **React + TypeScript:** Modern UI library with type safety
- **ethers.js:** Robust blockchain interaction library
- **TailwindCSS:** Utility-first CSS framework

## 🏗️ Project Structure

```
/
├── .config/                    # Configuration files
├── .git/                       # Git repository
├── artifacts/                  # Hardhat compilation artifacts
├── cache/                      # Hardhat cache
├── contracts/                  # Solidity smart contracts
│   ├── LendingPool.sol        # Main lending pool contract
│   ├── MockUSDT0.sol          # USDT0 stablecoin implementation
│   └── UmbrellaOracleAdapter.sol  # Price oracle adapter
├── frontend/                   # React frontend application
│   ├── node_modules/          # Frontend dependencies
│   ├── public/                # Static assets
│   ├── src/                   # Frontend source code
│   │   ├── abi/              # Contract ABIs
│   │   │   ├── ERC20.ts      # ERC20 token ABI
│   │   │   └── LendingPool.ts # Lending pool ABI
│   │   ├── assets/           # Images and static files
│   │   │   └── react.svg     # React logo
│   │   ├── components/       # React components
│   │   │   ├── ActionCards.tsx    # Deposit/Borrow/Repay/Withdraw cards
│   │   │   ├── Footer.tsx         # Application footer
│   │   │   ├── Header.tsx         # Application header
│   │   │   ├── HealthCard.tsx     # Health factor display
│   │   │   └── StatsGrid.tsx      # Statistics grid
│   │   ├── config/           # Configuration files
│   │   │   ├── contracts.ts  # Contract addresses
│   │   │   └── wagmi.ts      # Wagmi configuration
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── useLendingPool.ts  # Lending pool hook
│   │   ├── lib/              # Utility libraries
│   │   ├── App.tsx           # Main application component
│   │   ├── index.css         # Global styles
│   │   └── main.tsx          # Application entry point
│   ├── .env.example          # Environment variables template
│   ├── .gitignore            # Git ignore rules
│   ├── index.html            # HTML entry point
│   ├── package.json          # Frontend dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── vite.config.ts        # Vite configuration
├── node_modules/              # Root dependencies
├── scripts/                   # Deployment scripts
│   └── demo-testnet.js       # Testnet deployment script
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── hardhat.config.js         # Hardhat configuration
├── package.json              # Root dependencies and scripts
├── README.md                 # This file
├── replit.md                 # Replit documentation
└── SECURITY.MD               # Security documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension
- **Funded Rootstock testnet account** - Get tRBTC from the [Rootstock Faucet](https://faucet.rootstock.io/)


### Installation

#### 1. Clone the Repository (if not forking)

```bash
git clone https://github.com/rythmern02/rsk-lending-frontend-boilerplate
cd frontend
```

#### 2. Install Dependencies

Install root dependencies:
Test this example on Rootstock Replit [Here](https://replit.com/@rootstockDevX/Rootstock-Lending-Boilerplate)

1) **Install** (first run only):
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

#### 3. Configure Environment

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit the `frontend/.env` file with your deployed contract addresses:

```env
VITE_LENDING_POOL_ADDRESS=0xC09Fe81b40DB2a013017bc2BcFfc718A25C45Cd3
VITE_USDT0_ADDRESS=0xf7F1Fe4c7dea6401Ae4e486502832782247E7A0f
VITE_ORACLE_ADDRESS=0xf9C3D70C33CBa0be571df7B9E3f0697C8ef40d69
```

## 📦 Smart Contract Deployment

Deploy the smart contracts to Rootstock testnet (if not already deployed):

```bash
npx hardhat run scripts/demo-testnet.js --network rskTestnet
```

This script deploys:
- **LendingPool** - Main lending contract
- **MockUSDT0** - USDT0 stablecoin contract  
- **UmbrellaOracleAdapter** - Price oracle contract

After successful deployment, update the contract addresses in `frontend/.env`.

## 🖥️ Running the Frontend

### Development Mode

Navigate to the frontend directory and start the development server:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5001`

### Production Build

Build the application for production:

```bash
cd frontend
npm run build
```

## 🎮 Using the Application

### 1. Connect Your Wallet

- Click the "Connect Wallet" button
- Approve the MetaMask connection
- Ensure you're connected to Rootstock Testnet (Chain ID: 31)

### 2. View Your Dashboard

- **Account Balance:** Your RBTC and USDT0 wallet balances
- **Collateral:** Amount of RBTC deposited in the lending pool
- **Debt:** Amount of USDT0 borrowed
- **Health Factor:** Your current collateralization ratio

### 3. Deposit RBTC Collateral

- Enter the amount of RBTC to deposit
- Click "Deposit"
- Confirm the transaction in MetaMask
- Wait for blockchain confirmation

### 4. Borrow USDT0

- Enter the amount of USDT0 to borrow
- The interface shows your available borrowing capacity
- Click "Borrow"
- Confirm the transaction
- USDT0 will be transferred to your wallet

### 5. Repay USDT0 Debt

- Enter the amount of USDT0 to repay
- Approve USDT0 spending (first-time only)
- Click "Repay"
- Confirm the transaction

### 6. Withdraw RBTC

- Enter the amount of RBTC to withdraw
- The interface validates your health factor remains healthy
- Click "Withdraw"
- Confirm the transaction

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite 5+** - Next-generation frontend tooling
- **Wagmi** - React Hooks for Ethereum
- **ethers.js 6+** - Ethereum library for blockchain interaction
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Smart Contracts
- **Solidity ^0.8.0** - Smart contract programming language
- **Hardhat** - Ethereum development environment
- **OpenZeppelin** - Secure smart contract library

### Blockchain
- **Rootstock (RSK)** - Bitcoin-secured smart contract platform
- **RBTC** - Native currency (Bitcoin on Rootstock)
- **MetaMask** - Web3 wallet provider

## 🔧 Key Features Explained

### Health Factor Calculation

The health factor determines the safety of your position:

```
Health Factor = (Collateral Value × Liquidation Threshold) / Borrowed Value
```

- **Health Factor > 1.0:** Position is healthy ✅
- **Health Factor < 1.0:** Position is at risk of liquidation ⚠️

### Price Oracle Integration

The UmbrellaOracleAdapter provides real-time price feeds:
- Fetches latest RBTC/USD prices
- Updates automatically on each transaction
- Ensures accurate collateralization calculations

### Smart Contract Security

- **Reentrancy Protection:** Guards against reentrancy attacks
- **Access Control:** Admin-only functions for critical operations
- **Safe Math:** Overflow/underflow protection
- **Tested:** Comprehensive test suite included

## 🔐 Security Best Practices

### For Users
- ✅ **Use Test Networks:** Start with testnet before mainnet
- ✅ **Verify Contracts:** Always verify contract addresses
- ✅ **Monitor Health Factor:** Keep it above 1.5 for safety
- ✅ **Secure Your Keys:** Never share private keys
- ✅ **Test Small Amounts:** Start with small transactions

### For Developers
- ✅ **Audit Contracts:** Get professional security audits
- ✅ **Test Thoroughly:** Write comprehensive test suites
- ✅ **Follow Standards:** Use OpenZeppelin libraries
- ✅ **Monitor Events:** Implement proper event logging
- ✅ **Emergency Stops:** Include pause functionality

## 🧪 Testing

Run the smart contract test suite:

```bash
npx hardhat test
```

Run tests with coverage:

```bash
npx hardhat coverage
```

## 📝 Available Scripts

### Root Directory
```bash
npm test              # Run contract tests
npm run compile       # Compile smart contracts
npm run deploy        # Deploy to testnet
```

### Frontend Directory
```bash
npm run dev           # Start development server (port 5001)
npm run build         # Build for production
```

## 🌐 Network Configuration

### Rootstock Testnet

- **Network Name:** RSK Testnet
- **RPC URL:** https://public-node.testnet.rsk.co
- **Chain ID:** 31
- **Currency Symbol:** tRBTC
- **Block Explorer:** https://explorer.testnet.rsk.co

Add to MetaMask:
1. Open MetaMask
2. Click network dropdown
3. Select "Add Network"
4. Enter the details above

## 🐛 Troubleshooting

### MetaMask Connection Issues

**Problem:** "Wrong Network" error

**Solution:** Switch to Rootstock Testnet (Chain ID: 31) in MetaMask

---

**Problem:** Transaction fails with "Insufficient funds"

**Solution:** Get tRBTC from the [Rootstock Faucet](https://faucet.rootstock.io/)

### Contract Interaction Issues

**Problem:** "Contract not deployed" error

**Solution:** Verify contract addresses in `frontend/.env` are correct

---

**Problem:** "Health factor too low" error

**Solution:** Deposit more collateral or repay some debt

### Build Issues

**Problem:** Dependencies installation fails

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

**Problem:** Port 5001 already in use

**Solution:** 
```bash
# Kill the process using port 5001
lsof -ti:5001 | xargs kill -9
# Or change the port in vite.config.ts
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Standards
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Boilerplate:** [rsksmart/rbtc-usdt0-lending-boilerplate](https://github.com/rsksmart/rbtc-usdt0-lending-boilerplate)
- **Rootstock Team:** For the excellent blockchain infrastructure and documentation
- **OpenZeppelin:** For secure smart contract libraries
- **Vite Team:** For the amazing build tool
- **React Community:** For the robust UI library
- **Wagmi Team:** For excellent React hooks for Ethereum

## 📞 Support

- **Documentation:** [Rootstock Docs](https://dev.rootstock.io/)
- **Discord:** [Rootstock Community](https://rootstock.io/discord)
---

**Built with ❤️ on Rootstock**

⭐ Star this repository if you find it helpful!