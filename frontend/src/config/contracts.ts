export const CONTRACT_ADDRESSES = {
  LENDING_POOL:
    import.meta.env.VITE_LENDING_POOL_ADDRESS ||
    "0xC09Fe81b40DB2a013017bc2BcFfc718A25C45Cd3",
  USDT0:
    import.meta.env.VITE_USDT0_ADDRESS ||
    "0xf7F1Fe4c7dea6401Ae4e486502832782247E7A0f",
  ORACLE:
    import.meta.env.VITE_ORACLE_ADDRESS ||
    "0xf9C3D70C33CBa0be571df7B9E3f0697C8ef40d69",
} as const;

export const USDT0_DECIMALS = 6;
export const RBTC_DECIMALS = 18;
