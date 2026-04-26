# Lending Boilerplate Telegram Bot

This bot interacts with the Lending Boilerplate smart contracts on **Rootstock Testnet**. It demonstrates how to bridge Web2 (Telegram) with Web3 (Smart Contracts), featuring a modular architecture and robust error handling.

## Prerequisites

- Node.js
- **A Telegram Bot Token**: You can get one from [@BotFather](https://t.me/BotFather) by following these steps:
    1.  Open Telegram and search for `@BotFather`.
    2.  Start a chat and send the `/newbot` command.
    3.  Follow the instructions to choose a **name** (e.g., `My Lending Bot`) and a **username** (must end in `bot`, e.g., `MyLendingBoilerplateBot`).
    4.  BotFather will provide an **API Token**. Copy this token for your `.env` file.
    5.  For more details, see the official [Telegram Bot Tutorial](https://core.telegram.org/bots/tutorial).
- **A funded Rootstock Testnet Wallet** (RBTC for gas). You can get tRBTC from the [RSK Faucet](https://faucet.rootstock.io/).

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the project root (copy from `.env.example`):
    ```env
    TELEGRAM_BOT_TOKEN=your_token_here
    PRIVATE_KEY=your_private_key_with_trbtc
    RSK_TESTNET_RPC=https://rpc.testnet.rootstock.io/<YOUR-API-KEY>
    ```

3.  **Deploy Contracts to Rootstock Testnet**:
    You must deploy the contracts to the live network so the bot can interact with them.
    ```bash
    npx hardhat run scripts/deploy-for-bot.js --network rskTestnet
    ```
    *This command automatically updates `bot/deployments.json` with the new addresses.*

## Running the Bot

Start the bot:
```bash
node bot/index.js
```

## Commands

The bot supports the following commands. If you omit arguments, the bot will guide you with usage examples.

- `/start`: Welcome message and connection status.
- `/myinfo`: Check the bot's own wallet balance and pool stats.
- `/balance <address>`: Check loan balance, collateral, and health factor.
- `/health <address>`: Check health factor with status indicators (e.g., 🟢 Healthy, 🔴 Liquidation Risk).
- `/deposit <amount>`: Deposit RBTC into the pool (Uses bot's wallet).
- `/borrow <amount>`: Borrow USDT0 from the pool (Uses bot's wallet).
- `/repay <amount>`: Repay USDT0 debt (Uses bot's wallet).

## Project Structure

The bot is refactored for scalability and maintainability:

- `bot/index.js`: Entry point.
- `bot/src/config`: Configuration and contract ABIs.
- `bot/src/services`: Blockchain interaction logic.
- `bot/src/commands`: Telegram command handlers (modularized).
- `bot/src/utils`: Helper functions and formatters.

## Testing Logic

You can verify the contract interactions directly (without Telegram) by running:
```bash
node bot/test-logic.js
```
*Ensure you have deployed to Testnet and set your PRIVATE_KEY first.*
