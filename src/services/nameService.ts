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
import { BaseService, SignedAction } from "./lib";
import { NameServiceABI } from "@/abi";

export class NameService extends BaseService {
  constructor(signer: ISigner, address: HexString) {
    super(signer, address, NameServiceABI);
  }

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
