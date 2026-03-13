import z from "zod";
import type { BaseService } from "./base-service";
import { AbiItemSchema, HexStringSchema, type IAbiItem } from "@/types";

export interface IBaseDataSchema {
  [key: string]: any;
}

export const getSerializableSignedActionSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z
    .object({
      functionName: z.string(),
      functionAbi: AbiItemSchema,
      contractAddress: HexStringSchema,
      chainId: z.number(),
      evvmId: z.string(),
      data: dataSchema,
      args: z.array(z.any()),
    })
    .loose();

export type ISerializableSignedAction<T> = z.infer<
  ReturnType<typeof getSerializableSignedActionSchema<z.ZodType<T>>>
>;

/**
 * Signed EVVM action, result of a function call of a BaseService.
 * Contains all information needed to execute the transaction anywhere.
 * Can be serialized to JSON using JSON.stringify() or with SignedAction.toJSON().
 */
export class SignedAction<T extends IBaseDataSchema> {
  service: BaseService;
  evvmId: bigint;
  functionName: string;
  data: T;
  functionAbi: IAbiItem;
  args: any[];

  constructor(
    service: BaseService,
    evvmId: bigint,
    functionName: string,
    data: T,
  ) {
    this.service = service;
    this.evvmId = evvmId;
    this.functionName = functionName;
    this.data = data;
    this.functionAbi = this.service.getFunctionAbi(functionName);
    this.args = this.getArgs();
  }

  toJSON(): ISerializableSignedAction<T> {
    const serializedData = this.serializeData();

    return {
      chainId: this.service.chainId,
      evvmId: this.evvmId.toString(),
      functionName: this.functionName,
      functionAbi: this.functionAbi,
      contractAddress: this.service.address,
      data: serializedData,
      args: this.args,
    };
  }

  private getArgs(): any[] {
    let args: any[] = [];

    // populate args (validate presence). Keep values serialized for transport.
    const serializedData = this.serializeData();
    this.functionAbi.inputs.forEach((input, index) => {
      if (!input.name || input.name.length === 0)
        throw new Error(
          `ABI input at index ${index} for function ${this.functionName} has empty name`,
        );

      if (!Object.prototype.hasOwnProperty.call(serializedData, input.name))
        throw new Error(
          `Missing data property '${input.name}' for function '${this.functionName}'`,
        );

      // keep serialized representation (strings for bigints, nested objects/arrays preserved)
      args[index] = serializedData[input.name];
    });

    return args;
  }

  private serializeData(): T {
    const deepSerialize = (value: any): any => {
      // serialize bigints
      if (typeof value === "bigint") return value.toString();
      // serialize arrays
      if (Array.isArray(value)) return value.map((v) => deepSerialize(v));
      // serialize objects
      if (value && typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, deepSerialize(v)]),
        );
      }
      // else, it's a serializable object (primitive)
      return value;
    };

    return deepSerialize(this.data) as T;
  }
}
