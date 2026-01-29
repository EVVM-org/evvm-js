import { encodeAbiParameters, sha256 } from "viem";
import type { HexString, IDispersePayData, IPayData } from "@/types";
import { BaseService, SignMethod } from "./lib";
import { EvvmABI } from "@/abi";
import { SignedAction } from "./lib";
import type { IBaseServiceProps } from "@/types/services/base-service.type";

const abiDispersePayParameters = [
  {
    type: "tuple[]",
    components: [{ type: "uint256" }, { type: "address" }, { type: "string" }],
  },
];

type ToData =
  | {
      amount: bigint;
      toAddress: HexString;
      toIdentity: undefined;
    }
  | {
      amount: bigint;
      toAddress: undefined;
      toIdentity: string;
    };

/**
 * EVVM service wrapper.
 *
 * Provides helper methods to build signed EVVM actions related to payments
 * and batch disperse payments. Each helper returns a `SignedAction` which
 * contains the serialized data and signature necessary to execute the
 * corresponding contract call.
 */
export class EVVM extends BaseService {
  constructor(props: Omit<IBaseServiceProps, "abi">) {
    super({ ...props, abi: EvvmABI });
  }

  /**
   * Create and sign a `pay` action.
   *
   * Builds the EIP-191 message for the `pay` entrypoint and signs it using
   * the configured signer. The returned `SignedAction` contains all data
   * required to execute the `pay` call on-chain (serialized args and
   * signature).
   *
   * @param {HexString | string} to - Recipient address (0x...) or identity string
   * @param {HexString} tokenAddress - Token contract address used for payment
   * @param {bigint} amount - Amount to transfer
   * @param {bigint} priorityFee - Priority fee to attach to the EVVM execution
   * @param {bigint} nonce - EVVM nonce for this action
   * @param {boolean} priorityFlag - Whether this action is prioritized
   * @param {HexString=} executor - Optional executor address
   * @returns {Promise<SignedAction<IPayData>>} Signed action ready for execution
   */
  @SignMethod
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
  }) {
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

  /**
   * Build and sign a disperse payment action.
   *
   * The `toData` array is ABI-encoded and hashed for compact signing. The
   * returned `SignedAction` contains the hashed payload and signature.
   *
   * @param {{amount: bigint; toAddress: HexString; toIdentity: HexString;}[]} toData - Recipients data
   * @param {HexString} tokenAddress - Token address used for disperse
   * @param {bigint} amount - Total amount
   * @param {bigint} priorityFee - Priority fee
   * @param {bigint} nonce - EVVM nonce
   * @param {boolean} priorityFlag - Priority flag
   * @param {HexString} executor - Executor address
   * @returns {Promise<SignedAction<IDispersePayData>>} Signed disperse action
   */
  @SignMethod
  async dispersePay({
    toData,
    tokenAddress,
    amount,
    priorityFee,
    nonce,
    priorityFlag,
    executor,
  }: {
    toData: ToData[];
    tokenAddress: HexString;
    amount: bigint;
    priorityFee: bigint;
    nonce: bigint;
    priorityFlag: boolean;
    executor: HexString;
  }): Promise<SignedAction<IDispersePayData>> {
    const evvmId = await this.getEvvmID();

    const hashedToData = sha256(
      encodeAbiParameters(abiDispersePayParameters, [
        toData.map((item) => {
          if (item.toAddress && item.toIdentity)
            throw new Error(
              "Error, cannot provide both toAddress and toIdentity",
            );

          return [
            item.amount,
            item.toAddress
              ? item.toAddress
              : "0x0000000000000000000000000000000000000000",
            item.toIdentity ? item.toIdentity : "",
          ];
        }),
      ]),
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
        to_identity: toIdentity ? toIdentity : "",
        to_address: toAddress ? toAddress : "",
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
