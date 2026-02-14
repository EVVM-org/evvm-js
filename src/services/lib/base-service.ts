import type {
  HexString,
  IAbi,
  IAbiItem,
  IBaseServiceProps,
  ISigner,
} from "@/types";
import type { IBaseDataSchema, SignedAction } from "./signed-action";
import { encodeAbiParameters, keccak256, type AbiParameter } from "viem";

export abstract class BaseService {
  /**
   * Address of the deployed service (smart contract).
   */
  address: HexString;
  abi: IAbi;
  /**
   * The chain id this service is deployed on.
   */
  chainId: number;
  protected evvmId?: bigint;
  protected signer: ISigner;

  constructor({ signer, address, abi, evvmId, chainId }: IBaseServiceProps) {
    this.signer = signer;
    this.address = address;
    this.abi = abi;
    this.chainId = chainId;
    this.evvmId = evvmId;
  }

  /**
   * Calls a readonly method of the service.
   */
  protected async view<T = any>(
    functionName: string,
    args?: any[],
  ): Promise<T> {
    const activeChain = await this.signer.getChainId();
    // assert the chainId and signer.chainId are correct
    if (this.chainId != activeChain) {
      // switch chains
      await this.signer.switchChain(this.chainId);
    }

    return this.signer.readContract<T>({
      functionName,
      contractAddress: this.address,
      contractAbi: this.abi,
      args: args || [],
    });
  }

  /**
   * Returns the function ABI from the service ABI.
   */
  getFunctionAbi(functionName: string): IAbiItem {
    const functionAbi = this.abi.find(
      (item) => item.type === "function" && item.name === functionName,
    );

    if (!functionAbi)
      throw new Error(`No function signature with name ${functionName}`);

    return functionAbi;
  }

  /**
   * Encodes and hashes the given args according to the function ABI.
   */
  buildHashPayload(
    functionName: string,
    args: Record<string, any>,
    opts?: {
      customAbiParams?: { name: string; type: string; insertAfter: string }[];
    },
  ): HexString {
    const functionAbi = this.getFunctionAbi(functionName);
    let inputs = [...functionAbi.inputs]; // to not mutate original abi

    if (opts?.customAbiParams) {
      // insert custom abi params to functionAbi.inputs
      opts.customAbiParams.forEach((custom) => {
        const index = inputs.findIndex(
          (input) => input.name == custom.insertAfter,
        );
        if (index == -1) {
          console.warn(
            `[WARN]: custom abi insertion couldn't find insertAfter abi`,
          );
          return;
        }

        inputs.splice(index + 1, 0, {
          type: custom.type,
          name: custom.name,
        });
      });
    }

    const usedInputsAbi = inputs.filter((input) =>
      Object.prototype.hasOwnProperty.call(args, input.name),
    );

    const sortedArgs = usedInputsAbi.map((input) => args[input.name]);

    // p2pswap exception
    const functionNameForHashPayload = /dispatchOrder/.test(functionName)
      ? "dispatchOrder"
      : functionName;

    const inputsAbi = [{ type: "string" }, ...usedInputsAbi];
    const values = [functionNameForHashPayload, ...sortedArgs];

    const encoded = encodeAbiParameters(inputsAbi, values);

    return keccak256(encoded);
  }

  /**
   * Builds a message of the form:
   * evvmId,serviceAddress,hashPayload,nonce,isAsyncExec
   */
  buildMessageToSign(
    evvmId: bigint,
    hashPayload: HexString,
    nonce: bigint,
    isAsyncExec: boolean,
  ): string {
    // evvmId,serviceAddress,hashPayload,executor(to be implemented),nonce,isAsyncExec
    return `${evvmId.toString()},${this.address},${hashPayload},${nonce.toString()},${JSON.stringify(isAsyncExec)}`;
  }

  /**
   * Retrieves the evvm ID of the service.
   */
  async getEvvmID(): Promise<bigint> {
    const evvmId = this.evvmId || (await this.view<bigint>("getEvvmID"));
    return evvmId;
  }
}

/**
 * Sign methods decorator, asserts the user returns the correct type (Promise<SignedAction<T>>).
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
    const result = await originalMethod.apply(this, args);
    return result;
  };

  return descriptor;
}
