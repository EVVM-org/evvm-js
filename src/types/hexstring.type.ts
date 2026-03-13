import { z } from "zod";

export type HexString = `0x${string}`;

export const HexStringSchema: z.ZodType<HexString> = z
  .string()
  .regex(/^0x[a-fA-F0-9]+$/) as any;
