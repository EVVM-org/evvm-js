import { z } from "zod";
import { HexStringSchema } from "./hexstring.type";

export const PresaleStakingDataSchema = z.object({
  user: HexStringSchema,
  isStaking: z.boolean(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IPresaleStakingData = z.infer<typeof PresaleStakingDataSchema>;

export const PublicStakingDataSchema = z.object({
  user: HexStringSchema,
  isStaking: z.boolean(),
  amountOfStaking: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type IPublicStakingData = z.infer<typeof PublicStakingDataSchema>;

export const GoldenStakingDataSchema = z.object({
  isStaking: z.boolean(),
  amountOfStaking: z.bigint(),
  signaturePay: z.string().optional(),
});
export type IGoldenStakingData = z.infer<typeof GoldenStakingDataSchema>;
