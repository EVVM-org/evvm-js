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
    const serializedData = this.serializeData();

    const functionAbi = this.service.abi.find(
      (item) => item.type === "function" && item.name === this.functionName,
    );

    if (!functionAbi)
      throw new Error(`No function signature with name ${this.functionName}`);

    // populate args
    functionAbi.inputs.forEach((input, index) => {
      args[index] = serializedData[input.name];
    });

    return args;
  }

  private serializeData(): T {
    return Object.fromEntries(
      Object.entries(this.data).map(([key, value]) => [
        key,
        typeof value === "bigint" ? value.toString() : value,
      ]),
    ) as T;
  }
}
