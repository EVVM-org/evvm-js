import type { HexString } from "../hexstring.type";

export interface IPayData {
  from: HexString;
  to_address?: HexString;
  to_identity?: string;
  token: HexString;
  amount: bigint;
  priorityFee?: bigint;
  nonce: bigint;
  priorityFlag: boolean;
  executor?: HexString;
  signature: string;
}
