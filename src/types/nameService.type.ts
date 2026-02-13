import type { HexString } from "./hexstring.type";

export interface IAcceptOfferData {
  user: HexString;
  username: string;
  offerID: bigint;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IAddCustomMetadataData {
  user: HexString;
  identity: string;
  value: string;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IFlushCustomMetadataData {
  user: HexString;
  identity: string;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IFlushUsernameData {
  user: HexString;
  username: string;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IMakeOfferData {
  user: HexString;
  username: string;
  amount: bigint;
  expirationDate: bigint;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IPreRegistrationUsernameData {
  user: HexString;
  hashPreRegisteredUsername: string;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IRegistrationUsernameData {
  user: HexString;
  username: string;
  lockNumber: bigint;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IRemoveCustomMetadataData {
  user: HexString;
  identity: string;
  key: bigint;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IRenewUsernameData {
  user: HexString;
  username: string;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}

export interface IWithdrawOfferData {
  user: HexString;
  username: string;
  offerID: bigint;
  nonce: bigint;
  signature: string;
  priorityFeeEvvm?: bigint;
  nonceEvvm?: bigint;
  signatureEvvm?: string;
}
