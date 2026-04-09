export const LENDING_POOL_ADDRESS =
  (import.meta.env.VITE_LENDING_POOL_ADDRESS as `0x${string}`) ||
  '0x65eB9d654c7170bD2b1fB1070437DF5CC5E8da01';

export const USDT0_ADDRESS =
  (import.meta.env.VITE_USDT0_ADDRESS as `0x${string}`) ||
  '0xad28C3C13a14baFD41B38633E4dE5f71F56C2FA5';

/** Optional: used by tooling or future UI that reads oracle address */
export const ORACLE_ADDRESS =
  (import.meta.env.VITE_ORACLE_ADDRESS as `0x${string}`) ||
  '0xf9C3D70C33CBa0be571df7B9E3f0697C8ef40d69';

export const USDT0_DECIMALS = 6;
export const RBTC_DECIMALS = 18;
