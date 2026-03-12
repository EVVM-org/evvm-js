import type { HexString } from "./hexstring.type";

export interface IMakeOrderData {
  user: HexString;
  tokenA: HexString;
  tokenB: HexString;
  amountA: bigint;
  amountB: bigint;
  senderExecutor: HexString;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay: bigint;
  signaturePay: string;
}

export interface ICancelOrderData {
  user: HexString;
  tokenA: HexString;
  tokenB: HexString;
  orderId: bigint;
  senderExecutor: HexString;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IDispatchOrderData {
  user: HexString;
  tokenA: HexString;
  tokenB: HexString;
  orderId: bigint;
  amountOfTokenBToFill: bigint;
  senderExecutor: HexString;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay: bigint;
  signaturePay: string;
}

export interface IDispatchOrderFixedFeeData extends IDispatchOrderData {
  maxFillFixedFee: bigint;
}
