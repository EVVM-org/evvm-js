import { z } from "zod";

export const AbiStateMutabilitySchema = z.enum([
  "pure",
  "view",
  "nonpayable",
  "payable",
]);
export type IAbiStateMutability = z.infer<typeof AbiStateMutabilitySchema>;

// Recursive schema for ABI Parameters
export const AbiParameterSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    type: z.string(),
    internalType: z.string().optional(),
    components: z.array(AbiParameterSchema).optional(),
    indexed: z.boolean().optional(),
  }),
);
export type IAbiParameter = z.infer<typeof AbiParameterSchema>;

export const AbiFunctionSchema = z.object({
  type: z.literal("function"),
  name: z.string(),
  inputs: z.array(AbiParameterSchema),
  outputs: z.array(AbiParameterSchema),
  stateMutability: AbiStateMutabilitySchema,
});
export type IAbiFunction = z.infer<typeof AbiFunctionSchema>;

export const AbiEventSchema = z.object({
  type: z.literal("event"),
  name: z.string(),
  inputs: z.array(AbiParameterSchema),
  anonymous: z.boolean().optional(),
});
export type IAbiEvent = z.infer<typeof AbiEventSchema>;

export const AbiErrorSchema = z.object({
  type: z.literal("error"),
  name: z.string(),
  inputs: z.array(AbiParameterSchema),
});
export type IAbiError = z.infer<typeof AbiErrorSchema>;

export const AbiConstructorSchema = z.object({
  type: z.literal("constructor"),
  inputs: z.array(AbiParameterSchema),
  stateMutability: AbiStateMutabilitySchema,
});
export type IAbiConstructor = z.infer<typeof AbiConstructorSchema>;

export const AbiItemSchema = z.discriminatedUnion("type", [
  AbiFunctionSchema,
  AbiEventSchema,
  AbiErrorSchema,
  AbiConstructorSchema,
]);
export type IAbiItem = z.infer<typeof AbiItemSchema>;

export const AbiSchema = z.array(AbiItemSchema);
export type IAbi = z.infer<typeof AbiSchema>;
