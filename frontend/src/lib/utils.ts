import { formatUnits, parseUnits } from 'viem'

export function formatRBTC(value: bigint): string {
  return formatUnits(value, 18)
}

export function formatUSDT0(value: bigint): string {
  return formatUnits(value, 6)
}

export function formatUSD(value: bigint): string {
  const num = parseFloat(formatUnits(value, 18))
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatHealthFactor(value: bigint): string {
  if (value === BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935')) {
    return '∞'
  }
  const num = parseFloat(formatUnits(value, 18))
  return num.toFixed(2)
}

export function getHealthFactorStatus(value: bigint): 'excellent' | 'good' | 'warning' | 'danger' {
  if (value === BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935')) {
    return 'excellent'
  }
  const num = parseFloat(formatUnits(value, 18))
  if (num >= 2) return 'excellent'
  if (num >= 1.5) return 'good'
  if (num >= 1.1) return 'warning'
  return 'danger'
}

export function parseRBTC(value: string): bigint {
  try {
    return parseUnits(value || '0', 18)
  } catch {
    return BigInt(0)
  }
}

export function parseUSDT0(value: string): bigint {
  try {
    return parseUnits(value || '0', 6)
  } catch {
    return BigInt(0)
  }
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
