import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { rootstock, rootstockTestnet } from 'wagmi/chains';
import logo from '../assets/rootstock-logo.png';

const supportedChainIds = new Set<number>([rootstock.id, rootstockTestnet.id]);

function HeaderBar() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const wrongNetwork =
    isConnected && chainId !== undefined && !supportedChainIds.has(chainId);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <img src={logo} alt="Rootstock" className="app-logo" />
          <div className="header-brand">
            <span className="header-title">RBTC Lending</span>
            <span className="header-subtitle">USDT0 on Rootstock</span>
          </div>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </header>
      {wrongNetwork && (
        <div className="network-banner" role="alert">
          You are on an unsupported network. Switch to <strong>Rootstock</strong> or{' '}
          <strong>Rootstock Testnet</strong> in your wallet (use the network control next to
          Connect, or your wallet&apos;s network menu).
        </div>
      )}
    </>
  );
}

export default HeaderBar;
