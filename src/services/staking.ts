import type {
  HexString,
  ISigner,
  IPayData,
  IPresaleStakingData,
  IPublicStakingData,
  IGoldenStakingData,
} from "@/types";
import { BaseService, SignedAction } from "./lib";
import { StakingABI } from "@/abi";

/**
 * Staking service wrapper.
 *
 * Provides helpers to build signed staking-related actions (`presaleStaking`,
 * `publicStaking`, `goldenStaking`). Each helper returns a `SignedAction`
 * containing the serialized metadata and signature required for the
 * corresponding contract call.
 */
export class Staking extends BaseService {
  constructor(signer: ISigner, address: HexString) {
    super(signer, address, StakingABI);
  }

  async presaleStaking({
    user,
    isStaking,
    amountOfStaking = 0n,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    isStaking: boolean;
    amountOfStaking?: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IPresaleStakingData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${isStaking ? "true" : "false"},` +
      `${amountOfStaking.toString()},` +
      `${nonce.toString()}`;

    const message = `${evvmId},presaleStaking,${inputs}`;

    const signature = await this.signERC191Message(message);

    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "presaleStaking", {
      user: userAddress,
      isStaking,
      amountOfStaking,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  async publicStaking({
    user,
    isStaking,
    amountOfStaking,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    isStaking: boolean;
    amountOfStaking: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IPublicStakingData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${isStaking ? "true" : "false"},` +
      `${amountOfStaking.toString()},` +
      `${nonce.toString()}`;

    const message = `${evvmId},publicStaking,${inputs}`;

    const signature = await this.signERC191Message(message);

    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "publicStaking", {
      user: userAddress,
      isStaking,
      amountOfStaking,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  async goldenStaking({
    isStaking,
    amountOfStaking,
    evvmSignedAction,
  }: {
    isStaking: boolean;
    amountOfStaking: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IGoldenStakingData>> {
    const evvmId = await this.getEvvmID();

    // todo: review this
    // goldenStaking does not use a user-signed ERC191 message for the staking action
    const userSignature = evvmSignedAction?.data.signature;

    return new SignedAction(this, evvmId, "goldenStaking", {
      isStaking,
      amountOfStaking,
      signature_EVVM: userSignature,
    });
  }
}
