import { zeroAddress } from "viem";
import {
  type HexString,
  type IBaseServiceProps,
  type IDispersePayData,
  type IPayData,
} from "@/types";
import { BaseService, SignMethod } from "./lib";
import { CoreABI } from "@/abi";
import { SignedAction } from "./lib";

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
export class Core extends BaseService {
  constructor(props: Omit<IBaseServiceProps, "abi">) {
    super({ ...props, abi: CoreABI });
  }

  /**
   * Returns the next sync nonce.
   */
  async getSyncNonce(): Promise<bigint> {
    return this.view<bigint>("getNextCurrentSyncNonce", [this.signer.address]);
  }

  /**
   * Checks whether an async nonce has already been used.
   */
  async isValidAsyncNonce(nonce: bigint): Promise<boolean> {
    return this.view<boolean>("getIfUsedAsyncNonce", [
      this.signer.address,
      nonce,
    ]);
  }

  /**
   * Returns the balance of the given user
   */
  async getBalance(user: HexString, token: HexString): Promise<number> {
    return this.view<number>("getBalance", [user, token]);
  }

  /**
   * Create and sign a `pay` action.
   *
   * Builds the EIP-191 message for the `pay` entrypoint and signs it using
   * the configured signer. The returned `SignedAction` contains all data
   * required to execute the `pay` call on-chain (serialized args and
   * signature).
   *
   * @param {HexString} toAddress - Recipient address (0x...)
   * @param {string} toIdentity - Recipient identity
   * @param {HexString} tokenAddress - Token contract address used for payment
   * @param {bigint} amount - Amount to transfer
   * @param {bigint} priorityFee - Priority fee to attach to the EVVM execution
   * @param {bigint} nonce - EVVM nonce for this action
   * @param {boolean} isAsyncExec - Async execution
   * @param {HexString} [senderExecutor] - Optional senderExecutor address
   * @returns {Promise<SignedAction<IPayData>>} Signed action ready for execution
   */
  @SignMethod
  async pay({
    toAddress = zeroAddress,
    toIdentity = "",
    tokenAddress,
    amount,
    priorityFee,
    senderExecutor = zeroAddress,
    nonce,
    isAsyncExec,
  }: {
    toAddress?: HexString;
    toIdentity?: string;
    tokenAddress: HexString;
    amount: bigint;
    priorityFee: bigint;
    nonce: bigint;
    isAsyncExec: boolean;
    senderExecutor?: HexString;
  }): Promise<SignedAction<IPayData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "pay";

    if (toAddress != zeroAddress && toIdentity != "")
      throw new Error("Can't call Core.pay with both toAddress and toIdentity");

    const hashPayload = this.buildHashPayload(functionName, {
      to_address: toAddress,
      to_identity: toIdentity,
      token: tokenAddress,
      amount,
      priorityFee,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      senderExecutor,
      nonce,
      isAsyncExec,
    );
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, functionName, {
      from: this.signer.address,
      to_address: toAddress,
      to_identity: toIdentity,
      token: tokenAddress,
      amount,
      priorityFee,
      senderExecutor,
      nonce,
      isAsyncExec,
      signature,
    });
  }

  /**
   * Build and sign a disperse payment action.
   *
   * The `toData` array is ABI-encoded and hashed for compact signing. The
   * returned `SignedAction` contains the hashed payload and signature.
   *
   * @param {Array<{amount: bigint; toAddress?: HexString; toIdentity?: string;}>} toData - Recipients data
   * @param {HexString} tokenAddress - Token address used for disperse
   * @param {bigint} amount - Total amount
   * @param {bigint} priorityFee - Priority fee
   * @param {bigint} nonce - EVVM nonce
   * @param {boolean} isAsyncExec - Async execution
   * @param {HexString} senderExecutor - senderExecutor address
   * @returns {Promise<SignedAction<IDispersePayData>>} Signed disperse action
   */
  @SignMethod
  async dispersePay({
    toData,
    tokenAddress,
    amount,
    priorityFee,
    senderExecutor = zeroAddress,
    nonce,
    isAsyncExec,
  }: {
    toData: ToData[];
    tokenAddress: HexString;
    amount: bigint;
    priorityFee: bigint;
    senderExecutor: HexString;
    nonce: bigint;
    isAsyncExec: boolean;
  }): Promise<SignedAction<IDispersePayData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "dispersePay";

    const hashPayload = this.buildHashPayload(functionName, {
      // convert toData to be a tuple [amount, toAddress, toIdentity] as described in ABI
      toData: toData.map((item, index) => {
        if (item.toAddress && item.toIdentity)
          throw new Error(
            `Error, cannot provide both toAddress and toIdentity (toData at index ${index})`,
          );

        return [
          item.amount,
          item.toAddress ? item.toAddress : zeroAddress,
          item.toIdentity ? item.toIdentity : "",
        ];
      }),
      token: tokenAddress,
      amount,
      priorityFee,
    });
    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      senderExecutor,
      nonce,
      isAsyncExec,
    );
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, functionName, {
      from: this.signer.address,
      toData: toData.map(({ amount, toAddress, toIdentity }) => ({
        amount,
        to_address: toAddress ? toAddress : zeroAddress,
        to_identity: toIdentity ? toIdentity : "",
      })),
      token: tokenAddress,
      amount,
      priorityFee,
      senderExecutor,
      nonce,
      isAsyncExec,
      signature,
    });
  }
}
