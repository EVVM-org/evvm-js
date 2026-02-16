import type {
  IPayData,
  IAcceptOfferData,
  IAddCustomMetadataData,
  IFlushCustomMetadataData,
  IFlushUsernameData,
  IMakeOfferData,
  IPreRegistrationUsernameData,
  IRegistrationUsernameData,
  IRemoveCustomMetadataData,
  IRenewUsernameData,
  IWithdrawOfferData,
  IBaseServiceProps,
  HexString,
} from "@/types";
import { BaseService, SignedAction, SignMethod } from "./lib";
import { NameServiceABI } from "@/abi";
import { zeroAddress } from "viem";

/**
 * NameService wrapper.
 *
 * Creates signed actions for NameService operations such as offers,
 * username registration, metadata management and renewal. Each helper
 * returns a `SignedAction` that bundles the required metadata and
 * EIP-191 signature for execution.
 */
export class NameService extends BaseService {
  constructor(props: Omit<IBaseServiceProps, "abi">) {
    super({ ...props, abi: NameServiceABI });
  }

  /**
   * Create and sign a `makeOffer` action for a username.
   *
   * @param {string} username - Username being offered for
   * @param {bigint} expirationDate - Expiration timestamp
   * @param {bigint} amount - Offer amount
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IMakeOfferData>>} Signed make offer action
   */
  @SignMethod
  async makeOffer({
    username,
    expirationDate,
    amount,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    expirationDate: bigint;
    amount: bigint;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IMakeOfferData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "makeOffer";

    const hashPayload = this.buildHashPayload(functionName, {
      username,
      amount,
      expirationDate,
    });
    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "makeOffer", {
      user: this.signer.address,
      username,
      expirationDate,
      amount,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `withdrawOffer` action.
   *
   * @param {string} username - Username tied to the offer
   * @param {bigint} offerID - Offer identifier
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IWithdrawOfferData>>} Signed withdraw offer action
   */
  @SignMethod
  async withdrawOffer({
    username,
    offerID,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    offerID: bigint;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IWithdrawOfferData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("withdrawOffer", {
      username,
      offerID,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "withdrawOffer", {
      user: this.signer.address,
      username,
      offerID,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign an `acceptOffer` action.
   *
   * @param {string} username - Username tied to the offer
   * @param {bigint} offerID - Offer identifier
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IAcceptOfferData>>} Signed accept offer action
   */
  @SignMethod
  async acceptOffer({
    username,
    offerID,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    offerID: bigint;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IAcceptOfferData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("acceptOffer", {
      username,
      offerID,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "acceptOffer", {
      user: this.signer.address,
      username,
      offerID,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `preRegistrationUsername` action with a hashed username.
   *
   * @param {string} hashPreRegisteredUsername - Hashed pre-registered username
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IPreRegistrationUsernameData>>} Signed pre-registration action
   */
  @SignMethod
  async preRegistrationUsername({
    hashPreRegisteredUsername,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    hashPreRegisteredUsername: string;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IPreRegistrationUsernameData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("preRegistrationUsername", {
      hashPreRegisteredUsername,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "preRegistrationUsername", {
      user: this.signer.address,
      hashPreRegisteredUsername,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `registrationUsername` action.
   *
   * @param {string} username - Username to register
   * @param {bigint} lockNumber - Lock number used by NameService
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IRegistrationUsernameData>>} Signed registration action
   */
  @SignMethod
  async registrationUsername({
    username,
    lockNumber,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    lockNumber: bigint;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRegistrationUsernameData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("registrationUsername", {
      username,
      lockNumber,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "registrationUsername", {
      user: this.signer.address,
      username,
      lockNumber,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign an `addCustomMetadata` action for an identity.
   *
   * @param {string} identity - Target identity
   * @param {string} value - Metadata value to add
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IAddCustomMetadataData>>} Signed add metadata action
   */
  @SignMethod
  async addCustomMetadata({
    identity,
    value,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    identity: string;
    value: string;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IAddCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("addCustomMetadata", {
      identity,
      value,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "addCustomMetadata", {
      user: this.signer.address,
      identity,
      value,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `removeCustomMetadata` action.
   *
   * @param {string} identity - Target identity
   * @param {bigint} key - Metadata key to remove
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IRemoveCustomMetadataData>>} Signed remove metadata action
   */
  @SignMethod
  async removeCustomMetadata({
    identity,
    key,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    identity: string;
    key: bigint;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRemoveCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("removeCustomMetadata", {
      identity,
      key,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "removeCustomMetadata", {
      user: this.signer.address,
      identity,
      key,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `flushCustomMetadata` action.
   *
   * @param {string} identity - Target identity
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IFlushCustomMetadataData>>} Signed flush metadata action
   */
  @SignMethod
  async flushCustomMetadata({
    identity,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    identity: string;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IFlushCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("flushCustomMetadata", {
      identity,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "flushCustomMetadata", {
      user: this.signer.address,
      identity,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `flushUsername` action.
   *
   * @param {string} username - Username to flush
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IFlushUsernameData>>} Signed flush username action
   */
  @SignMethod
  async flushUsername({
    username,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IFlushUsernameData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("flushUsername", {
      username,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "flushUsername", {
      user: this.signer.address,
      username,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `renewUsername` action.
   *
   * @param {string} username - Username to renew
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>} [evvmSignedAction] - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IRenewUsernameData>>} Signed renewal action
   */
  @SignMethod
  async renewUsername({
    username,
    originExecutor = zeroAddress,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    originExecutor?: HexString;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRenewUsernameData>> {
    const evvmId = await this.getEvvmID();

    const hashPayload = this.buildHashPayload("renewUsername", {
      username,
    });

    const message = this.buildMessageToSign(
      evvmId,
      hashPayload,
      originExecutor,
      nonce,
      true,
    );

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "renewUsername", {
      user: this.signer.address,
      username,
      originExecutor,
      nonce,
      signature,
      priorityFeePay: evvmSignedAction?.data.priorityFee,
      noncePay: evvmSignedAction?.data.nonce,
      signaturePay: evvmSignedAction?.data.signature,
    });
  }
}
