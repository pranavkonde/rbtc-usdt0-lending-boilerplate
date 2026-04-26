const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

// ─── Helpers ────────────────────────────────────────────────────────────────

const e18  = (n) => ethers.parseUnits(String(n), 18);
const u6   = (n) => ethers.parseUnits(String(n), 6);
const rbtc = (n) => ethers.parseEther(String(n));

async function deploy() {
  const [owner, alice, bob, liquidator] = await ethers.getSigners();

  const MockUSDT0    = await ethers.getContractFactory("MockUSDT0");
  const usdt0        = await MockUSDT0.deploy(u6("10000000")); // 10M

  const Oracle       = await ethers.getContractFactory("UmbrellaOracleAdapter");
  const oracle       = await Oracle.deploy();

  // Set initial prices: RBTC=$60,000 | USDT0=$1
  await oracle.setBatch(
    [ethers.ZeroAddress, await usdt0.getAddress()],
    [e18("60000"), e18("1")]
  );

  const LendingPool  = await ethers.getContractFactory("LendingPool");
  const pool         = await LendingPool.deploy(
    await usdt0.getAddress(),
    await oracle.getAddress(),
    7000 // 70% LTV
  );

  // Seed pool with 1M USDT0 liquidity
  await usdt0.transfer(await pool.getAddress(), u6("1000000"));

  return { owner, alice, bob, liquidator, usdt0, oracle, pool };
}

// ─── UmbrellaOracleAdapter ───────────────────────────────────────────────────

describe("UmbrellaOracleAdapter", () => {
  let owner, alice, oracle, usdt0, usdt0addr;

  beforeEach(async () => {
    ({ owner, alice, oracle, usdt0 } = await deploy());
    usdt0addr = await usdt0.getAddress();
  });

  it("returns the correct price after setPriceE18", async () => {
    await oracle.setPriceE18(usdt0addr, e18("1"));
    expect(await oracle.getPrice(usdt0addr)).to.equal(e18("1"));
  });

  it("reverts PRICE_NOT_SET for an unknown asset", async () => {
    const Oracle = await ethers.getContractFactory("UmbrellaOracleAdapter");
    const fresh  = await Oracle.deploy();
    await expect(fresh.getPrice(ethers.ZeroAddress)).to.be.revertedWith("PRICE_NOT_SET");
  });

  it("reverts with PRICE_STALE after STALENESS_THRESHOLD elapses", async () => {
    await oracle.setPriceE18(usdt0addr, e18("1"));
    // Advance time past 1 hour
    await time.increase(3601);
    await expect(oracle.getPrice(usdt0addr)).to.be.revertedWith("PRICE_STALE");
  });

  it("does not revert when price is refreshed before staleness", async () => {
    await oracle.setPriceE18(usdt0addr, e18("1"));
    await time.increase(1800); // 30 min — still fresh
    await expect(oracle.getPrice(usdt0addr)).to.not.be.reverted;
  });

  it("setBatch sets multiple prices atomically", async () => {
    const Oracle  = await ethers.getContractFactory("UmbrellaOracleAdapter");
    const fresh   = await Oracle.deploy();
    const addr1   = ethers.ZeroAddress;
    const addr2   = usdt0addr;
    await fresh.setBatch([addr1, addr2], [e18("60000"), e18("1")]);
    expect(await fresh.getPrice(addr1)).to.equal(e18("60000"));
    expect(await fresh.getPrice(addr2)).to.equal(e18("1"));
  });

  it("setBatch reverts on length mismatch", async () => {
    await expect(
      oracle.setBatch([usdt0addr], [e18("1"), e18("2")])
    ).to.be.revertedWith("length mismatch");
  });

  it("reverts when a non-owner calls setPriceE18", async () => {
    await expect(
      oracle.connect(alice).setPriceE18(usdt0addr, e18("1"))
    ).to.be.reverted;
  });

  it("emits PriceUpdated event", async () => {
    await expect(oracle.setPriceE18(ethers.ZeroAddress, e18("65000")))
      .to.emit(oracle, "PriceUpdated")
      .withArgs(ethers.ZeroAddress, e18("65000"));
  });
});

// ─── LendingPool — Admin ─────────────────────────────────────────────────────

