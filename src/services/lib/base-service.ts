import type { HexString } from "@/types/hexstring.type";
import type { ISigner } from "@/types/signer.type";
import { SignatureBuilder } from "./signature-builder";

export abstract class BaseService extends SignatureBuilder {
  address: HexString;
  abi: any;

  constructor(signer: ISigner, address: HexString, abi: any) {
    super(signer);
    this.address = address;
    this.abi = abi;
  }

  /**
   * Calls a readonly method of the service
   */
  protected async view<T = any>(
    functionName: string,
    args?: any[],
  ): Promise<T> {
    return this.signer.readContract<T>({
      functionName,
      contractAddress: this.address,
      contractAbi: this.abi,
      args: args || [],
    });
  }

  /**
   * Returns a valid Sync nonce for the given service
   */
  abstract getSyncNonce(): Promise<bigint>;

  /**
   * Used to assert a given async nonce hasn't been used
   */
  abstract isValidAsyncNonce(nonce: bigint): Promise<boolean>;
}
