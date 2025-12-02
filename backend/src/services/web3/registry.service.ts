// Service d'ancrage sur le registre Web3 TraceGuard.
import { ethers } from 'ethers';
import { config } from '../../config/config';
import registryAbi from './registryAbi.json';

export interface AnchorPayload {
  mediaHash: string; // hex string
  metadataUri: string;
}

export class RegistryService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private signer: ethers.Signer;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.web3RpcUrl);
    const signer = ethers.Wallet.createRandom();
    this.wallet = signer.connect(this.provider);
    this.contract = new ethers.Contract(config.web3RegistryAddress, registryAbi, this.wallet);
    const signer = config.web3SignerKey
      ? new ethers.Wallet(config.web3SignerKey, this.provider)
      : ethers.Wallet.createRandom().connect(this.provider);
    this.signer = signer;
    this.contract = new ethers.Contract(config.web3RegistryAddress, registryAbi, this.signer);
  }

  async anchor(payload: AnchorPayload) {
    // Dans un contexte réel, utiliser un portefeuille dédié avec politiques de quorum.
    const tx = await this.contract.anchor(payload.mediaHash, payload.metadataUri);
    return tx.hash;
  }
}
