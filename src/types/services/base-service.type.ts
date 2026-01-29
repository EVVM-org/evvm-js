import type { IAbi } from "../abi.type";
import type { HexString } from "../hexstring.type";
import type { ISigner } from "../signer.type";

export interface IBaseServiceProps {
  signer: ISigner;
  address: HexString;
  abi: IAbi;
  /**
   * The chain id this service is deployed on
   */
  chainId: number;
  evvmId?: bigint;
}
