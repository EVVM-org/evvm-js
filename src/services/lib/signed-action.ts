import type { HexString } from "@/types/hexstring.type";
import type { BaseService } from "./base-service";

interface IBaseDataSchema {
  signature: string;
  from: HexString;
  nonce: bigint | string;
  [key: string]: any;
}

interface ISerializableSignedAction<T> {
  evvmId: number;
  functionName: string;
  contractAddress: HexString;
  data: T;
  args: any[];
}

export class SignedAction<T extends IBaseDataSchema> {
  service: BaseService;
  functionName: string;
  data: T;
  args: any[];

  constructor(service: BaseService, functionName: string, data: T) {
    this.service = service;
    this.functionName = functionName;
    this.data = data;
    this.args = this.mapDataToArgs();
  }

  toJSON(): ISerializableSignedAction<T> {
    const serializedData = this.serializeData();

    return {
      evvmId: this.service.evvmId,
      functionName: this.functionName,
      contractAddress: this.service.address,
      data: serializedData,
      args: this.args,
    };
  }

  private mapDataToArgs(): any[] {
    let args: any[] = [];

    const functionAbi = this.service.abi.find(
      (item) => item.type === "function" && item.name === this.functionName,
    );

    if (!functionAbi)
      throw new Error(`No function signature with name ${this.functionName}`);

    // populate args (validate presence). Keep values serialized for transport.
    const serializedData = this.serializeData();
    functionAbi.inputs.forEach((input, index) => {
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
      if (typeof value === "bigint") return value.toString();
      if (Array.isArray(value)) return value.map((v) => deepSerialize(v));
      if (value && typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, deepSerialize(v)]),
        );
      }
      return value;
    };

    return deepSerialize(this.data) as T;
  }
}
