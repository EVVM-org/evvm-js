import type {
  HexString,
  ICancelOrderData,
  IDispatchOrderData,
  IDispatchOrderFixedFeeData,
  IMakeOrderData,
  IPayData,
  ISigner,
} from "@/types";
import { BaseService, SignedAction } from "./lib";
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
  constructor(signer: ISigner, address: HexString) {
    super(signer, address, P2PSwapABI);
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
   * @returns {Promise<SignedAction<IMakeOrderData>>}
   */
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

    const inputs: string =
      `${nonce.toString()},` +
      `${tokenA},` +
      `${tokenB},` +
      `${amountA},` +
      `${amountB}`;

    const message = `${evvmId},makeOrder,${inputs}`;

    const signature = await this.signERC191Message(message);

    return new SignedAction(this, evvmId, "makeOrder", {
      user: this.signer.address,
      metadata: {
        nonce,
        tokenA,
        tokenB,
        amountA,
        amountB,
      },
      signature,
      _priorityFee_Evvm: evvmSignedAction.data.priorityFee,
      _nonce_Evvm: evvmSignedAction.data.nonce,
      _priority_Evvm: evvmSignedAction.data.priorityFlag,
      _signature_Evvm: evvmSignedAction.data.signature,
    });
  }

  /**
   * Create and sign a `cancelOrder` action.
   *
   * @param {bigint} nonce - Order nonce
   * @param {HexString} tokenA - Token A address
   * @param {HexString} tokenB - Token B address
   * @param {bigint} orderId - Order identifier
   * @param {SignedAction<IPayData>=} evvmSignedAction - Optional EVVM pay signed action
   * @returns {Promise<SignedAction<ICancelOrderData>>}
   */
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

    const inputs: string =
      `${nonce.toString()},` +
      `${tokenA},` +
      `${tokenB},` +
      `${orderId.toString()}`;

    const message = `${evvmId},cancelOrder,${inputs}`;

    const signature = await this.signERC191Message(message);

    return new SignedAction(this, evvmId, "cancelOrder", {
      user: this.signer.address,
      metadata: {
        nonce,
        tokenA,
        tokenB,
        orderId,
        signature,
      },
      _priorityFee_Evvm: evvmSignedAction?.data.priorityFee,
      _nonce_Evvm: evvmSignedAction?.data.nonce,
      _priority_Evvm: evvmSignedAction?.data.priorityFlag,
      _signature_Evvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `dispatchOrder` action (proportional fee variant).
   *
   * @param {bigint} nonce
   * @param {HexString} tokenA
   * @param {HexString} tokenB
   * @param {bigint} orderId
   * @param {bigint} amountOfTokenBToFill
   * @param {SignedAction<IPayData>} evvmSignedAction
   * @returns {Promise<SignedAction<IDispatchOrderData>>}
   */
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

    const inputs: string =
      `${nonce.toString()},` +
      `${tokenA},` +
      `${tokenB},` +
      `${orderId.toString()}`;

    const message = `${evvmId},dispatchOrder,${inputs}`;

    const signature = await this.signERC191Message(message);

    return new SignedAction(this, evvmId, "dispatchOrder_fillPropotionalFee", {
      user: this.signer.address,
      metadata: {
        nonce,
        tokenA,
        tokenB,
        orderId,
        amountOfTokenBToFill: amountOfTokenBToFill,
        signature,
      },
      _priorityFee_Evvm: evvmSignedAction.data.priorityFee,
      _nonce_Evvm: evvmSignedAction.data.nonce,
      _priority_Evvm: evvmSignedAction.data.priorityFlag,
      _signature_Evvm: evvmSignedAction.data.signature,
    });
  }

  /**
   * Create and sign a `dispatchOrder` action (fixed fee variant).
   *
   * @param {bigint} nonce
   * @param {HexString} tokenA
   * @param {HexString} tokenB
   * @param {bigint} orderId
   * @param {bigint} amountOfTokenBToFill
   * @param {bigint} maxFillFixedFee
   * @param {SignedAction<IPayData>} evvmSignedAction
   * @returns {Promise<SignedAction<IDispatchOrderFixedFeeData>>}
   */
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

    const inputs: string =
      `${nonce.toString()},` +
      `${tokenA},` +
      `${tokenB},` +
      `${orderId.toString()}`;

    const message = `${evvmId},dispatchOrder,${inputs}`;

    const signature = await this.signERC191Message(message);

    return new SignedAction(this, evvmId, "dispatchOrder_fillFixedFee", {
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
      _priorityFee_Evvm: evvmSignedAction.data.priorityFee,
      _nonce_Evvm: evvmSignedAction.data.nonce,
      _priority_Evvm: evvmSignedAction.data.priorityFlag,
      _signature_Evvm: evvmSignedAction.data.signature,
    });
  }
}
