import { z } from "zod";
import { HexStringSchema } from "./hexstring.type";

export const PayDataSchema = z.object({
  from: HexStringSchema,
  to_address: HexStringSchema,
  to_identity: z.string(),
  token: HexStringSchema,
  amount: z.bigint(),
  priorityFee: z.bigint().optional(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  isAsyncExec: z.boolean(),
  signature: z.string(),
});
export type IPayData = z.infer<typeof PayDataSchema>;

export const DispersePayDataSchema = z.object({
  from: HexStringSchema,
  toData: z.array(
    z.object({
      amount: z.bigint(),
      to_address: HexStringSchema,
      to_identity: z.string(),
    }),
  ),
  token: HexStringSchema,
  amount: z.bigint(),
  priorityFee: z.bigint().optional(),
  senderExecutor: HexStringSchema,
  originExecutor: HexStringSchema,
  nonce: z.bigint(),
  isAsyncExec: z.boolean(),
  signature: z.string(),
});
export type IDispersePayData = z.infer<typeof DispersePayDataSchema>;
