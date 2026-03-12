import type {
  HexString,
  IPayData,
  IPresaleStakingData,
  IPublicStakingData,
  IGoldenStakingData,
  IBaseServiceProps,
} from "@/types";
import { BaseService, SignedAction, SignMethod } from "./lib";
import { StakingABI } from "@/abi";
import { zeroAddress } from "viem";

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

  /**
   * Create and sign a `presaleStaking` action.
   *
   * @param {boolean} isStaking - Whether user is staking or unstaking
   * @param {bigint} nonce - Stake nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM pay signed action
   * @returns {Promise<SignedAction<IPresaleStakingData>>} Signed presale staking action
   */
  @SignMethod
  async presaleStaking({
    isStaking,
    senderExecutor = zeroAddress,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    isStaking: boolean;
    senderExecutor?: HexString;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IPresaleStakingData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "presaleStaking";

    const hashPayload = this.buildHashPayload(
      functionName,
      {
        isStaking,
        amountOfStaking: 1n,
      },
      {
        customAbiParams: [
          {
            name: "amountOfStaking",
            type: "uint256",
            insertAfter: "isStaking",
          },
        ],
      },
    );
    const message = this.buildMessageToSign(
      evvmId,
      senderExecutor,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "presaleStaking", {
      user: this.signer.address,
      isStaking,
      senderExecutor,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `publicStaking` action.
   *
   * @param {boolean} isStaking - Whether user is staking or unstaking
   * @param {bigint} amountOfStaking - Amount to stake or unstake
   * @param {bigint} nonce - Stake nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM pay signed action
   * @returns {Promise<SignedAction<IPublicStakingData>>} Signed public staking action
   */
  @SignMethod
  async publicStaking({
    isStaking,
    amountOfStaking,
    senderExecutor = zeroAddress,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    isStaking: boolean;
    amountOfStaking: bigint;
    senderExecutor?: HexString;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IPublicStakingData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "publicStaking";

    const hashPayload = this.buildHashPayload(functionName, {
      isStaking,
      amountOfStaking,
    });
    const message = this.buildMessageToSign(
      evvmId,
      senderExecutor,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "publicStaking", {
      user: this.signer.address,
      isStaking,
      amountOfStaking,
      senderExecutor,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create a `goldenStaking` action used by the golden fisher.
   *
   * This helper packages the provided amount and optional EVVM signature
   * into a `SignedAction`. Note: the golden staking flow expects the
   * on-chain verification to use the EVVM signature provided in
   * `evvmSignedAction`.
   *
   * @param {boolean} isStaking - Whether user is staking or unstaking
   * @param {bigint} amountOfStaking - Amount to stake or unstake
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM pay signed action
   * @returns {Promise<SignedAction<IGoldenStakingData>>} Signed golden staking action
   */
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
    const evvmId = await this.getEvvmID();

    const userSignature = evvmSignedAction?.data.signature;

    return new SignedAction(this, evvmId, "goldenStaking", {
      isStaking,
      amountOfStaking,
      signaturePay: userSignature,
    });
  }
}
