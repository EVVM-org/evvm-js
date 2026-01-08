import type { IAbi } from "./abi.type";
import type { HexString } from "./hexstring.type";

interface ISendTransactionParams {
  contractAddress: HexString;
  contractAbi: IAbi;
  functionName: string;
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
   * Connected network id
   */
  chainId: number;
  /**
   * Signs an arbitrary message
   * @returns the generated signature
   */
  signMessage(message: string): Promise<string>; // signature
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