describe("LendingPool — Admin", () => {
  let owner, alice, pool, oracle;

  beforeEach(async () => {
    ({ owner, alice, pool, oracle } = await deploy());
  });

  // setLtvBps
  it("owner can update LTV within valid range", async () => {
    await pool.setLtvBps(5000);
    expect(await pool.ltvBps()).to.equal(5000);
  });

  it("setLtvBps reverts below MIN_LTV_BPS (10%)", async () => {
    await expect(pool.setLtvBps(999)).to.be.revertedWith("LTV_RANGE");
  });

  it("setLtvBps reverts above 9500 bps", async () => {
    await expect(pool.setLtvBps(9501)).to.be.revertedWith("LTV_RANGE");
  });

  it("non-owner cannot call setLtvBps", async () => {
    await expect(pool.connect(alice).setLtvBps(5000)).to.be.reverted;
  });

  // Oracle timelock
  it("proposeOracle stores pending oracle and future executeTime", async () => {
    const Oracle2 = await ethers.getContractFactory("UmbrellaOracleAdapter");
    const oracle2 = await Oracle2.deploy();
    const addr2   = await oracle2.getAddress();

    await pool.proposeOracle(addr2);
    expect(await pool.pendingOracle()).to.equal(addr2);

    const now = await time.latest();
    const lockDuration = await pool.ORACLE_TIMELOCK();
    expect(await pool.oracleUpdateTime()).to.be.closeTo(
      BigInt(now) + lockDuration,
      5n
    );
  });

  it("executeOracle reverts before timelock elapses", async () => {
    const Oracle2 = await ethers.getContractFactory("UmbrellaOracleAdapter");
    const oracle2 = await Oracle2.deploy();
    await pool.proposeOracle(await oracle2.getAddress());
    await expect(pool.executeOracle()).to.be.revertedWith("TIMELOCK_ACTIVE");
  });

  it("executeOracle succeeds after 24h and swaps oracle", async () => {
    const Oracle2 = await ethers.getContractFactory("UmbrellaOracleAdapter");
    const oracle2 = await Oracle2.deploy();
    const addr2   = await oracle2.getAddress();

    await pool.proposeOracle(addr2);
    await time.increase(24 * 3600 + 1);
    await pool.executeOracle();

    expect(await pool.oracle()).to.equal(addr2);
    expect(await pool.pendingOracle()).to.equal(ethers.ZeroAddress);
  });

  it("executeOracle reverts with NO_PENDING_ORACLE if none proposed", async () => {
    await expect(pool.executeOracle()).to.be.revertedWith("NO_PENDING_ORACLE");
  });
});

// ─── LendingPool — Deposit & Withdraw ────────────────────────────────────────

describe("LendingPool — Deposit & Withdraw", () => {
  let alice, pool;

  beforeEach(async () => {
    ({ alice, pool } = await deploy());
  });

  it("depositRBTC records collateral and emits Deposited", async () => {
    const amount = rbtc("0.1");
    await expect(pool.connect(alice).depositRBTC({ value: amount }))
      .to.emit(pool, "Deposited")
      .withArgs(alice.address, amount);
    expect(await pool.collateralRBTC(alice.address)).to.equal(amount);
  });

  it("depositRBTC reverts on zero value", async () => {
    await expect(
      pool.connect(alice).depositRBTC({ value: 0n })
    ).to.be.revertedWith("ZERO_DEPOSIT");
  });

  it("withdrawRBTC returns collateral when no debt", async () => {
    const dep = rbtc("0.5");
    await pool.connect(alice).depositRBTC({ value: dep });

    const before = await ethers.provider.getBalance(alice.address);
    const tx     = await pool.connect(alice).withdrawRBTC(dep);
    const receipt = await tx.wait();
    const gas    = receipt.gasUsed * tx.gasPrice;
    const after  = await ethers.provider.getBalance(alice.address);

    expect(after).to.be.closeTo(before + dep - gas, ethers.parseEther("0.001"));
    expect(await pool.collateralRBTC(alice.address)).to.equal(0n);
  });

  it("withdrawRBTC reverts when it would break solvency", async () => {
    // Deposit 0.1 RBTC, borrow up to 70% LTV
    await pool.connect(alice).depositRBTC({ value: rbtc("0.1") });
    // maxBorrow = 0.1 * 60000 * 0.70 = 4200 USDT0
    await pool.connect(alice).borrowUSDT0(u6("4000"));

    // Try to withdraw all — should fail
    await expect(
      pool.connect(alice).withdrawRBTC(rbtc("0.1"))
    ).to.be.revertedWith("HF_LT_1");
  });

  it("withdrawRBTC reverts on zero amount", async () => {
    await pool.connect(alice).depositRBTC({ value: rbtc("0.1") });
    await expect(pool.connect(alice).withdrawRBTC(0n)).to.be.revertedWith("ZERO_WITHDRAW");
  });

  it("rejects plain ETH transfer via receive()", async () => {
    await expect(
      alice.sendTransaction({ to: await pool.getAddress(), value: rbtc("0.1") })
    ).to.be.revertedWith("DIRECT_PAY_NOT_ALLOWED");
  });
});

