import type { HexString } from "./hexstring.type";

interface IBaseDataSchema {
  signature: string;
  from: HexString;
  nonce: bigint;
}

/**
 * Standarized signed object for further fisher execution
 */
export interface ISignedAction<T extends IBaseDataSchema> {
  evvmId: number;
  /**
   * Address of the contract to be called
   */
  contractAddress: HexString;
  /**
   * Name of the function whose signature belong
   */
  functionName: string;
  /**
   * Signature, along with the data used to create it
   */
  data: T;
  /**
   * Same data as `data` but in array format, ready to be used as `args` in a
   * function call
   */
  args: any[];
}
