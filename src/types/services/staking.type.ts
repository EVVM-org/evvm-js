import type { HexString } from "../hexstring.type";

export interface IPresaleStakingData {
  user: HexString;
  isStaking: boolean;
  amountOfStaking?: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IPublicStakingData {
  user: HexString;
  isStaking: boolean;
  amountOfStaking: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IGoldenStakingData {
  isStaking: boolean;
  amountOfStaking: bigint;
  signature_EVVM?: string;
}
