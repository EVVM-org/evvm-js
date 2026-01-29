import type { HexString, IAbi } from "@/types";
import { SignatureBuilder } from "./signature-builder";
import type { IBaseServiceProps } from "@/types/services/base-service.type";
import type { IBaseDataSchema, SignedAction } from "./signed-action";

export abstract class BaseService extends SignatureBuilder {
  /**
   * Address of the deployed service (Smart Contract)
   */
  address: HexString;
  abi: IAbi;
  /**
   * The chain id this service is deployed on
   */
  chainId: number;
  protected evvmId?: bigint;

  constructor({ signer, address, abi, evvmId, chainId }: IBaseServiceProps) {
    super(signer);
    this.address = address;
    this.abi = abi;
    this.chainId = chainId;
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

/**
 * Sign methods decorator, asserts the user returns the correct type (Promise<SignedAction<T>>)
 * and that the signer is connected to the right network.
 */
export function SignMethod<T extends IBaseDataSchema>(
  _target: any,
  propertyKey: string,
  // we define a specific return type (Promise<SignedAction<T>>) for decorated methods
  descriptor: TypedPropertyDescriptor<
    (...args: any[]) => Promise<SignedAction<T>>
  >,
) {
  const originalMethod = descriptor.value;

  if (!originalMethod)
    throw new Error(
      `@SignMethod decorator applied to undefined method ${propertyKey}`,
    );

  descriptor.value = async function (this: BaseService, ...args: any[]) {
    // assert the chainId and signer.chainId are correct
    const activeChain = await this.signer.getChainId();
    if (this.chainId != activeChain) {
      // switch chains
      await this.signer.switchChain(this.chainId);
    }

    const result = await originalMethod.apply(this, args);
    return result;
  };

  return descriptor;
}
