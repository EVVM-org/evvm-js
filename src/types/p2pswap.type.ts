import type { HexString } from "./hexstring.type";

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
  priorityFeeEvvm?: bigint;
  nonceEvvm: bigint;
  signatureEvvm: string;
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
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IDispatchOrderData {
  user: HexString;
  metadata: {
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    orderId: bigint;
    amountOfTokenBToFill: bigint;
    signature: string;
  };
  priorityFeeEvvm?: bigint;
  nonceEvvm: bigint;
  signatureEvvm: string;
}

export interface IDispatchOrderFixedFeeData extends IDispatchOrderData {
  maxFillFixedFee: bigint;
}
