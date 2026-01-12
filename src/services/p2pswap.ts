import type {
  HexString,
  ICancelOrderData,
  IDispatchOrderData,
  IMakeOrderData,
  IPayData,
  ISigner,
} from "@/types";
import { BaseService, SignedAction } from "./lib";
import { P2PSwapABI } from "@/abi";

export class P2PSwap extends BaseService {
  constructor(signer: ISigner, address: HexString) {
    super(signer, address, P2PSwapABI);
  }

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
      _priorityFlag_Evvm: evvmSignedAction.data.priorityFlag,
      _signature_Evvm: evvmSignedAction.data.signature,
    });
  }

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
      _priorityFlag_Evvm: evvmSignedAction?.data.priorityFlag,
      _signature_Evvm: evvmSignedAction?.data.signature,
    });
  }

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

    return new SignedAction(this, evvmId, "dispatchOrder", {
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
      _priorityFlag_Evvm: evvmSignedAction.data.priorityFlag,
      _signature_Evvm: evvmSignedAction.data.signature,
    });
  }
}
