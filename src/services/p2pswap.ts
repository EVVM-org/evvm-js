import type { HexString, IMakeOrderData, IPayData, ISigner } from "@/types";
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
    user: HexString;
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
}
