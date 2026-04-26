const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const fs = require('fs');

const deploymentsPath = path.join(__dirname, '../../deployments.json');
let deployments = {};
if (fs.existsSync(deploymentsPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
} else {
    console.warn("Deployments file not found at " + deploymentsPath);
}

const LendingPoolABI = [
    "function getAccountData(address user) view returns (uint256, uint256, uint256, uint256, uint256, uint256)",
    "function depositRBTC() external payable",
    "function borrowUSDT0(uint256 amount) external",
    "function repayUSDT0(uint256 amount) external",
    "function withdrawRBTC(uint256 amountWei) external"
];

const ERC20ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
    throw new Error("PRIVATE_KEY is missing in .env file");
}

module.exports = {
    telegramToken: process.env.TELEGRAM_BOT_TOKEN,
    rpcUrl: process.env.RSK_TESTNET_RPC || "https://rpc.testnet.rootstock.io/<YOUR-API-KEY>",
    privateKey: privateKey,
    deployments,
    abis: {
        LendingPool: LendingPoolABI,
        ERC20: ERC20ABI
    }
};
