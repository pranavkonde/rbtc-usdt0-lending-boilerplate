import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { Header } from './components/Header'
import { HealthCard } from './components/HealthCard'
import { ActionCards } from './components/ActionCards'
import { StatsGrid } from './components/StatsGrid'
import { Footer } from './components/Footer'
import { Wallet, Zap, Shield, TrendingUp } from 'lucide-react'

function WelcomeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF6B00] to-[#FBB040] flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/30"
      >
        <Wallet className="w-12 h-12 text-[#0D1117]" />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        Welcome to <span className="text-gradient">RSK Lending</span>
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-rsk-muted text-lg max-w-lg mb-12"
      >
        Connect your wallet to deposit RBTC as collateral and borrow USDT0 on Rootstock's secure Bitcoin-powered network.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl"
      >
        {[
          { icon: Shield, title: 'Secure', desc: 'Built on Bitcoin security' },
          { icon: Zap, title: 'Fast', desc: 'Quick transactions' },
          { icon: TrendingUp, title: 'Efficient', desc: '70% LTV ratio' },
        ].map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B00]/20 to-[#FBB040]/20 flex items-center justify-center mb-4 mx-auto">
              <item.icon className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <h3 className="font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-rsk-muted">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthCard />
        <ActionCards />
      </div>
    </motion.div>
  )
}

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen flex flex-col bg-noise">
      <Header />

      <main className="flex-1 pt-28 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {isConnected ? <Dashboard /> : <WelcomeScreen />}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
