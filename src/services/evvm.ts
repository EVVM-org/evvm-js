import { encodeAbiParameters, sha256 } from "viem";
import type { ISigner, HexString, IDispersePayData, IPayData } from "@/types";
import { BaseService } from "./lib";
import { EvvmABI } from "@/abi";
import { SignedAction } from "./lib";

const abiDispersePayParameters = [
  {
    type: "tuple[]",
    components: [{ type: "uint256" }, { type: "address" }, { type: "string" }],
  },
];

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
    to: HexString | string;
    tokenAddress: HexString;
    amount: bigint;
    priorityFee: bigint;
    nonce: bigint;
    priorityFlag: boolean;
    executor?: HexString;
  }): Promise<SignedAction<IPayData>> {
    const evvmId = await this.getEvvmID();

    // create message to sign
    const inputs: string =
      `${to.startsWith("0x") ? to.toLowerCase() : to},` +
      `${tokenAddress.toLowerCase()},` +
      `${amount.toString()},` +
      `${priorityFee.toString()},` +
      `${nonce.toString()},` +
      `${priorityFlag ? "true" : "false"},` +
      `${executor && executor.toLowerCase()}`;

    const message = `${evvmId.toString()},pay,${inputs}`;

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

  async dispersePay({
    toData,
    tokenAddress,
    amount,
    priorityFee,
    nonce,
    priorityFlag,
    executor,
  }: {
    toData: {
      amount: bigint;
      toAddress: HexString;
      toIdentity: HexString;
    }[];
    tokenAddress: HexString;
    amount: bigint;
    priorityFee: bigint;
    nonce: bigint;
    priorityFlag: boolean;
    executor: HexString;
  }): Promise<SignedAction<IDispersePayData>> {
    const evvmId = await this.getEvvmID();

    const hashedToData = sha256(
      encodeAbiParameters(
        abiDispersePayParameters,
        toData.map((item) => [item.amount, item.toAddress, item.toIdentity]),
      ),
    );

    const inputs: string =
      `${hashedToData.toLowerCase()},` +
      `${tokenAddress.toLowerCase()},` +
      `${amount.toString()},` +
      `${priorityFee.toString()},` +
      `${nonce.toString()},` +
      `${priorityFlag ? "true" : "false"},` +
      `${executor && executor.toLowerCase()}`;

    const message = `${evvmId.toString()},dispersePay,${inputs}`;
    const signature = await this.signERC191Message(message);

    return new SignedAction(this, evvmId, "dispersePay", {
      from: this.signer.address,
      toData: toData.map(({ amount, toAddress, toIdentity }) => ({
        amount,
        to_identity: toIdentity,
        to_address: toAddress,
      })),
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
