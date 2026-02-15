import type { HexString } from "./hexstring.type";

export interface IMakeOrderData {
  user: HexString;
  metadata: {
    originExecutor: HexString;
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    amountA: bigint;
    amountB: bigint;
  };
  signature: string;
  priorityFeePay?: bigint;
  noncePay: bigint;
  signaturePay: string;
}

export interface ICancelOrderData {
  user: HexString;
  metadata: {
    originExecutor: HexString;
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    orderId: bigint;
    signature: string;
  };
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IDispatchOrderData {
  user: HexString;
  metadata: {
    originExecutor: HexString;
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    orderId: bigint;
    amountOfTokenBToFill: bigint;
    signature: string;
  };
  priorityFeePay?: bigint;
  noncePay: bigint;
  signaturePay: string;
}

export interface IDispatchOrderFixedFeeData extends IDispatchOrderData {
  maxFillFixedFee: bigint;
}
