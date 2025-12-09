import type { ISigner } from "@/types/signer.type";
import { BaseService } from "./lib/base-service";
import type { HexString } from "@/types/hexstring.type";
import { EvvmABI } from "@/abi";

export class EVVM extends BaseService {
  constructor(signer: ISigner, address: HexString) {
    super(signer, address, EvvmABI);
  }

  async getSyncNonce(): Promise<bigint> {
    return this.view<bigint>("getNextCurrentSyncNonce", [this.signer.address]);
  }

  async isValidAsyncNonce(nonce: bigint): Promise<boolean> {
    return this.view<boolean>("getIfUsedAsyncNonce", [
      this.signer.address,
      nonce,
    ]);
  }
}
