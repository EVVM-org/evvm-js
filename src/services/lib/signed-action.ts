import type { HexString } from "@/types/hexstring.type";
import type { BaseService } from "./base-service";

interface IBaseDataSchema {
  signature: string;
  from: HexString;
  nonce: bigint | string;
}

interface ISerializableSignedAction<T> {
  evvmId: number;
  functionName: string;
  contractAddress: HexString;
  data: T;
  args: any[];
}

export class SignedAction<T extends IBaseDataSchema> {
  constructor(
    public service: BaseService,
    public functionName: string,
    public data: T,
  ) {}

  toJSON(): ISerializableSignedAction<T> {
    let data: any = {};
    let args: any[] = [];

    for (let [key, value] of Object.entries(this.data)) {
      if (typeof value == "bigint") data[key] = value.toString();
      else data[key] = value;

      args.push(data[key]);
    }

    return {
      evvmId: this.service.evvmId,
      functionName: this.functionName,
      contractAddress: this.service.address,
      data,
      args,
    };
  }
}
