import type { HexString } from "./hexstring.type";

export interface IAcceptOfferData {
  user: HexString;
  username: string;
  offerID: bigint;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IAddCustomMetadataData {
  user: HexString;
  identity: string;
  value: string;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IFlushCustomMetadataData {
  user: HexString;
  identity: string;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IFlushUsernameData {
  user: HexString;
  username: string;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IMakeOfferData {
  user: HexString;
  username: string;
  amount: bigint;
  expirationDate: bigint;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IPreRegistrationUsernameData {
  user: HexString;
  hashPreRegisteredUsername: string;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IRegistrationUsernameData {
  user: HexString;
  username: string;
  lockNumber: bigint;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IRemoveCustomMetadataData {
  user: HexString;
  identity: string;
  key: bigint;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IRenewUsernameData {
  user: HexString;
  username: string;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}

export interface IWithdrawOfferData {
  user: HexString;
  username: string;
  offerID: bigint;
  originExecutor: HexString;
  nonce: bigint;
  signature: string;
  priorityFeePay?: bigint;
  noncePay?: bigint;
  signaturePay?: string;
}
