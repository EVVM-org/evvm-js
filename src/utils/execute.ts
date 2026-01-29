import {
  SignedAction,
  type IBaseDataSchema,
  type ISerializableSignedAction,
} from "@/services/lib/signed-action";
import type { ISigner, HexString } from "@/types";

interface IExecuteOptions {
  gas?: number;
}

/**
 * Executes the given SignedAction
 */
export const execute = async <T extends IBaseDataSchema>(
  signer: ISigner,
  action: SignedAction<T> | ISerializableSignedAction<T>,
  opts: IExecuteOptions,
): Promise<HexString> => {
  const serializedAction =
    action instanceof SignedAction ? action.toJSON() : action;

  const activeChain = await signer.getChainId();
  if (serializedAction.chainId != activeChain) {
    // switch chains
    await signer.switchChain(serializedAction.chainId);
  }

  return signer.writeContract({
    contractAbi: [serializedAction.functionAbi],
    contractAddress: serializedAction.contractAddress,
    args: serializedAction.args,
    functionName: serializedAction.functionName,
    gas: opts.gas,
  });
};
