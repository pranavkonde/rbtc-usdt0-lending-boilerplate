const config = require('../config');

module.exports = (bot) => {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const poolAddr = config.deployments.LendingPool || "Unknown";
        
        bot.sendMessage(chatId, 
            `Welcome to the Lending Bot! 🤖\n\n` +
            `I interact with the LendingPool contract at ${poolAddr}.\n\n` +
            `Commands:\n` +
            `/balance <address> - Check loan balance and collateral\n` +
            `/health <address> - Check health factor\n` +
            `/deposit <amount> - Deposit RBTC (Demo: uses bot wallet)\n` +
            `/borrow <amount> - Borrow USDT0 (Demo: uses bot wallet)\n` +
            `/repay <amount> - Repay USDT0 (Demo: uses bot wallet)\n` +
            `/myinfo - Check bot wallet info`
        );
    });
};
