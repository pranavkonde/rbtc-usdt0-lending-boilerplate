const blockchain = require('../services/blockchain');
const { formatEther, formatUnits, isAddress } = require('../utils/formatters');

module.exports = (bot) => {
    bot.onText(/\/balance(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const address = match[1];

        if (!address) {
            bot.sendMessage(chatId, "⚠️ Usage: /balance <address>\nExample: /balance 0x123...");
            return;
        }

        try {
            if (!isAddress(address)) {
                bot.sendMessage(chatId, "Invalid address format.");
                return;
            }

            if (!blockchain.lendingPool) {
                bot.sendMessage(chatId, "LendingPool contract not initialized.");
                return;
            }

            const data = await blockchain.lendingPool.getAccountData(address);
            // data: [collRbtcWei, debtUsdt0, collUsdE18, debtUsdE18, maxDebtUsdE18, healthFactorE18]
            
            const collRBTC = formatEther(data[0]);
            const debtUSDT = formatUnits(data[1], 6); 
            
            let healthFactor = formatUnits(data[5], 18);
            if (data[5] > 115792089237316195423570985008687907853269984665640564039450n) {
                healthFactor = "∞ (No Debt)";
            }

            bot.sendMessage(chatId, 
                `📊 Balance for ${address.slice(0,6)}...${address.slice(-4)}:\n` +
                `- Collateral: ${collRBTC} RBTC\n` +
                `- Debt: ${debtUSDT} USDT0\n` +
                `- Health Factor: ${healthFactor}`
            );
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `Error fetching balance: ${error.message}`);
        }
    });

    bot.onText(/\/health(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const address = match[1];

        if (!address) {
             bot.sendMessage(chatId, "⚠️ Usage: /health <address>\nExample: /health 0x123...");
             return;
        }

        try {
            if (!isAddress(address)) {
                bot.sendMessage(chatId, "Invalid address format.");
                return;
            }

            if (!blockchain.lendingPool) {
                bot.sendMessage(chatId, "LendingPool contract not initialized.");
                return;
            }

            const data = await blockchain.lendingPool.getAccountData(address);
            const healthFactorBN = data[5];
            let healthFactor = formatUnits(healthFactorBN, 18);
            
            if (healthFactorBN > 115792089237316195423570985008687907853269984665640564039450n) { 
                healthFactor = "∞ (No Debt)";
            }

            let status = "🟢 Healthy";
            if (healthFactor !== "∞ (No Debt)") {
                if (parseFloat(healthFactor) < 1.0) status = "🔴 Liquidation Risk";
                else if (parseFloat(healthFactor) < 1.5) status = "⚠️ Warning";
            }

            bot.sendMessage(chatId, `Health Factor for ${address}:\n${healthFactor}\nStatus: ${status}`);
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `Error fetching health: ${error.message}`);
        }
    });

    bot.onText(/\/myinfo/, async (msg) => {
        const chatId = msg.chat.id;
        try {
            const walletAddr = blockchain.getWalletAddress();
            const balance = await blockchain.getBalance(walletAddr);
            
            let poolInfo = "";
            if (blockchain.lendingPool) {
                const data = await blockchain.lendingPool.getAccountData(walletAddr);
                poolInfo = `- Collateral in Pool: ${formatEther(data[0])} RBTC\n` +
                           `- Debt: ${formatUnits(data[1], 6)} USDT0`;
            }

            bot.sendMessage(chatId, 
                `🤖 Bot Wallet Info (${walletAddr}):\n` +
                `- Native Balance: ${formatEther(balance)} RBTC\n` +
                poolInfo
            );
        } catch (error) {
             bot.sendMessage(chatId, `Error: ${error.message}`);
        }
    });
};
