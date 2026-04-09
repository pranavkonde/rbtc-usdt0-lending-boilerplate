import { motion } from 'framer-motion'
import { Wallet, ChevronDown, ExternalLink, Copy, LogOut } from 'lucide-react'
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState } from 'react'
import { truncateAddress, formatRBTC } from '../lib/utils'
import { rskTestnet } from '../config/wagmi'

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { data: balance } = useBalance({ address })
  const [showDropdown, setShowDropdown] = useState(false)

  const isWrongNetwork = isConnected && chainId !== rskTestnet.id

  const handleConnect = () => {
    connect({ connector: injected() })
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FBB040] flex items-center justify-center">
            <span className="text-[#0D1117] font-bold text-xl">R</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-white">RSK Lending</h1>
            <p className="text-xs text-rsk-muted">DeFi on Rootstock</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {isConnected && isWrongNetwork && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm"
            >
              Wrong Network
            </motion.div>
          )}

          {!isConnected ? (
            <motion.button
              onClick={handleConnect}
              disabled={isPending}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet className="w-5 h-5" />
              {isPending ? 'Connecting...' : 'Connect Wallet'}
            </motion.button>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-rsk-light border border-rsk-border hover:border-[#FF6B00]/50 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FBB040] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#0D1117]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{truncateAddress(address!)}</p>
                  <p className="text-xs text-rsk-muted">
                    {balance ? `${parseFloat(formatRBTC(balance.value)).toFixed(4)} tRBTC` : '0 tRBTC'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-rsk-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </motion.button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl glass-card border border-rsk-border overflow-hidden"
                >
                  <button
                    onClick={copyAddress}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rsk-light transition-colors text-left"
                  >
                    <Copy className="w-4 h-4 text-rsk-muted" />
                    <span className="text-sm text-rsk-text">Copy Address</span>
                  </button>
                  <a
                    href={`https://explorer.testnet.rsk.co/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rsk-light transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-rsk-muted" />
                    <span className="text-sm text-rsk-text">View on Explorer</span>
                  </a>
                  <button
                    onClick={() => { disconnect(); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rsk-light transition-colors text-left border-t border-rsk-border"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">Disconnect</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
