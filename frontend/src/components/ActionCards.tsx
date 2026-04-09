import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownToLine, ArrowUpFromLine, Coins, CreditCard, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useAccount, useBalance } from 'wagmi'
import { 
  useDepositRBTC, 
  useWithdrawRBTC, 
  useBorrowUSDT0, 
  useRepayUSDT0, 
  useApproveUSDT0,
  useAccountData,
  useUSDT0Balance,
  useUSDT0Allowance
} from '../hooks/useLendingPool'
import { parseRBTC, parseUSDT0, formatRBTC, formatUSDT0, cn } from '../lib/utils'

type ActionTab = 'deposit' | 'withdraw' | 'borrow' | 'repay'

function ActionInput({
  value,
  onChange,
  placeholder,
  symbol,
  onMax,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  symbol: string
  maxValue?: string
  onMax?: () => void
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pr-24"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {onMax && (
          <button
            onClick={onMax}
            className="px-2 py-1 text-xs font-medium text-[#FF6B00] hover:text-[#FBB040] transition-colors"
          >
            MAX
          </button>
        )}
        <span className="text-rsk-muted font-medium">{symbol}</span>
      </div>
    </div>
  )
}

function TransactionStatus({
  isPending,
  isConfirming,
  isSuccess,
  error,
}: {
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: Error | null
}) {
  if (!isPending && !isConfirming && !isSuccess && !error) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-4"
      >
        {isPending && (
          <div className="flex items-center gap-2 text-[#FBB040]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Waiting for wallet confirmation...</span>
          </div>
        )}
        {isConfirming && (
          <div className="flex items-center gap-2 text-[#FBB040]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Transaction pending...</span>
          </div>
        )}
        {isSuccess && (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">Transaction successful!</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="w-4 h-4" />
            <span className="text-sm truncate">{error.message.slice(0, 50)}...</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export function ActionCards() {
  const [activeTab, setActiveTab] = useState<ActionTab>('deposit')
  const [amount, setAmount] = useState('')
  
  const { address, isConnected } = useAccount()
  const { data: rbtcBalance } = useBalance({ address })
  const { data: accountData, refetch: refetchAccount } = useAccountData()
  const { data: usdt0Balance, refetch: refetchUSDT0Balance } = useUSDT0Balance()
  const { data: allowance, refetch: refetchAllowance } = useUSDT0Allowance()

  const { deposit, isPending: isDepositPending, isConfirming: isDepositConfirming, isSuccess: isDepositSuccess, error: depositError } = useDepositRBTC()
  const { withdraw, isPending: isWithdrawPending, isConfirming: isWithdrawConfirming, isSuccess: isWithdrawSuccess, error: withdrawError } = useWithdrawRBTC()
  const { borrow, isPending: isBorrowPending, isConfirming: isBorrowConfirming, isSuccess: isBorrowSuccess, error: borrowError } = useBorrowUSDT0()
  const { repay, isPending: isRepayPending, isConfirming: isRepayConfirming, isSuccess: isRepaySuccess, error: repayError } = useRepayUSDT0()
  const { approve, isPending: isApprovePending, isConfirming: isApproveConfirming, isSuccess: isApproveSuccess, error: approveError } = useApproveUSDT0()

  const collRbtcWei = accountData?.[0] || BigInt(0)
  const debtUsdt0 = accountData?.[1] || BigInt(0)

  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess || isBorrowSuccess || isRepaySuccess) {
      setAmount('')
      refetchAccount()
      refetchUSDT0Balance()
    }
  }, [isDepositSuccess, isWithdrawSuccess, isBorrowSuccess, isRepaySuccess])

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance()
    }
  }, [isApproveSuccess])

  const tabs = [
    { id: 'deposit' as const, label: 'Deposit', icon: ArrowDownToLine, color: 'from-emerald-500 to-green-400' },
    { id: 'withdraw' as const, label: 'Withdraw', icon: ArrowUpFromLine, color: 'from-blue-500 to-cyan-400' },
    { id: 'borrow' as const, label: 'Borrow', icon: Coins, color: 'from-purple-500 to-pink-400' },
    { id: 'repay' as const, label: 'Repay', icon: CreditCard, color: 'from-orange-500 to-yellow-400' },
  ]

  const handleAction = () => {
    if (!amount || parseFloat(amount) <= 0) return

    switch (activeTab) {
      case 'deposit':
        deposit(parseRBTC(amount))
        break
      case 'withdraw':
        withdraw(parseRBTC(amount))
        break
      case 'borrow':
        borrow(parseUSDT0(amount))
        break
      case 'repay':
        const repayAmount = parseUSDT0(amount)
        const currentAllowance = allowance || BigInt(0)
        if (currentAllowance < repayAmount) {
          approve(repayAmount)
        } else {
          repay(repayAmount)
        }
        break
    }
  }

  const getMaxValue = () => {
    switch (activeTab) {
      case 'deposit':
        return rbtcBalance ? formatRBTC(rbtcBalance.value) : '0'
      case 'withdraw':
        return formatRBTC(collRbtcWei)
      case 'borrow':
        return '0'
      case 'repay':
        const balance = usdt0Balance || BigInt(0)
        const debt = debtUsdt0
        return formatUSDT0(balance < debt ? balance : debt)
      default:
        return '0'
    }
  }

  const isLoading = isDepositPending || isDepositConfirming || isWithdrawPending || isWithdrawConfirming ||
                    isBorrowPending || isBorrowConfirming || isRepayPending || isRepayConfirming ||
                    isApprovePending || isApproveConfirming

  const getCurrentStatus = () => {
    switch (activeTab) {
      case 'deposit':
        return { isPending: isDepositPending, isConfirming: isDepositConfirming, isSuccess: isDepositSuccess, error: depositError }
      case 'withdraw':
        return { isPending: isWithdrawPending, isConfirming: isWithdrawConfirming, isSuccess: isWithdrawSuccess, error: withdrawError }
      case 'borrow':
        return { isPending: isBorrowPending, isConfirming: isBorrowConfirming, isSuccess: isBorrowSuccess, error: borrowError }
      case 'repay':
        return { 
          isPending: isRepayPending || isApprovePending, 
          isConfirming: isRepayConfirming || isApproveConfirming, 
          isSuccess: isRepaySuccess, 
          error: repayError || approveError 
        }
      default:
        return { isPending: false, isConfirming: false, isSuccess: false, error: null }
    }
  }

  const status = getCurrentStatus()
  const needsApproval = activeTab === 'repay' && amount && (allowance || BigInt(0)) < parseUSDT0(amount)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setAmount(''); }}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap',
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                : 'bg-rsk-light text-rsk-muted hover:text-white border border-rsk-border'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'deposit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rsk-text mb-2">Amount to Deposit</label>
                <ActionInput
                  value={amount}
                  onChange={setAmount}
                  placeholder="0.0"
                  symbol="RBTC"
                  maxValue={getMaxValue()}
                  onMax={() => setAmount(getMaxValue())}
                />
                <p className="text-xs text-rsk-muted mt-2">
                  Balance: {rbtcBalance ? parseFloat(formatRBTC(rbtcBalance.value)).toFixed(6) : '0'} RBTC
                </p>
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rsk-text mb-2">Amount to Withdraw</label>
                <ActionInput
                  value={amount}
                  onChange={setAmount}
                  placeholder="0.0"
                  symbol="RBTC"
                  maxValue={getMaxValue()}
                  onMax={() => setAmount(getMaxValue())}
                />
                <p className="text-xs text-rsk-muted mt-2">
                  Deposited: {parseFloat(formatRBTC(collRbtcWei)).toFixed(6)} RBTC
                </p>
              </div>
            </div>
          )}

          {activeTab === 'borrow' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rsk-text mb-2">Amount to Borrow</label>
                <ActionInput
                  value={amount}
                  onChange={setAmount}
                  placeholder="0.0"
                  symbol="USDT0"
                />
                <p className="text-xs text-rsk-muted mt-2">
                  Current Debt: {parseFloat(formatUSDT0(debtUsdt0)).toFixed(2)} USDT0
                </p>
              </div>
            </div>
          )}

          {activeTab === 'repay' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rsk-text mb-2">Amount to Repay</label>
                <ActionInput
                  value={amount}
                  onChange={setAmount}
                  placeholder="0.0"
                  symbol="USDT0"
                  maxValue={getMaxValue()}
                  onMax={() => setAmount(getMaxValue())}
                />
                <p className="text-xs text-rsk-muted mt-2">
                  Debt: {parseFloat(formatUSDT0(debtUsdt0)).toFixed(2)} USDT0 | 
                  Balance: {usdt0Balance ? parseFloat(formatUSDT0(usdt0Balance)).toFixed(2) : '0'} USDT0
                </p>
              </div>
            </div>
          )}

          <motion.button
            onClick={handleAction}
            disabled={!isConnected || isLoading || !amount || parseFloat(amount) <= 0}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : needsApproval ? (
              'Approve USDT0'
            ) : (
              <>
                {tabs.find(t => t.id === activeTab)?.icon && (
                  <span className="w-5 h-5">
                    {(() => {
                      const Icon = tabs.find(t => t.id === activeTab)?.icon
                      return Icon ? <Icon className="w-5 h-5" /> : null
                    })()}
                  </span>
                )}
                {tabs.find(t => t.id === activeTab)?.label}
              </>
            )}
          </motion.button>

          <TransactionStatus {...status} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
