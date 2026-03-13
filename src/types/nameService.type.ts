import { z } from "zod";
import { HexStringSchema } from "./hexstring.type";

export const AcceptOfferDataSchema = z.object({
  user: HexStringSchema,
  username: z.string(),
  offerID: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IAcceptOfferData = z.infer<typeof AcceptOfferDataSchema>;

export const AddCustomMetadataDataSchema = z.object({
  user: HexStringSchema,
  identity: z.string(),
  value: z.string(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IAddCustomMetadataData = z.infer<
  typeof AddCustomMetadataDataSchema
>;

export const FlushCustomMetadataDataSchema = z.object({
  user: HexStringSchema,
  identity: z.string(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IFlushCustomMetadataData = z.infer<
  typeof FlushCustomMetadataDataSchema
>;

export const FlushUsernameDataSchema = z.object({
  user: HexStringSchema,
  username: z.string(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IFlushUsernameData = z.infer<typeof FlushUsernameDataSchema>;

export const MakeOfferDataSchema = z.object({
  user: HexStringSchema,
  username: z.string(),
  amount: z.bigint(),
  expirationDate: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IMakeOfferData = z.infer<typeof MakeOfferDataSchema>;

export const PreRegistrationUsernameDataSchema = z.object({
  user: HexStringSchema,
  hashPreRegisteredUsername: z.string(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IPreRegistrationUsernameData = z.infer<
  typeof PreRegistrationUsernameDataSchema
>;

export const RegistrationUsernameDataSchema = z.object({
  user: HexStringSchema,
  username: z.string(),
  lockNumber: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IRegistrationUsernameData = z.infer<
  typeof RegistrationUsernameDataSchema
>;

export const RemoveCustomMetadataDataSchema = z.object({
  user: HexStringSchema,
  identity: z.string(),
  key: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IRemoveCustomMetadataData = z.infer<
  typeof RemoveCustomMetadataDataSchema
>;

export const RenewUsernameDataSchema = z.object({
  user: HexStringSchema,
  username: z.string(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IRenewUsernameData = z.infer<typeof RenewUsernameDataSchema>;

export const WithdrawOfferDataSchema = z.object({
  user: HexStringSchema,
  username: z.string(),
  offerID: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IWithdrawOfferData = z.infer<typeof WithdrawOfferDataSchema>;
