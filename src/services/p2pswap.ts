import type {
  HexString,
  ICancelOrderData,
  IDispatchOrderData,
  IDispatchOrderFixedFeeData,
  IMakeOrderData,
  IPayData,
  IBaseServiceProps,
} from "@/types";
import { BaseService, SignedAction, SignMethod } from "./lib";
import { P2PSwapABI } from "@/abi";

/**
 * P2PSwap service wrapper.
 *
 * Implements signature creation helpers for peer-to-peer swap operations
 * (makeOrder, cancelOrder, dispatchOrder variants). Each method returns a
 * `SignedAction` containing the signed metadata and serialized args ready
 * for on-chain execution.
 */
export class P2PSwap extends BaseService {
  constructor(props: Omit<IBaseServiceProps, "abi">) {
    super({ ...props, abi: P2PSwapABI });
  }

  /**
   * Create and sign a `makeOrder` action.
   *
   * @param {bigint} nonce - Order nonce
   * @param {HexString} tokenA - Token A address
   * @param {HexString} tokenB - Token B address
   * @param {bigint} amountA - Amount of token A
   * @param {bigint} amountB - Amount of token B
   * @param {SignedAction<IPayData>} evvmSignedAction - Underlying EVVM pay signed action
   * @returns {Promise<SignedAction<IMakeOrderData>>} Signed make order action
   */
  @SignMethod
  async makeOrder({
    nonce,
    tokenA,
    tokenB,
    amountA,
    amountB,
    evvmSignedAction,
  }: {
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    amountA: bigint;
    amountB: bigint;
    evvmSignedAction: SignedAction<IPayData>;
  }): Promise<SignedAction<IMakeOrderData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "makeOrder";

    const hashPayload = this.buildHashPayload(functionName, {
      tokenA,
      tokenB,
      amountA,
      amountB,
    });
    const message = this.buildMessageToSign(evvmId, hashPayload, nonce, true);
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, functionName, {
      user: this.signer.address,
      metadata: {
        nonce,
        tokenA,
        tokenB,
        amountA,
        amountB,
      },
      signature,
      priorityFeeEvvm: evvmSignedAction.data.priorityFee,
      nonceEvvm: evvmSignedAction.data.nonce,
      signatureEvvm: evvmSignedAction.data.signature,
    });
  }

  /**
   * Create and sign a `cancelOrder` action.
   *
   * @param {bigint} nonce - Order nonce
   * @param {HexString} tokenA - Token A address
   * @param {HexString} tokenB - Token B address
   * @param {bigint} orderId - Order identifier
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM pay signed action
   * @returns {Promise<SignedAction<ICancelOrderData>>} Signed cancel order action
   */
  @SignMethod
  async cancelOrder({
    nonce,
    tokenA,
    tokenB,
    orderId,
    evvmSignedAction,
  }: {
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    orderId: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<ICancelOrderData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "cancelOrder";

    const hashPayload = this.buildHashPayload(functionName, {
      tokenA,
      tokenB,
      orderId,
    });
    const message = this.buildMessageToSign(evvmId, hashPayload, nonce, true);
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, functionName, {
      user: this.signer.address,
      metadata: {
        nonce,
        tokenA,
        tokenB,
        orderId,
        signature,
      },
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `dispatchOrder` action (proportional fee variant).
   *
   * @param {bigint} nonce - Dispatch nonce
   * @param {HexString} tokenA - Token A address
   * @param {HexString} tokenB - Token B address
   * @param {bigint} orderId - Order identifier
   * @param {bigint} amountOfTokenBToFill - Amount of token B to fill
   * @param {SignedAction<IPayData>} evvmSignedAction - Underlying EVVM pay signed action
   * @returns {Promise<SignedAction<IDispatchOrderData>>} Signed dispatch order action
   */
  @SignMethod
  async dispatchOrder_fillPropotionalFee({
    nonce,
    tokenA,
    tokenB,
    orderId,
    amountOfTokenBToFill,
    evvmSignedAction,
  }: {
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    orderId: bigint;
    amountOfTokenBToFill: bigint;
    evvmSignedAction: SignedAction<IPayData>;
  }): Promise<SignedAction<IDispatchOrderData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "dispatchOrder_fillPropotionalFee";

    const hashPayload = this.buildHashPayload(functionName, {
      tokenA,
      tokenB,
      orderId,
    });
    const message = this.buildMessageToSign(evvmId, hashPayload, nonce, true);
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, functionName, {
      user: this.signer.address,
      metadata: {
        nonce,
        tokenA,
        tokenB,
        orderId,
        amountOfTokenBToFill: amountOfTokenBToFill,
        signature,
      },
      priorityFeeEvvm: evvmSignedAction.data.priorityFee,
      nonceEvvm: evvmSignedAction.data.nonce,
      signatureEvvm: evvmSignedAction.data.signature,
    });
  }

  /**
   * Create and sign a `dispatchOrder` action (fixed fee variant).
   *
   * @param {bigint} nonce - Dispatch nonce
   * @param {HexString} tokenA - Token A address
   * @param {HexString} tokenB - Token B address
   * @param {bigint} orderId - Order identifier
   * @param {bigint} amountOfTokenBToFill - Amount of token B to fill
   * @param {bigint} maxFillFixedFee - Max fixed fee for filling
   * @param {SignedAction<IPayData>} evvmSignedAction - Underlying EVVM pay signed action
   * @returns {Promise<SignedAction<IDispatchOrderFixedFeeData>>} Signed dispatch order action
   */
  @SignMethod
  async dispatchOrder_fillFixedFee({
    nonce,
    tokenA,
    tokenB,
    orderId,
    amountOfTokenBToFill,
    maxFillFixedFee,
    evvmSignedAction,
  }: {
    nonce: bigint;
    tokenA: HexString;
    tokenB: HexString;
    orderId: bigint;
    amountOfTokenBToFill: bigint;
    maxFillFixedFee: bigint;
    evvmSignedAction: SignedAction<IPayData>;
  }): Promise<SignedAction<IDispatchOrderFixedFeeData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "dispatchOrder_fillFixedFee";

    const hashPayload = this.buildHashPayload(functionName, {
      tokenA,
      tokenB,
      orderId,
    });
    const message = this.buildMessageToSign(evvmId, hashPayload, nonce, true);
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, functionName, {
      user: this.signer.address,
      metadata: {
        nonce,
        tokenA,
        tokenB,
        orderId,
        amountOfTokenBToFill: amountOfTokenBToFill,
        signature,
      },
      maxFillFixedFee,
      priorityFeeEvvm: evvmSignedAction.data.priorityFee,
      nonceEvvm: evvmSignedAction.data.nonce,
      signatureEvvm: evvmSignedAction.data.signature,
    });
  }
}
