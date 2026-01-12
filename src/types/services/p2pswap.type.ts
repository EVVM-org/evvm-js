import type { HexString } from "../hexstring.type";

export interface IMakeOrderData {
  user: HexString;
  metadata: {
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    amountA: bigint;
    amountB: bigint;
  };
  signature: string;
  _priorityFee_Evvm?: bigint;
  _nonce_Evvm: bigint;
  _priorityFlag_Evvm: boolean;
  _signature_Evvm: string;
}

export interface ICancelOrderData {
  user: HexString;
  metadata: {
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    orderId: bigint;
    signature: string;
  };
  _priorityFee_Evvm?: bigint;
  _nonce_Evvm?: bigint;
  _priorityFlag_Evvm?: boolean;
  _signature_Evvm?: string;
}
