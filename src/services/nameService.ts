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
} from "@/types";
import { BaseService, SignedAction, SignMethod } from "./lib";
import { NameServiceABI } from "@/abi";

/**
 * NameService service wrapper.
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
   * @param {SignedAction<IPayData>=} evvmSignedAction - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IMakeOfferData>>}
   */
  @SignMethod
  async makeOffer({
    username,
    expirationDate,
    amount,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    expirationDate: bigint;
    amount: bigint;
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
    const message = this.buildMessageToSign(evvmId, hashPayload, nonce, true);
    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "makeOffer", {
      user: this.signer.address,
      username,
      expirationDate,
      amount,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `withdrawOffer` action.
   *
   * @param {string} username
   * @param {bigint} offerID
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IWithdrawOfferData>>}
   */
  @SignMethod
  async withdrawOffer({
    username,
    offerID,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    offerID: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IWithdrawOfferData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${username},` + `${offerID.toString()},` + `${nonce.toString()}`;

    const message = `${evvmId},withdrawOffer,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "withdrawOffer", {
      user: this.signer.address,
      username,
      offerID,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign an `acceptOffer` action.
   *
   * @param {string} username
   * @param {bigint} offerID
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IAcceptOfferData>>}
   */
  @SignMethod
  async acceptOffer({
    username,
    offerID,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    offerID: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IAcceptOfferData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${username},` + `${offerID.toString()},` + `${nonce.toString()}`;

    const message = `${evvmId},acceptOffer,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "acceptOffer", {
      user: this.signer.address,
      username,
      offerID,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `preRegistrationUsername` action with a hashed username.
   *
   * @param {string} hashPreRegisteredUsername
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IPreRegistrationUsernameData>>}
   */
  @SignMethod
  async preRegistrationUsername({
    hashPreRegisteredUsername,
    nonce,
    evvmSignedAction,
  }: {
    hashPreRegisteredUsername: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IPreRegistrationUsernameData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${hashPreRegisteredUsername},${nonce.toString()}`;

    const message = `${evvmId},preRegistrationUsername,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "preRegistrationUsername", {
      user: this.signer.address,
      hashPreRegisteredUsername,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `registrationUsername` action.
   *
   * @param {string} username
   * @param {bigint} lockNumber
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IRegistrationUsernameData>>}
   */
  @SignMethod
  async registrationUsername({
    username,
    lockNumber,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    lockNumber: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRegistrationUsernameData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${username},` + `${lockNumber.toString()},` + `${nonce.toString()}`;

    const message = `${evvmId},registrationUsername,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "registrationUsername", {
      user: this.signer.address,
      username,
      lockNumber,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign an `addCustomMetadata` action for an identity.
   *
   * @param {string} identity
   * @param {string} value
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IAddCustomMetadataData>>}
   */
  @SignMethod
  async addCustomMetadata({
    identity,
    value,
    nonce,
    evvmSignedAction,
  }: {
    identity: string;
    value: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IAddCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${identity},${value},${nonce.toString()}`;

    const message = `${evvmId},addCustomMetadata,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "addCustomMetadata", {
      user: this.signer.address,
      identity,
      value,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `removeCustomMetadata` action.
   *
   * @param {string} identity
   * @param {bigint} key
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IRemoveCustomMetadataData>>}
   */
  @SignMethod
  async removeCustomMetadata({
    identity,
    key,
    nonce,
    evvmSignedAction,
  }: {
    identity: string;
    key: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRemoveCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${identity},` + `${key.toString()},` + `${nonce.toString()}`;

    const message = `${evvmId},removeCustomMetadata,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "removeCustomMetadata", {
      user: this.signer.address,
      identity,
      key,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `flushCustomMetadata` action.
   *
   * @param {string} identity
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IFlushCustomMetadataData>>}
   */
  @SignMethod
  async flushCustomMetadata({
    identity,
    nonce,
    evvmSignedAction,
  }: {
    identity: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IFlushCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${identity},${nonce.toString()}`;

    const message = `${evvmId},flushCustomMetadata,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "flushCustomMetadata", {
      user: this.signer.address,
      identity,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `flushUsername` action.
   *
   * @param {string} username
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IFlushUsernameData>>}
   */
  @SignMethod
  async flushUsername({
    username,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IFlushUsernameData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${username},${nonce.toString()}`;

    const message = `${evvmId},flushUsername,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "flushUsername", {
      user: this.signer.address,
      username,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `renewUsername` action.
   *
   * @param {string} username
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IRenewUsernameData>>}
   */
  @SignMethod
  async renewUsername({
    username,
    nonce,
    evvmSignedAction,
  }: {
    username: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRenewUsernameData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${username},${nonce.toString()}`;

    const message = `${evvmId},renewUsername,${inputs}`;

    const signature = await this.signer.signMessage(message);

    return new SignedAction(this, evvmId, "renewUsername", {
      user: this.signer.address,
      username,
      nonce,
      signature,
      priorityFeeEvvm: evvmSignedAction?.data.priorityFee,
      nonceEvvm: evvmSignedAction?.data.nonce,
      signatureEvvm: evvmSignedAction?.data.signature,
    });
  }
}
