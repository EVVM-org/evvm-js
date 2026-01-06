import {
  SignedAction,
  type IBaseDataSchema,
  type ISerializableSignedAction,
} from "@/services/lib/signed-action";
import type { HexString } from "@/types/hexstring.type";
import type { ISigner } from "@/types/signer.type";

/**
 * Executes the given SignedAction
 */
export const execute = async <T extends IBaseDataSchema>(
  signer: ISigner,
  action: SignedAction<T> | ISerializableSignedAction<T>,
): Promise<HexString> => {
  const serializedAction =
    action instanceof SignedAction ? action.toJSON() : action;

  return signer.writeContract({
    contractAbi: [serializedAction.functionAbi],
    contractAddress: serializedAction.contractAddress,
    args: serializedAction.args,
    functionName: serializedAction.functionName,
  });
};
