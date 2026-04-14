const blockchain = require('../services/blockchain');
const config = require('../config');
const { parseEther, parseUnits } = require('../utils/formatters');

module.exports = (bot) => {
    bot.onText(/\/deposit(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const amount = match[1];

        if (!amount) {
            bot.sendMessage(chatId, "⚠️ Usage: /deposit <amount>\nExample: /deposit 0.001");
            return;
        }
    
        try {
            if (!blockchain.lendingPool) {
                bot.sendMessage(chatId, "LendingPool contract not initialized.");
                return;
            }

            bot.sendMessage(chatId, `⏳ Depositing ${amount} RBTC...`);
            
            const nonce = await blockchain.provider.getTransactionCount(blockchain.getWalletAddress());

            const tx = await blockchain.lendingPool.depositRBTC({ 
                value: parseEther(amount),
                nonce: nonce
            });
            await tx.wait();
    
            bot.sendMessage(chatId, `✅ Deposit successful!\nTx Hash: ${tx.hash}`);
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `❌ Deposit failed: ${error.message}`);
        }
    });
    
    bot.onText(/\/borrow(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const amount = match[1];

        if (!amount) {
            bot.sendMessage(chatId, "⚠️ Usage: /borrow <amount>\nExample: /borrow 10");
            return;
        }
    
        try {
            if (!blockchain.lendingPool) {
                bot.sendMessage(chatId, "LendingPool contract not initialized.");
                return;
            }

            bot.sendMessage(chatId, `⏳ Borrowing ${amount} USDT0...`);
            
            const amountWei = parseUnits(amount, 6);
            
            const nonce = await blockchain.provider.getTransactionCount(blockchain.getWalletAddress());
            const tx = await blockchain.lendingPool.borrowUSDT0(amountWei, { nonce: nonce });
            await tx.wait();
    
            bot.sendMessage(chatId, `✅ Borrow successful!\nTx Hash: ${tx.hash}`);
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `❌ Borrow failed: ${error.message}`);
        }
    });
    
    bot.onText(/\/repay(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const amount = match[1];

        if (!amount) {
            bot.sendMessage(chatId, "⚠️ Usage: /repay <amount>\nExample: /repay 5");
            return;
        }
    
        try {
            if (!blockchain.lendingPool || !blockchain.usdt0) {
                bot.sendMessage(chatId, "Contracts not initialized.");
                return;
            }

            bot.sendMessage(chatId, `⏳ Repaying ${amount} USDT0...`);
            
            const amountWei = parseUnits(amount, 6);
    
            let nonce = await blockchain.provider.getTransactionCount(blockchain.getWalletAddress());
            const approveTx = await blockchain.usdt0.approve(config.deployments.LendingPool, amountWei, { nonce: nonce });
            await approveTx.wait();
    
            nonce = await blockchain.provider.getTransactionCount(blockchain.getWalletAddress());
            const tx = await blockchain.lendingPool.repayUSDT0(amountWei, { nonce: nonce });
            await tx.wait();
    
            bot.sendMessage(chatId, `✅ Repay successful!\nTx Hash: ${tx.hash}`);
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `❌ Repay failed: ${error.message}`);
        }
    });
};
