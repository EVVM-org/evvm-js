import type { ISigner } from "@/types/signer.type";
import { BaseService } from "./lib/base-service";
import type { HexString } from "@/types/hexstring.type";
import { EvvmABI } from "@/abi";
import type { ISignedAction } from "@/types/signed-action.type";
import type { IPayData } from "@/types/services/evvm.type";

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
    to: `0x${string}` | string;
    tokenAddress: `0x${string}`;
    amount: bigint;
    priorityFee: bigint;
    nonce: bigint;
    priorityFlag: boolean;
    executor?: `0x${string}`;
  }): Promise<ISignedAction<IPayData>> {
    // create message to sign
    const inputs: string =
      `${to.startsWith("0x") ? to.toLowerCase() : to},` +
      `${tokenAddress.toLowerCase()},` +
      `${amount.toString()},` +
      `${priorityFee.toString()},` +
      `${nonce.toString()},` +
      `${priorityFlag ? "true" : "false"},` +
      `${executor && executor.toLowerCase()}`;

    const message = `${this.evvmId},pay,${inputs}`;

    const signature = await this.signERC191Message(message);

    const toAddress = to.startsWith("0x") ? (to as HexString) : undefined;
    const toIdentity = !to.startsWith("0x") ? to : undefined;

    return {
      evvmId: this.evvmId,
      contractAddress: this.address,
      functionName: "pay",
      data: {
        from: this.signer.address,
        toAddress,
        toIdentity,
        token: tokenAddress,
        amount,
        priorityFee,
        nonce,
        priorityFlag,
        executor,
        signature,
      },
      args: [
        this.signer.address,
        toAddress,
        toIdentity,
        tokenAddress,
        amount.toString(),
        priorityFee.toString(),
        nonce.toString(),
        priorityFlag.toString(),
        executor,
        signature,
      ],
    };
  }
}
