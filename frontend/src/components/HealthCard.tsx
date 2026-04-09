import { motion } from 'framer-motion'
import { Activity, TrendingUp, TrendingDown, Shield, AlertTriangle } from 'lucide-react'
import { useAccountData, useLtvBps } from '../hooks/useLendingPool'
import { formatUSD, formatRBTC, formatUSDT0, formatHealthFactor, getHealthFactorStatus, cn } from '../lib/utils'

export function HealthCard() {
  const { data: accountData, isLoading } = useAccountData()
  const { data: ltvBps } = useLtvBps()

  const collRbtcWei = accountData?.[0] || BigInt(0)
  const debtUsdt0 = accountData?.[1] || BigInt(0)
  const collUsdE18 = accountData?.[2] || BigInt(0)
  const debtUsdE18 = accountData?.[3] || BigInt(0)
  const maxDebtUsdE18 = accountData?.[4] || BigInt(0)
  const healthFactorE18 = accountData?.[5] || BigInt(0)

  const healthStatus = getHealthFactorStatus(healthFactorE18)
  const ltv = ltvBps ? Number(ltvBps) / 100 : 70

  const StatusIcon = healthStatus === 'excellent' || healthStatus === 'good' ? Shield : AlertTriangle

  const healthColors = {
    excellent: 'from-emerald-500 to-green-400',
    good: 'from-green-400 to-lime-400',
    warning: 'from-yellow-500 to-orange-400',
    danger: 'from-red-500 to-rose-400',
  }

  const healthBg = {
    excellent: 'bg-emerald-500/10 border-emerald-500/30',
    good: 'bg-green-500/10 border-green-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    danger: 'bg-red-500/10 border-red-500/30',
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-rsk-light rounded w-1/3"></div>
          <div className="h-24 bg-rsk-light rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-rsk-light rounded"></div>
            <div className="h-16 bg-rsk-light rounded"></div>
            <div className="h-16 bg-rsk-light rounded"></div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-[#FF6B00]/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FBB040]">
              <Activity className="w-5 h-5 text-[#0D1117]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Loan Health</h2>
              <p className="text-sm text-rsk-muted">Your position overview</p>
            </div>
          </div>
          <div className={cn('px-3 py-1.5 rounded-full flex items-center gap-2 border', healthBg[healthStatus])}>
            <StatusIcon className={cn('w-4 h-4', `health-${healthStatus}`)} />
            <span className={cn('text-sm font-medium capitalize', `health-${healthStatus}`)}>
              {healthStatus}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-end gap-2 mb-2">
            <motion.span
              key={formatHealthFactor(healthFactorE18)}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn('text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent', healthColors[healthStatus])}
            >
              {formatHealthFactor(healthFactorE18)}
            </motion.span>
            {healthFactorE18 !== BigInt(0) && healthFactorE18 !== BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935') && (
              <span className="text-rsk-muted text-lg mb-1">Health Factor</span>
            )}
          </div>
          <p className="text-rsk-muted text-sm">
            {healthStatus === 'danger' 
              ? 'Your position is at risk of liquidation!' 
              : healthStatus === 'warning'
              ? 'Consider adding more collateral'
              : 'Your position is healthy'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-rsk-dark/50 border border-rsk-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-rsk-muted">Collateral</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatUSD(collUsdE18)}</p>
            <p className="text-xs text-rsk-muted mt-1">
              {parseFloat(formatRBTC(collRbtcWei)).toFixed(6)} RBTC
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-rsk-dark/50 border border-rsk-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-rsk-muted">Debt</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatUSD(debtUsdE18)}</p>
            <p className="text-xs text-rsk-muted mt-1">
              {parseFloat(formatUSDT0(debtUsdt0)).toFixed(2)} USDT0
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-rsk-dark/50 border border-rsk-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#FBB040]" />
              <span className="text-sm text-rsk-muted">Borrow Capacity</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatUSD(maxDebtUsdE18)}</p>
            <p className="text-xs text-rsk-muted mt-1">
              LTV: {ltv}%
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
