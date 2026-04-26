const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MockUSDT0 = await hre.ethers.getContractFactory("MockUSDT0");
  const initialSupply = hre.ethers.parseUnits("1000000", 6);
  const usdt0 = await MockUSDT0.deploy(initialSupply);
  await usdt0.waitForDeployment();
  const usdt0Addr = await usdt0.getAddress();
  const usdt0Decimals = await usdt0.decimals();
  console.log("MockUSDT0 deployed to:", usdt0Addr);

  const Oracle = await hre.ethers.getContractFactory("UmbrellaOracleAdapter");
  const oracle = await Oracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddr = await oracle.getAddress();
  console.log("Oracle deployed to:", oracleAddr);

  const priceRBTC = hre.ethers.parseUnits("111000", 18);
  const priceUSDT0 = hre.ethers.parseUnits("1", 18);
  await (await oracle.setBatch(
    [hre.ethers.ZeroAddress, usdt0Addr],
    [priceRBTC, priceUSDT0]
  )).wait();
  console.log("Oracle prices set");

  const LendingPool = await hre.ethers.getContractFactory("LendingPool");
  const ltvBps = 7000;
  const pool = await LendingPool.deploy(usdt0Addr, oracleAddr, ltvBps);
  await pool.waitForDeployment();
  const poolAddr = await pool.getAddress();
  console.log("LendingPool deployed to:", poolAddr);

  const seedAmount = hre.ethers.parseUnits("100000", usdt0Decimals);
  await (await usdt0.transfer(poolAddr, seedAmount)).wait();
  console.log("LendingPool seeded with USDT0");

  const deployments = {
    MockUSDT0: usdt0Addr,
    Oracle: oracleAddr,
    LendingPool: poolAddr,
    network: hre.network.name
  };

  const deploymentPath = path.join(__dirname, "../bot/deployments.json");
  
  const botDir = path.dirname(deploymentPath);
  if (!fs.existsSync(botDir)){
      fs.mkdirSync(botDir);
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
  console.log(`Deployments saved to ${deploymentPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