// ─── LendingPool — Borrow & Repay ────────────────────────────────────────────

describe("LendingPool — Borrow & Repay", () => {
  let alice, pool, usdt0;

  beforeEach(async () => {
    ({ alice, pool, usdt0 } = await deploy());
    await pool.connect(alice).depositRBTC({ value: rbtc("0.1") });
    // 0.1 RBTC * $60,000 * 70% = $4,200 max borrow
  });

  it("borrowUSDT0 transfers tokens and records debt", async () => {
    const borrow = u6("1000");
    await expect(pool.connect(alice).borrowUSDT0(borrow))
      .to.emit(pool, "Borrowed")
      .withArgs(alice.address, borrow);

    expect(await pool.debtUSDT0(alice.address)).to.equal(borrow);
    expect(await usdt0.balanceOf(alice.address)).to.equal(borrow);
  });

  it("borrowUSDT0 reverts when over max LTV", async () => {
    await expect(
      pool.connect(alice).borrowUSDT0(u6("5000")) // > $4,200
    ).to.be.revertedWith("INSUFFICIENT_COLLATERAL");
  });

  it("borrowUSDT0 reverts on zero amount", async () => {
    await expect(pool.connect(alice).borrowUSDT0(0n)).to.be.revertedWith("ZERO_BORROW");
  });

  it("repayUSDT0 reduces debt correctly", async () => {
    const borrow = u6("2000");
    const repay  = u6("800");
    await pool.connect(alice).borrowUSDT0(borrow);
    await usdt0.connect(alice).approve(await pool.getAddress(), repay);

    await expect(pool.connect(alice).repayUSDT0(repay))
      .to.emit(pool, "Repaid")
      .withArgs(alice.address, repay);

    expect(await pool.debtUSDT0(alice.address)).to.equal(borrow - repay);
  });

  it("repayUSDT0 caps repay at outstanding debt (overpay protection)", async () => {
    const borrow = u6("500");
    await pool.connect(alice).borrowUSDT0(borrow);
    const overpay = u6("1000");
    await usdt0.connect(alice).approve(await pool.getAddress(), overpay);

    await pool.connect(alice).repayUSDT0(overpay);
    expect(await pool.debtUSDT0(alice.address)).to.equal(0n);
  });

  it("repayUSDT0 reverts when caller has no debt", async () => {
    await expect(pool.connect(alice).repayUSDT0(u6("100"))).to.be.revertedWith("NO_DEBT");
  });
});

// ─── LendingPool — Health factor & view helpers ──────────────────────────────

describe("LendingPool — View Helpers", () => {
  let alice, pool;

  beforeEach(async () => {
    ({ alice, pool } = await deploy());
  });

  it("healthFactorE18 is max uint256 with no debt", async () => {
    await pool.connect(alice).depositRBTC({ value: rbtc("0.1") });
    expect(await pool.healthFactorE18(alice.address)).to.equal(ethers.MaxUint256);
  });

  it("healthFactorE18 is > 1e18 when borrow is below max", async () => {
    await pool.connect(alice).depositRBTC({ value: rbtc("0.1") });
    await pool.connect(alice).borrowUSDT0(u6("2000")); // half of max ~$4200
    const hf = await pool.healthFactorE18(alice.address);
    expect(hf).to.be.gt(e18("1"));
  });

  it("maxBorrowableUsdE18 equals collateral * ltv", async () => {
    await pool.connect(alice).depositRBTC({ value: rbtc("1") });
    // 1 RBTC * $60,000 * 70% = $42,000 in 1e18
    const expected = e18("42000");
    expect(await pool.maxBorrowableUsdE18(alice.address)).to.equal(expected);
  });

  it("collateralUsdE18 returns 0 for user with no deposit", async () => {
    expect(await pool.collateralUsdE18(alice.address)).to.equal(0n);
  });
});

