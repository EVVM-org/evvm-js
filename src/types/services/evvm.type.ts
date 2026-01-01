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

  //       address from,
  //       address to_address,
  //       string memory to_identity,
  //       address token,
  //       uint256 amount,
  //       uint256 priorityFee,
  //       uint256 nonce,
  //       bool priorityFlag,
  //       address executor,
  //       bytes memory signature
}
