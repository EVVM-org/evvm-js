import type { HexString } from "./hexstring.type";

interface ISendTransactionParams {
  contractAddress: HexString;
  contractAbi: any;
  functionName: string;
  args: any[];
}

export interface ISigner {
  /**
   * Signer address
   */
  address: HexString;
  /**
   * Signs an arbitrary message
   * @returns the generated signature
   */
  signMessage(message: string): Promise<string>; // signature
  /**
   * Signs and sends a transaction to the network
   * @returns tx hash
   */
  sendTransaction(params: ISendTransactionParams): Promise<HexString>; // txHash
}
