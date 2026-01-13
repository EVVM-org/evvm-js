import type { HexString } from "../hexstring.type";

export interface IAcceptOfferData {
  user: HexString;
  username: string;
  offerID: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IAddCustomMetadataData {
  user: HexString;
  identity: string;
  value: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IFlushCustomMetadataData {
  user: HexString;
  identity: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IFlushUsernameData {
  user: HexString;
  username: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IMakeOfferData {
  user: HexString;
  username: string;
  expireDate: bigint;
  amount: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IPreRegistrationUsernameData {
  user: HexString;
  hashPreRegisteredUsername: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IRegistrationUsernameData {
  user: HexString;
  username: string;
  clowNumber: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IRemoveCustomMetadataData {
  user: HexString;
  identity: string;
  key: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IRenewUsernameData {
  user: HexString;
  username: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}

export interface IWithdrawOfferData {
  user: HexString;
  username: string;
  offerID: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM?: bigint;
  nonce_EVVM?: bigint;
  priorityFlag_EVVM?: boolean;
  signature_EVVM?: string;
}
