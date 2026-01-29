import type { IAbi } from "./abi.type";
import type { HexString } from "./hexstring.type";

interface ISendTransactionParams {
  contractAddress: HexString;
  contractAbi: IAbi;
  functionName: string;
  gas?: number;
  args: any[];
}

/**
 * Abstracted signer interface that works with more than one
 * client-side ethereum library (like ethersjs or viem)
 */
export interface ISigner {
  /**
   * Signer address
   */
  address: HexString;
  /**
   * Chain id of the network the signer is connected to
   */
  getChainId(): Promise<number>;
  /**
   * Switch to a new chain using the id provided
   */
  switchChain(chainId: number): Promise<void>;
  /**
   * Signs an arbitrary message
   * @returns the generated signature
   */
  signMessage(message: string): Promise<string>; // signature
  /**
   * Signs a generic EVVM message using the standard pattern.
   */
  signGenericEvvmMessage(
    evvmId: bigint,
    functionName: string,
    inputs: string,
  ): Promise<string>;
  /**
   * Signs and sends a transaction to the network
   * @returns tx hash
   */
  writeContract(params: ISendTransactionParams): Promise<HexString>; // txHash
  /**
   * Calls view methods
   * @returns whatever the contract returns
   */
  readContract<T>(params: ISendTransactionParams): Promise<T>;
}