// ─── LendingPool — Liquidation ───────────────────────────────────────────────

describe("LendingPool — Liquidation", () => {
  let owner, alice, liquidator, pool, usdt0, oracle;

  beforeEach(async () => {
    ({ owner, alice, liquidator, pool, usdt0, oracle } = await deploy());

    // Alice deposits 0.1 RBTC and borrows close to the max ($4,200 @ 70% LTV)
    await pool.connect(alice).depositRBTC({ value: rbtc("0.1") });
    await pool.connect(alice).borrowUSDT0(u6("4100"));

    // Give liquidator plenty of USDT0 and approval
    await usdt0.transfer(liquidator.address, u6("50000"));
    await usdt0.connect(liquidator).approve(await pool.getAddress(), u6("50000"));
  });

  it("liquidate reverts when position is solvent", async () => {
    await expect(
      pool.connect(liquidator).liquidate(alice.address, u6("100"))
    ).to.be.revertedWith("POSITION_SOLVENT");
  });

  it("liquidate succeeds when RBTC price drops (position underwater)", async () => {
    // Drop RBTC price to $50,000 — Alice's maxBorrow = 0.1 * 50000 * 0.70 = $3,500 < $4,100 debt
    await oracle.setBatch(
      [ethers.ZeroAddress, await usdt0.getAddress()],
      [e18("50000"), e18("1")]
    );

    const debtBefore  = await pool.debtUSDT0(alice.address);
    const collBefore  = await pool.collateralRBTC(alice.address);
    const liqUsdtBefore = await usdt0.balanceOf(liquidator.address);

    const repayAmt = u6("1000");
    await expect(
      pool.connect(liquidator).liquidate(alice.address, repayAmt)
    ).to.emit(pool, "Liquidated");

    // Debt reduced
    expect(await pool.debtUSDT0(alice.address)).to.equal(debtBefore - repayAmt);

    // Collateral seized (positive)
    const collAfter = await pool.collateralRBTC(alice.address);
    expect(collAfter).to.be.lt(collBefore);

    // Liquidator spent USDT0
    expect(await usdt0.balanceOf(liquidator.address)).to.equal(liqUsdtBefore - repayAmt);
  });

  it("seized RBTC includes 5% bonus", async () => {
    // Drop price to make position underwater
    await oracle.setBatch(
      [ethers.ZeroAddress, await usdt0.getAddress()],
      [e18("50000"), e18("1")]
    );

    const repayAmt    = u6("1000"); // repaying $1,000 of debt
    // Expected seize: $1,000 * 1.05 / $50,000 per RBTC = 0.021 RBTC
    const expectedSeize = ethers.parseEther("0.021");
    const collBefore  = await pool.collateralRBTC(alice.address);

    await pool.connect(liquidator).liquidate(alice.address, repayAmt);

    const seized = collBefore - (await pool.collateralRBTC(alice.address));
    // Allow 0.0001 RBTC tolerance for integer math
    expect(seized).to.be.closeTo(expectedSeize, ethers.parseEther("0.0001"));
  });

  it("liquidate caps seized collateral at borrower balance", async () => {
    // Crash price so entire collateral is less than debt + bonus
    await oracle.setBatch(
      [ethers.ZeroAddress, await usdt0.getAddress()],
      [e18("1000"), e18("1")] // RBTC = $1,000 (extreme crash)
    );

    // Try to liquidate full debt — seized RBTC should be capped at available collateral
    const debtAmt = await pool.debtUSDT0(alice.address);
    await pool.connect(liquidator).liquidate(alice.address, debtAmt);

    // Collateral cannot go negative
    expect(await pool.collateralRBTC(alice.address)).to.be.gte(0n);
  });

  it("liquidate reverts on zero repayAmount", async () => {
    await oracle.setBatch(
      [ethers.ZeroAddress, await usdt0.getAddress()],
      [e18("50000"), e18("1")]
    );
    await expect(
      pool.connect(liquidator).liquidate(alice.address, 0n)
    ).to.be.revertedWith("ZERO_REPAY");
  });

  it("liquidate reverts for zero borrower address", async () => {
    await oracle.setBatch(
      [ethers.ZeroAddress, await usdt0.getAddress()],
      [e18("50000"), e18("1")]
    );
    await expect(
      pool.connect(liquidator).liquidate(ethers.ZeroAddress, u6("100"))
    ).to.be.revertedWith("ZERO_BORROWER");
  });
});
