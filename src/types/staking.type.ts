import type { HexString } from "./hexstring.type";

export interface IPresaleStakingData {
  user: HexString;
  isStaking: boolean;
  senderExecutor: HexString;
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
  senderExecutor: HexString;
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
