import { z } from "zod";
import { HexStringSchema } from "./hexstring.type";

export const MakeOrderDataSchema = z.object({
  user: HexStringSchema,
  tokenA: HexStringSchema,
  tokenB: HexStringSchema,
  amountA: z.bigint(),
  amountB: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint(),
  signaturePay: z.string(),
});
export type IMakeOrderData = z.infer<typeof MakeOrderDataSchema>;

export const CancelOrderDataSchema = z.object({
  user: HexStringSchema,
  tokenA: HexStringSchema,
  tokenB: HexStringSchema,
  orderId: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint().optional(),
  signaturePay: z.string().optional(),
});
export type ICancelOrderData = z.infer<typeof CancelOrderDataSchema>;

export const DispatchOrderDataSchema = z.object({
  user: HexStringSchema,
  tokenA: HexStringSchema,
  tokenB: HexStringSchema,
  orderId: z.bigint(),
  amountOfTokenBToFill: z.bigint(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  signature: z.string(),
  priorityFeePay: z.bigint().optional(),
  noncePay: z.bigint(),
  signaturePay: z.string(),
});
export type IDispatchOrderData = z.infer<typeof DispatchOrderDataSchema>;

// Inheritance using .extend()
export const DispatchOrderFixedFeeDataSchema = DispatchOrderDataSchema.extend({
  maxFillFixedFee: z.bigint(),
});
export type IDispatchOrderFixedFeeData = z.infer<
  typeof DispatchOrderFixedFeeDataSchema
>;
