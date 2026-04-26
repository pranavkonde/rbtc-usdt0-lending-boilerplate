const { ethers } = require('ethers');
const config = require('../config');

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
        this.wallet = new ethers.Wallet(config.privateKey, this.provider);
        
        if (config.deployments.LendingPool) {
            this.lendingPool = new ethers.Contract(
                config.deployments.LendingPool, 
                config.abis.LendingPool, 
                this.wallet
            );
        }

        if (config.deployments.MockUSDT0) {
            this.usdt0 = new ethers.Contract(
                config.deployments.MockUSDT0, 
                config.abis.ERC20, 
                this.wallet
            );
        }
    }

    getWalletAddress() {
        return this.wallet.address;
    }

    async getBalance(address) {
        return await this.provider.getBalance(address);
    }
}

module.exports = new BlockchainService();
