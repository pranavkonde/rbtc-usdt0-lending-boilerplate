import { motion } from 'framer-motion'
import { Percent, DollarSign, Landmark, Sparkles } from 'lucide-react'
import { useLtvBps } from '../hooks/useLendingPool'

export function StatsGrid() {
  const { data: ltvBps } = useLtvBps()
  const ltv = ltvBps ? Number(ltvBps) / 100 : 70

  const stats = [
    {
      icon: Percent,
      label: 'Loan-to-Value',
      value: `${ltv}%`,
      description: 'Maximum borrowing power',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Landmark,
      label: 'Protocol',
      value: 'Rootstock',
      description: 'Bitcoin-powered DeFi',
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      icon: DollarSign,
      label: 'Stablecoin',
      value: 'USDT0',
      description: 'Borrow stable assets',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Sparkles,
      label: 'Collateral',
      value: 'RBTC',
      description: 'Native Bitcoin on RSK',
      gradient: 'from-blue-500 to-cyan-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="glass-card p-4 cursor-default"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
            <stat.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-sm font-medium text-rsk-text">{stat.label}</p>
          <p className="text-xs text-rsk-muted mt-1">{stat.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
