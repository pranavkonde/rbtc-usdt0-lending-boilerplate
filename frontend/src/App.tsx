import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LendingPoolABI from './abis/LendingPool.json';
import MockUSDT0ABI from './abis/MockUSDT0.json';
import HeaderBar from './components/HeaderBar';
import WelcomeCard from './components/WelcomeCard';
import AccountCard from './components/AccountCard';
import SupplyWithdrawCard from './components/SupplyWithdrawCard';
import BorrowRepayCard from './components/BorrowRepayCard';
import StatusMessage from './components/StatusMessage';
import { LENDING_POOL_ADDRESS, USDT0_ADDRESS, USDT0_DECIMALS } from './config/contracts';
import type { AccountData } from './types/lending';
import { formatUSDT } from './utils/format';
import './App.css';

function App() {
  const { address, isConnected } = useAccount();

  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const { data: accountDataRaw, refetch: refetchAccount } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LendingPoolABI,
    functionName: 'getAccountData',
    args: [address],
    query: {
      enabled: !!address,
    },
  });
  const accountData = accountDataRaw as AccountData | undefined;

  const { data: usdtBalanceRaw, refetch: refetchUsdt } = useReadContract({
    address: USDT0_ADDRESS,
    abi: MockUSDT0ABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const { data: usdtAllowanceRaw, refetch: refetchAllowance } = useReadContract({
    address: USDT0_ADDRESS,
    abi: MockUSDT0ABI,
    functionName: 'allowance',
    args: [address, LENDING_POOL_ADDRESS],
    query: {
      enabled: !!address,
    },
  });

  const { data: rbtcBalance, refetch: refetchRbtc } = useBalance({
    address,
  });

  const usdtBalance = usdtBalanceRaw as bigint | undefined;
  const usdtAllowance = usdtAllowanceRaw as bigint | undefined;

  const {
    writeContract: writeDeposit,
    data: depositHash,
    isPending: isDepositPending,
    error: depositError,
  } = useWriteContract();

  const {
    writeContract: writeWithdraw,
    data: withdrawHash,
    isPending: isWithdrawPending,
    error: withdrawError,
  } = useWriteContract();

  const {
    writeContract: writeBorrow,
    data: borrowHash,
    isPending: isBorrowPending,
    error: borrowError,
  } = useWriteContract();

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
    error: approveError,
  } = useWriteContract();

  const {
    writeContract: writeRepay,
    data: repayHash,
    isPending: isRepayPending,
    error: repayError,
  } = useWriteContract();

  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } =
    useWaitForTransactionReceipt({ hash: depositHash });

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawConfirmed } =
    useWaitForTransactionReceipt({ hash: withdrawHash });

  const { isLoading: isBorrowConfirming, isSuccess: isBorrowConfirmed } =
    useWaitForTransactionReceipt({ hash: borrowHash });

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: isRepayConfirming, isSuccess: isRepayConfirmed } =
    useWaitForTransactionReceipt({ hash: repayHash });

  const [lastAction, setLastAction] = useState<
    'deposit' | 'withdraw' | 'borrow' | 'approve' | 'repay' | null
  >(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (
      isDepositConfirmed ||
      isWithdrawConfirmed ||
      isBorrowConfirmed ||
      isApproveConfirmed ||
      isRepayConfirmed
    ) {
      refetchAccount().catch(console.error);
      refetchUsdt().catch(console.error);
      refetchAllowance().catch(console.error);
      refetchRbtc().catch(console.error);
    }
  }, [
    isApproveConfirmed,
    isBorrowConfirmed,
    isDepositConfirmed,
    isRepayConfirmed,
    isWithdrawConfirmed,
    refetchAccount,
    refetchAllowance,
    refetchUsdt,
    refetchRbtc,
  ]);

  const handleDeposit = useCallback(() => {
    const trimmed = depositAmount.trim();
    if (!trimmed) return;

    setValidationError(null);

    if (parseFloat(trimmed) <= 0) {
      setValidationError('Amount must be greater than zero.');
      return;
    }

    try {
      const value = parseEther(trimmed);
      setLastAction('deposit');
      writeDeposit({
        address: LENDING_POOL_ADDRESS,
        abi: LendingPoolABI,
        functionName: 'depositRBTC',
        value,
      });
    } catch {
      setValidationError('Enter a valid RBTC amount.');
    }
  }, [depositAmount, writeDeposit]);

  const handleWithdraw = useCallback(() => {
    const trimmed = withdrawAmount.trim();
    if (!trimmed) return;

    setValidationError(null);

    if (parseFloat(trimmed) <= 0) {
      setValidationError('Amount must be greater than zero.');
      return;
    }

    try {
      const value = parseEther(trimmed);
      setLastAction('withdraw');
      writeWithdraw({
        address: LENDING_POOL_ADDRESS,
        abi: LendingPoolABI,
        functionName: 'withdrawRBTC',
        args: [value],
      });
    } catch {
      setValidationError('Enter a valid RBTC amount.');
    }
  }, [withdrawAmount, writeWithdraw]);

  const handleBorrow = useCallback(() => {
    const trimmed = borrowAmount.trim();
    if (!trimmed) return;

    setValidationError(null);

    if (parseFloat(trimmed) <= 0) {
      setValidationError('Amount must be greater than zero.');
      return;
    }

    try {
      const value = parseUnits(trimmed, USDT0_DECIMALS);
      setLastAction('borrow');
      writeBorrow({
        address: LENDING_POOL_ADDRESS,
        abi: LendingPoolABI,
        functionName: 'borrowUSDT0',
        args: [value],
      });
    } catch {
      setValidationError('Enter a valid USDT0 amount.');
    }
  }, [borrowAmount, writeBorrow]);

  const handleApprove = useCallback(() => {
    const trimmed = repayAmount.trim();
    if (!trimmed) return;

    setValidationError(null);

    if (parseFloat(trimmed) <= 0) {
      setValidationError('Amount must be greater than zero.');
      return;
    }

    try {
      const value = parseUnits(trimmed, USDT0_DECIMALS);
      setLastAction('approve');
      writeApprove({
        address: USDT0_ADDRESS,
        abi: MockUSDT0ABI,
        functionName: 'approve',
        args: [LENDING_POOL_ADDRESS, value],
      });
    } catch {
      setValidationError('Enter a valid USDT0 amount.');
    }
  }, [repayAmount, writeApprove]);

  const handleRepay = useCallback(() => {
    const trimmed = repayAmount.trim();
    if (!trimmed) return;

    setValidationError(null);

    if (parseFloat(trimmed) <= 0) {
      setValidationError('Amount must be greater than zero.');
      return;
    }

    try {
      const value = parseUnits(trimmed, USDT0_DECIMALS);
      setLastAction('repay');
      writeRepay({
        address: LENDING_POOL_ADDRESS,
        abi: LendingPoolABI,
        functionName: 'repayUSDT0',
        args: [value],
      });
    } catch {
      setValidationError('Enter a valid USDT0 amount.');
    }
  }, [repayAmount, writeRepay]);

  const {
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useMemo(() => {
    const states = {
      approve: {
        isPending: isApprovePending,
        isConfirming: isApproveConfirming,
        isConfirmed: isApproveConfirmed,
        error: approveError,
      },
      borrow: {
        isPending: isBorrowPending,
        isConfirming: isBorrowConfirming,
        isConfirmed: isBorrowConfirmed,
        error: borrowError,
      },
      deposit: {
        isPending: isDepositPending,
        isConfirming: isDepositConfirming,
        isConfirmed: isDepositConfirmed,
        error: depositError,
      },
      repay: {
        isPending: isRepayPending,
        isConfirming: isRepayConfirming,
        isConfirmed: isRepayConfirmed,
        error: repayError,
      },
      withdraw: {
        isPending: isWithdrawPending,
        isConfirming: isWithdrawConfirming,
        isConfirmed: isWithdrawConfirmed,
        error: withdrawError,
      },
    } as const;

    if (!lastAction) {
      return {
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        error: null as unknown as Error | null,
      };
    }

    return states[lastAction];
  }, [
    approveError,
    isApproveConfirmed,
    isApproveConfirming,
    isApprovePending,
    borrowError,
    isBorrowConfirmed,
    isBorrowConfirming,
    isBorrowPending,
    depositError,
    isDepositConfirmed,
    isDepositConfirming,
    isDepositPending,
    lastAction,
    repayError,
    isRepayConfirmed,
    isRepayConfirming,
    isRepayPending,
    withdrawError,
    isWithdrawConfirmed,
    isWithdrawConfirming,
    isWithdrawPending,
  ]);

  const { statusMessage, statusVariant } = useMemo(() => {
    if (validationError) {
      return {
        statusMessage: validationError,
        statusVariant: 'error' as const,
      };
    }

    if (isPending) {
      return {
        statusMessage: 'Transaction pending in wallet...',
        statusVariant: 'pending' as const,
      };
    }

    if (isConfirming) {
      return {
        statusMessage: 'Waiting for blockchain confirmation...',
        statusVariant: 'confirming' as const,
      };
    }

    if (isConfirmed) {
      return {
        statusMessage: 'Transaction confirmed successfully!',
        statusVariant: 'success' as const,
      };
    }

    if (error) {
      console.error('Contract Error:', error);
      
      let message = 'Transaction failed.';
      
      if (error instanceof Error) {
        message = error.message;
        
        if (message.includes('Internal server error')) {
          message = 'Simulation failed. Check if you have enough RBTC for gas and have deposited collateral.';
          if (rbtcBalance?.value === 0n) {
            message = 'Simulation failed: Your RBTC balance is 0. Please get test tokens from the Rootstock faucet.';
          }
        } else if (message.includes('insufficient funds')) {
          message = 'Insufficient RBTC for gas + transaction value.';
        } else if (message.includes('User rejected')) {
          message = 'Transaction rejected in wallet.';
        } else if (message.includes('execution reverted')) {
          const match = message.match(/reverted with the following reason:\s*(.*)/);
          if (match) {
            const reason = match[1];
            if (reason === 'PRICE_NOT_SET') {
              message = 'Contract Error: Oracle prices are not set. Please set prices in the Oracle contract.';
            } else if (reason === 'INSUFFICIENT_COLLATERAL') {
              message = 'Contract Error: Insufficient collateral. Deposit more RBTC first.';
            } else {
              message = `Contract Revert: ${reason}`;
            }
          }
        }
      }

      return {
        statusMessage: message,
        statusVariant: 'error' as const,
      };
    }

    return {
      statusMessage: '',
      statusVariant: 'pending' as const,
    };
  }, [error, isConfirmed, isConfirming, isPending, rbtcBalance?.value, validationError]);

  return (
    <div>
      <HeaderBar />

      {!isConnected && <WelcomeCard />}

      {isConnected && (
        <div className="layout-column">
          <AccountCard 
            accountData={accountData} 
            usdtBalance={usdtBalance} 
            rbtcBalance={rbtcBalance?.value}
          />

          <div className="grid-2">
            <SupplyWithdrawCard
              depositAmount={depositAmount}
              withdrawAmount={withdrawAmount}
              onChangeDepositAmount={setDepositAmount}
              onChangeWithdrawAmount={setWithdrawAmount}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              isLoading={isDepositPending || isWithdrawPending}
            />

            <BorrowRepayCard
              borrowAmount={borrowAmount}
              repayAmount={repayAmount}
              onChangeBorrowAmount={setBorrowAmount}
              onChangeRepayAmount={setRepayAmount}
              onBorrow={handleBorrow}
              onApprove={handleApprove}
              onRepay={handleRepay}
              isLoading={isBorrowPending || isApprovePending || isRepayPending}
              currentAllowance={usdtAllowance}
              formatUSDT={formatUSDT}
            />
          </div>

          <StatusMessage message={statusMessage} variant={statusVariant} />
        </div>
      )}
    </div>
  );
}

export default App;
