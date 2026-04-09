import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'

export const rskTestnet = defineChain({
  id: 31,
  name: 'RSK Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test RBTC',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://public-node.testnet.rsk.co'],
    },
  },
  blockExplorers: {
    default: {
      name: 'RSK Testnet Explorer',
      url: 'https://explorer.testnet.rsk.co',
    },
  },
  testnet: true,
})

export const rskMainnet = defineChain({
  id: 30,
  name: 'RSK Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'RBTC',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://public-node.rsk.co'],
    },
  },
  blockExplorers: {
    default: {
      name: 'RSK Explorer',
      url: 'https://explorer.rsk.co',
    },
  },
})

export const config = createConfig({
  chains: [rskTestnet, rskMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [rskTestnet.id]: http(),
    [rskMainnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
