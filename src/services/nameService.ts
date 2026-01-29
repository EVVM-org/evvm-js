import type {
  HexString,
  ISigner,
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
} from "@/types";
import { BaseService, SignedAction, SignMethod } from "./lib";
import { NameServiceABI } from "@/abi";
import type { IBaseServiceProps } from "@/types/services/base-service.type";

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
   * @param {HexString=} user - Optional user address (defaults to signer)
   * @param {string} username - Username being offered for
   * @param {bigint} expireDate - Expiration timestamp
   * @param {bigint} amount - Offer amount
   * @param {bigint} nonce - NameService nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction - Optional EVVM signed pay action
   * @returns {Promise<SignedAction<IMakeOfferData>>}
   */
  @SignMethod
  async makeOffer({
    user,
    username,
    expireDate,
    amount,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    username: string;
    expireDate: bigint;
    amount: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IMakeOfferData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${username},` +
      `${expireDate.toString()},` +
      `${amount.toString()},` +
      `${nonce.toString()}`;

    const message = `${evvmId},makeOffer,${inputs}`;

    const signature = await this.signERC191Message(message);

    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "makeOffer", {
      user: userAddress,
      username,
      expireDate,
      amount,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `withdrawOffer` action.
   *
   * @param {HexString=} user - Optional address (defaults to signer)
   * @param {string} username
   * @param {bigint} offerID
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IWithdrawOfferData>>}
   */
  @SignMethod
  async withdrawOffer({
    user,
    username,
    offerID,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    username: string;
    offerID: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IWithdrawOfferData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${username},` + `${offerID.toString()},` + `${nonce.toString()}`;

    const message = `${evvmId},withdrawOffer,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "withdrawOffer", {
      user: userAddress,
      username,
      offerID,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign an `acceptOffer` action.
   *
   * @param {HexString=} user
   * @param {string} username
   * @param {bigint} offerID
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IAcceptOfferData>>}
   */
  @SignMethod
  async acceptOffer({
    user,
    username,
    offerID,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    username: string;
    offerID: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IAcceptOfferData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${username},` + `${offerID.toString()},` + `${nonce.toString()}`;

    const message = `${evvmId},acceptOffer,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "acceptOffer", {
      user: userAddress,
      username,
      offerID,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `preRegistrationUsername` action with a hashed username.
   *
   * @param {HexString=} user
   * @param {string} hashPreRegisteredUsername
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IPreRegistrationUsernameData>>}
   */
  @SignMethod
  async preRegistrationUsername({
    user,
    hashPreRegisteredUsername,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    hashPreRegisteredUsername: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IPreRegistrationUsernameData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${hashPreRegisteredUsername},${nonce.toString()}`;

    const message = `${evvmId},preRegistrationUsername,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "preRegistrationUsername", {
      user: userAddress,
      hashPreRegisteredUsername,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `registrationUsername` action.
   *
   * @param {HexString=} user
   * @param {string} username
   * @param {bigint} clowNumber
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IRegistrationUsernameData>>}
   */
  @SignMethod
  async registrationUsername({
    user,
    username,
    clowNumber,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    username: string;
    clowNumber: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRegistrationUsernameData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${username},` + `${clowNumber.toString()},` + `${nonce.toString()}`;

    const message = `${evvmId},registrationUsername,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "registrationUsername", {
      user: userAddress,
      username,
      clowNumber,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign an `addCustomMetadata` action for an identity.
   *
   * @param {HexString=} user
   * @param {string} identity
   * @param {string} value
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IAddCustomMetadataData>>}
   */
  @SignMethod
  async addCustomMetadata({
    user,
    identity,
    value,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    identity: string;
    value: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IAddCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${identity},${value},${nonce.toString()}`;

    const message = `${evvmId},addCustomMetadata,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "addCustomMetadata", {
      user: userAddress,
      identity,
      value,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `removeCustomMetadata` action.
   *
   * @param {HexString=} user
   * @param {string} identity
   * @param {bigint} key
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IRemoveCustomMetadataData>>}
   */
  @SignMethod
  async removeCustomMetadata({
    user,
    identity,
    key,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    identity: string;
    key: bigint;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRemoveCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string =
      `${identity},` + `${key.toString()},` + `${nonce.toString()}`;

    const message = `${evvmId},removeCustomMetadata,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "removeCustomMetadata", {
      user: userAddress,
      identity,
      key,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `flushCustomMetadata` action.
   *
   * @param {HexString=} user
   * @param {string} identity
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IFlushCustomMetadataData>>}
   */
  @SignMethod
  async flushCustomMetadata({
    user,
    identity,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    identity: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IFlushCustomMetadataData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${identity},${nonce.toString()}`;

    const message = `${evvmId},flushCustomMetadata,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "flushCustomMetadata", {
      user: userAddress,
      identity,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `flushUsername` action.
   *
   * @param {HexString=} user
   * @param {string} username
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IFlushUsernameData>>}
   */
  @SignMethod
  async flushUsername({
    user,
    username,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    username: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IFlushUsernameData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${username},${nonce.toString()}`;

    const message = `${evvmId},flushUsername,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "flushUsername", {
      user: userAddress,
      username,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }

  /**
   * Create and sign a `renewUsername` action.
   *
   * @param {HexString=} user
   * @param {string} username
   * @param {bigint} nonce
   * @param {SignedAction<IPayData>=} evvmSignedAction
   * @returns {Promise<SignedAction<IRenewUsernameData>>}
   */
  @SignMethod
  async renewUsername({
    user,
    username,
    nonce,
    evvmSignedAction,
  }: {
    user?: HexString;
    username: string;
    nonce: bigint;
    evvmSignedAction?: SignedAction<IPayData>;
  }): Promise<SignedAction<IRenewUsernameData>> {
    const evvmId = await this.getEvvmID();

    const inputs: string = `${username},${nonce.toString()}`;

    const message = `${evvmId},renewUsername,${inputs}`;

    const signature = await this.signERC191Message(message);
    const userAddress = user ?? this.signer.address;

    return new SignedAction(this, evvmId, "renewUsername", {
      user: userAddress,
      username,
      nonce,
      signature,
      priorityFee_EVVM: evvmSignedAction?.data.priorityFee,
      nonce_EVVM: evvmSignedAction?.data.nonce,
      priorityFlag_EVVM: evvmSignedAction?.data.priorityFlag,
      signature_EVVM: evvmSignedAction?.data.signature,
    });
  }
}
