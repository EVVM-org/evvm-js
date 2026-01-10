import type { ISigner } from "@/types";

export class SignatureBuilder {
  protected signer: ISigner;

  constructor(signer: ISigner) {
    this.signer = signer;
  }

  signERC191Message(message: string): Promise<string> {
    return this.signer.signMessage(message);
  }
}
