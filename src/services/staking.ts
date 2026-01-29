import type {
  HexString,
  ISigner,
  IPayData,
  IPresaleStakingData,
  IPublicStakingData,
  IGoldenStakingData,
} from "@/types";
import { BaseService, SignedAction, SignMethod } from "./lib";
import { StakingABI } from "@/abi";
import type { IBaseServiceProps } from "@/types/services/base-service.type";

/**
 * Staking service wrapper.
 *
 * Provides helpers to build signed staking-related actions (`presaleStaking`,
 * `publicStaking`, `goldenStaking`). Each helper returns a `SignedAction`
 * containing the serialized metadata and signature required for the
 * corresponding contract call.
 */
export class Staking extends BaseService {
  constructor(props: Omit<IBaseServiceProps, "abi">) {
    super({ ...props, abi: StakingABI });
  }

  @SignMethod
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
    /**
     * Create and sign a `presaleStaking` action.
     *
     * @param {HexString=} user - Optional user address (defaults to signer)
     * @param {boolean} isStaking - Whether user is staking or unstaking
     * @param {bigint=} amountOfStaking - Amount to stake (0 if not applicable)
     * @param {bigint} nonce - Stake nonce
     * @param {SignedAction<IPayData>=} evvmSignedAction - Optional EVVM pay signed action
     * @returns {Promise<SignedAction<IPresaleStakingData>>}
     */
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

  @SignMethod
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
    /**
     * Create and sign a `publicStaking` action.
     *
     * @param {HexString=} user
     * @param {boolean} isStaking
     * @param {bigint} amountOfStaking
     * @param {bigint} nonce
     * @param {SignedAction<IPayData>=} evvmSignedAction
     * @returns {Promise<SignedAction<IPublicStakingData>>}
     */
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

  @SignMethod
  async goldenStaking({
    isStaking,
    amountOfStaking,
    evvmSignedAction,
  }: {
    isStaking: boolean;
    amountOfStaking: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IGoldenStakingData>> {
    /**
     * Create a `goldenStaking` action used by the golden fisher.
     *
     * This helper packages the provided amount and optional EVVM signature
     * into a `SignedAction`. Note: the golden staking flow expects the
     * on-chain verification to use the EVVM signature provided in
     * `evvmSignedAction`.
     *
     * @param {boolean} isStaking
     * @param {bigint} amountOfStaking
     * @param {SignedAction<IPayData>=} evvmSignedAction
     * @returns {Promise<SignedAction<IGoldenStakingData>>}
     */
    const evvmId = await this.getEvvmID();

    const userSignature = evvmSignedAction?.data.signature;

    return new SignedAction(this, evvmId, "goldenStaking", {
      isStaking,
      amountOfStaking,
      signature_EVVM: userSignature,
    });
  }
}
