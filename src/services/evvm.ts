import type { ISigner } from "@/types/signer.type";
import { BaseService } from "./lib/base-service";
import type { HexString } from "@/types/hexstring.type";
import { EvvmABI } from "@/abi";
import type { ISignedAction } from "@/types/signed-action";

export class EVVM extends BaseService {
  constructor(signer: ISigner, address: HexString, evvmId: number) {
    super(signer, address, EvvmABI, evvmId);
  }

  /**
   * Signature creation for evvm.pay()
   */
  async pay({
    to,
    tokenAddress,
    amount,
    priorityFee,
    nonce,
    priorityFlag,
    executor,
  }: {
    evvmID: bigint;
    to: `0x${string}` | string;
    tokenAddress: `0x${string}`;
    amount: bigint;
    priorityFee: bigint;
    nonce: bigint;
    priorityFlag: boolean;
    executor: `0x${string}`;
  }): Promise<ISignedAction> {
    // create message to sign
    // organize inputs string
    const inputs: string =
      `${to.startsWith("0x") ? to.toLowerCase() : to},` +
      `${tokenAddress.toLowerCase()},` +
      `${amount.toString()},` +
      `${priorityFee.toString()},` +
      `${nonce.toString()},` +
      `${priorityFlag ? "true" : "false"},` +
      `${executor.toLowerCase()}`;

    const message = `${this.evvmId},pay,${inputs}`;

    const signature = await this.signERC191Message(message);

    return {
      signature,
      args: [],
    };
  }
}
