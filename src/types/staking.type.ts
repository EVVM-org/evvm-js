import type { HexString } from "./hexstring.type";

export interface IPresaleStakingData {
  user: HexString;
  isStaking: boolean;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IPublicStakingData {
  user: HexString;
  isStaking: boolean;
  amountOfStaking: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IGoldenStakingData {
  isStaking: boolean;
  amountOfStaking: bigint;
  signaturePay?: string;
}
