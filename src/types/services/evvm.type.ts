import type { HexString } from "../hexstring.type";

export interface IPayData {
  from: HexString;
  toAddress?: HexString;
  toIdentity?: string;
  token: HexString;
  amount: bigint;
  priorityFee?: bigint;
  nonce: bigint;
  priorityFlag: boolean;
  executor?: HexString;
  signature: string;
}
