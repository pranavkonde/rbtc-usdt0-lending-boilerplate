import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { LENDING_POOL_ABI } from '../abi/LendingPool'
import { ERC20_ABI } from '../abi/ERC20'
import { CONTRACT_ADDRESSES } from '../config/contracts'

export function useAccountData() {
  const { address } = useAccount()

  return useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
    abi: LENDING_POOL_ABI,
    functionName: 'getAccountData',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESSES.LENDING_POOL !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 10000,
    },
  })
}

export function useHealthFactor() {
  const { address } = useAccount()

  return useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
    abi: LENDING_POOL_ABI,
    functionName: 'healthFactorE18',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESSES.LENDING_POOL !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 10000,
    },
  })
}

export function useLtvBps() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
    abi: LENDING_POOL_ABI,
    functionName: 'ltvBps',
    query: {
      enabled: CONTRACT_ADDRESSES.LENDING_POOL !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useDepositRBTC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const deposit = (amountWei: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
      abi: LENDING_POOL_ABI,
      functionName: 'depositRBTC',
      value: amountWei,
    })
  }

  return { deposit, isPending, isConfirming, isSuccess, error, hash }
}

export function useWithdrawRBTC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const withdraw = (amountWei: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
      abi: LENDING_POOL_ABI,
      functionName: 'withdrawRBTC',
      args: [amountWei],
    })
  }

  return { withdraw, isPending, isConfirming, isSuccess, error, hash }
}

export function useBorrowUSDT0() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const borrow = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
      abi: LENDING_POOL_ABI,
      functionName: 'borrowUSDT0',
      args: [amount],
    })
  }

  return { borrow, isPending, isConfirming, isSuccess, error, hash }
}

export function useRepayUSDT0() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const repay = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
      abi: LENDING_POOL_ABI,
      functionName: 'repayUSDT0',
      args: [amount],
    })
  }

  return { repay, isPending, isConfirming, isSuccess, error, hash }
}

export function useApproveUSDT0() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const approve = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.USDT0 as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`, amount],
    })
  }

  return { approve, isPending, isConfirming, isSuccess, error, hash }
}

export function useUSDT0Allowance() {
  const { address } = useAccount()

  return useReadContract({
    address: CONTRACT_ADDRESSES.USDT0 as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESSES.USDT0 !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 5000,
    },
  })
}

export function useUSDT0Balance() {
  const { address } = useAccount()

  return useReadContract({
    address: CONTRACT_ADDRESSES.USDT0 as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESSES.USDT0 !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 10000,
    },
  })
}
