import type { HexString } from "./hexstring.type";

export interface IPresaleStakingData {
  user: HexString;
  isStaking: boolean;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IPublicStakingData {
  user: HexString;
  isStaking: boolean;
  amountOfStaking: bigint;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IGoldenStakingData {
  isStaking: boolean;
  amountOfStaking: bigint;
  signaturePay?: string;
}
