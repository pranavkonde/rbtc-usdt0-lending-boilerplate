const { ethers } = require('ethers');
const config = require('./src/config');
const blockchain = require('./src/services/blockchain');

async function main() {
    console.log("Using RPC:", config.rpcUrl);
    console.log("Using Wallet:", blockchain.getWalletAddress());
    
    if (!config.deployments.LendingPool) {
        console.error("LendingPool deployment not found. Please run deployment script first.");
        process.exit(1);
    }

    const lendingPool = blockchain.lendingPool;
    const usdt0 = blockchain.usdt0;
    const walletAddr = blockchain.getWalletAddress();

    console.log("Checking initial balance...");
    let data = await lendingPool.getAccountData(walletAddr);
    console.log("Initial Collateral:", ethers.formatEther(data[0]));

    console.log("Depositing 0.0001 RBTC...");
    const depositAmount = ethers.parseEther("0.0001");
    
    let nonce = await blockchain.provider.getTransactionCount(walletAddr);
    
    await (await lendingPool.depositRBTC({ value: depositAmount, nonce: nonce })).wait();
    data = await lendingPool.getAccountData(walletAddr);
    console.log("Post-Deposit Collateral:", ethers.formatEther(data[0]));

    console.log("Borrowing 1 USDT0...");
    nonce = await blockchain.provider.getTransactionCount(walletAddr);
    const borrowAmount = ethers.parseUnits("1", 6);
    await (await lendingPool.borrowUSDT0(borrowAmount, { nonce: nonce })).wait();
    data = await lendingPool.getAccountData(walletAddr);
    console.log("Post-Borrow Debt:", ethers.formatUnits(data[1], 6));

    console.log("Repaying 0.5 USDT0...");
    const repayAmount = ethers.parseUnits("0.5", 6);
    
    nonce = await blockchain.provider.getTransactionCount(walletAddr);
    await (await usdt0.approve(config.deployments.LendingPool, repayAmount, { nonce: nonce })).wait();
    
    nonce = await blockchain.provider.getTransactionCount(walletAddr);
    await (await lendingPool.repayUSDT0(repayAmount, { nonce: nonce })).wait();
    data = await lendingPool.getAccountData(walletAddr);
    console.log("Post-Repay Debt:", ethers.formatUnits(data[1], 6));

    console.log("Logic verification successful!");
}

main().catch(console.error);
