import type { HexString } from "@/types/hexstring.type";
import type { ISigner } from "@/types/signer.type";
import { SignatureBuilder } from "./signature-builder";
import type { IAbi } from "@/types/abi.type";

export abstract class BaseService extends SignatureBuilder {
  address: HexString;
  evvmId: number;
  abi: IAbi;

  constructor(signer: ISigner, address: HexString, abi: IAbi, evvmId: number) {
    super(signer);
    this.address = address;
    this.abi = abi;
    this.evvmId = evvmId;
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
  async getSyncNonce(): Promise<bigint> {
    return this.view<bigint>("getNextCurrentSyncNonce", [this.signer.address]);
  }

  /**
   * Used to assert a given async nonce hasn't been used
   */
  async isValidAsyncNonce(nonce: bigint): Promise<boolean> {
    return this.view<boolean>("getIfUsedAsyncNonce", [
      this.signer.address,
      nonce,
    ]);
  }
}
