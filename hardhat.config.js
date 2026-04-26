require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    rskTestnet: {
      url: process.env.RSK_TESTNET_RPC || "https://rpc.testnet.rootstock.io/<YOUR-API-KEY>",
      chainId: 31,
      gasPrice: 60000000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    rskMainnet: {
      url: process.env.RSK_MAINNET_RPC || "https://rpc.rootstock.io/<YOUR-API-KEY>",
      chainId: 30,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
