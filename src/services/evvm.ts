import type { ISigner } from "@/types/signer.type";
import { BaseService } from "./lib/base-service";
import type { HexString } from "@/types/hexstring.type";
import { EvvmABI } from "@/abi";
import type { IPayData } from "@/types/services/evvm.type";
import { SignedAction } from "./lib/signed-action";

export class EVVM extends BaseService {
  constructor(signer: ISigner, address: HexString) {
    super(signer, address, EvvmABI);
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
  }): Promise<SignedAction<IPayData>> {
    // create message to sign
    const inputs: string =
      `${to.startsWith("0x") ? to.toLowerCase() : to},` +
      `${tokenAddress.toLowerCase()},` +
      `${amount.toString()},` +
      `${priorityFee.toString()},` +
      `${nonce.toString()},` +
      `${priorityFlag ? "true" : "false"},` +
      `${executor && executor.toLowerCase()}`;

    const evvmId = await this.getEvvmID();

    const message = `${evvmId},pay,${inputs}`;

    const signature = await this.signERC191Message(message);

    const toAddress = to.startsWith("0x") ? (to as HexString) : undefined;
    const toIdentity = !to.startsWith("0x") ? to : undefined;

    return new SignedAction(this, evvmId, "pay", {
      from: this.signer.address,
      to_address: toAddress,
      to_identity: toIdentity,
      token: tokenAddress,
      amount,
      priorityFee,
      nonce,
      priorityFlag,
      executor,
      signature,
    });
  }
}
