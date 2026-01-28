import type { HexString, ISigner, IAbi } from "@/types";
import { SignatureBuilder } from "./signature-builder";

interface IBaseServiceOpts {
  evvmId?: bigint;
}

export abstract class BaseService extends SignatureBuilder {
  address: HexString;
  abi: IAbi;
  chainId: number;
  protected evvmId?: bigint;

  constructor(
    signer: ISigner,
    address: HexString,
    abi: IAbi,
    opts?: IBaseServiceOpts,
  ) {
    super(signer);
    this.address = address;
    this.abi = abi;
    this.chainId = this.signer.chainId;

    // optional fields
    this.evvmId = opts?.evvmId;
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
   * Retrieves the evvm ID of the service
   */
  async getEvvmID(): Promise<bigint> {
    const evvmId = this.evvmId || (await this.view<bigint>("getEvvmID"));
    return evvmId;
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
